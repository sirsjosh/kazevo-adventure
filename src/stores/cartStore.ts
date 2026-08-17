import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { ShopifyProduct } from "@/lib/shopify";
import {
  createShopifyCart,
  addLineToShopifyCart,
  updateShopifyCartLine,
  removeLineFromShopifyCart,
  getShopifyCart,
  formatCheckoutUrl,
} from "@/lib/shopify";

import { trackAddToCart } from "@/lib/meta-pixel";
import { isAccessoryHandle } from "@/lib/productContent";
import { readClientCountry } from "@/lib/market";



export interface CartItem {
  lineId: string | null;
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
  imageUrl?: string;
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  countryCode: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  isDrawerOpen: boolean;
  addItem: (item: Omit<CartItem, "lineId">) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  getCheckoutUrl: () => string | null;
  setDrawerOpen: (open: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      countryCode: null,
      isLoading: false,
      isSyncing: false,
      isDrawerOpen: false,

      addItem: async (item) => {
        const { items, cartId, clearCart } = get();
        const existingItem = items.find((i) => i.variantId === item.variantId);
        const countryCode = readClientCountry();

        set({ isLoading: true });
        try {
          let succeeded = false;
          if (!cartId) {
            const result = await createShopifyCart(
              { variantId: item.variantId, quantity: item.quantity },
              countryCode
            );
            if (result) {
              succeeded = true;
              set({
                cartId: result.cartId,
                checkoutUrl: result.checkoutUrl,
                countryCode,
                items: [{ ...item, lineId: result.lineId }],
                isDrawerOpen: true,
              });
            }
          } else if (existingItem) {
            const newQuantity = existingItem.quantity + item.quantity;
            if (!existingItem.lineId) {
              console.error("Cannot update quantity for item without lineId:", existingItem);
              return;
            }
            const result = await updateShopifyCartLine(
              cartId,
              existingItem.lineId,
              newQuantity,
              countryCode
            );
            if (result.success) {
              succeeded = true;
              const currentItems = get().items;
              set({
                items: currentItems.map((i) =>
                  i.variantId === item.variantId ? { ...i, quantity: newQuantity } : i
                ),
                isDrawerOpen: true,
              });
            } else if (result.cartNotFound) {
              clearCart();
            }
          } else {
            const result = await addLineToShopifyCart(
              cartId,
              { variantId: item.variantId, quantity: item.quantity },
              countryCode
            );
            if (result.success) {
              succeeded = true;
              const currentItems = get().items;
              set({
                items: [
                  ...currentItems,
                  { ...item, lineId: result.lineId ?? null },
                ],
                isDrawerOpen: true,
              });
            } else if (result.cartNotFound) {
              clearCart();
            }
          }

          if (succeeded) {
            trackAddToCart({
              content_ids: [item.variantId],
              content_name: item.product.node.title,
              content_type: "product",
              currency: item.price.currencyCode,
              value: parseFloat(item.price.amount) * item.quantity,
              quantity: item.quantity,
            });
          }
        } catch (error) {
          console.error("Failed to add item:", error);
        } finally {
          set({ isLoading: false });
        }
      },


      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(variantId);
          return;
        }

        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;

        const countryCode = readClientCountry();
        set({ isLoading: true });
        try {
          const result = await updateShopifyCartLine(cartId, item.lineId, quantity, countryCode);
          if (result.success) {
            const currentItems = get().items;
            set({
              items: currentItems.map((i) =>
                i.variantId === variantId ? { ...i, quantity } : i
              ),
            });
          } else if (result.cartNotFound) {
            clearCart();
          }
        } catch (error) {
          console.error("Failed to update quantity:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (variantId) => {
        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;

        const countryCode = readClientCountry();
        set({ isLoading: true });
        try {
          const result = await removeLineFromShopifyCart(cartId, item.lineId, countryCode);
          if (result.success) {
            const currentItems = get().items;
            let newItems = currentItems.filter((i) => i.variantId !== variantId);

            // An accessory upsell can never stand alone — if only accessories
            // remain, drop them too so the cart is never accessory-only.
            const onlyAccessoriesLeft =
              newItems.length > 0 &&
              newItems.every((i) => isAccessoryHandle(i.product.node.handle));

            if (onlyAccessoriesLeft) {
              for (const leftover of newItems) {
                if (leftover.lineId) {
                  await removeLineFromShopifyCart(cartId, leftover.lineId, countryCode);
                }
              }
              newItems = [];
            }

            newItems.length === 0 ? clearCart() : set({ items: newItems });
          } else if (result.cartNotFound) {
            clearCart();
          }
        } catch (error) {
          console.error("Failed to remove item:", error);
        } finally {
          set({ isLoading: false });
        }
      },


      clearCart: () => set({ items: [], cartId: null, checkoutUrl: null, countryCode: null }),
      getCheckoutUrl: () => {
        const url = get().checkoutUrl;
        return url ? formatCheckoutUrl(url) : null;
      },

      setDrawerOpen: (open) => set({ isDrawerOpen: open }),

      syncCart: async () => {
        const { cartId, isSyncing, clearCart, countryCode: storedCountry } = get();
        if (!cartId || isSyncing) return;

        const countryCode = readClientCountry();
        // A Shopify cart is locked to the currency/market it was created in.
        // If the shopper changed country, clear the cart so a new cart is
        // created in the new market on the next add-to-cart.
        if (storedCountry && storedCountry !== countryCode) {
          clearCart();
          return;
        }

        set({ isSyncing: true });
        try {
          const data = await getShopifyCart(cartId, countryCode);
          if (!data) return;
          const cart = data?.data?.cart;
          if (!cart || cart.totalQuantity === 0) {
            clearCart();
            return;
          }
          // Refresh prices/quantities from Shopify so stale persisted carts show current pricing
          const byVariant = new Map(
            cart.lines.edges.map((e) => [e.node.merchandise.id, e.node])
          );
          set({
            items: get().items.map((i) => {
              const line = byVariant.get(i.variantId);
              return line
                ? { ...i, price: line.merchandise.price, quantity: line.quantity, lineId: line.id }
                : i;
            }),
          });
        } catch (error) {
          console.error("Failed to sync cart with Shopify:", error);
        } finally {

          set({ isSyncing: false });
        }
      },
    }),
    {
      name: "shopify-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        cartId: state.cartId,
        checkoutUrl: state.checkoutUrl,
        countryCode: state.countryCode,
      }),
    }
  )
);
