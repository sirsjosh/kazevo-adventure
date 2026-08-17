import { readClickIds } from "@/lib/meta-pixel";
import { getMarketByCode } from "@/lib/market";

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
      minVariantPrice: ShopifyMoney;
      maxVariantPrice?: ShopifyMoney;
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: ShopifyMoney;
          compareAtPrice?: ShopifyMoney | null;
          availableForSale: boolean;
          image?: { url: string } | null;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

export interface VariantSaleInfo {
  isOnSale: boolean;
  current: number;
  compareAt: number | null;
  savings: number;
  percentOff: number;
}

export function getVariantSaleInfo(
  variant: ShopifyProduct["node"]["variants"]["edges"][0]["node"],
  compareAtOverride?: number
): VariantSaleInfo {
  const current = parseFloat(variant.price.amount);
  const shopifyCompareAt = variant.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : null;
  const compareAt = compareAtOverride ?? shopifyCompareAt;
  const isOnSale = compareAt !== null && compareAt > current;
  const savings = isOnSale ? compareAt - current : 0;
  const percentOff = isOnSale ? Math.round((savings / compareAt) * 100) : 0;
  return { isOnSale, current, compareAt, savings, percentOff };
}

export interface ShopifyProductsResponse {
  data: {
    products: {
      edges: ShopifyProduct[];
    };
  };
}

const SHOPIFY_API_VERSION = "2025-07";
const SHOPIFY_STORE_PERMANENT_DOMAIN = "bsctke-ju.myshopify.com";
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = "5aa8021fdacca0eccf7517254b518901";

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String, $country: CountryCode) @inContext(country: $country) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                image { url }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!, $country: CountryCode) @inContext(country: $country) {
    product(handle: $handle) {
      id
      title
      description
      handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
            image { url }
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

export async function storefrontApiRequest<T = unknown>(
  query: string,
  variables: Record<string, unknown> = {},
  countryCode?: string
): Promise<T | undefined> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
  };
  if (countryCode) {
    const market = getMarketByCode(countryCode);
    headers["Accept-Language"] = market.locale;
  }

  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    throw new Error(
      "Shopify: Payment required. Your store needs an active Shopify billing plan to use the Storefront API."
    );
  }

  if (!response.ok) {
    throw new Error(`Shopify HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as { errors?: Array<{ message: string }> };

  if (data.errors) {
    throw new Error(`Shopify error: ${data.errors.map((e) => e.message).join(", ")}`);
  }

  return data as T;
}

export async function fetchShopifyProducts(
  query = "*",
  first = 50,
  countryCode?: string
): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest<ShopifyProductsResponse>(
    PRODUCTS_QUERY,
    { first, query, country: countryCode },
    countryCode
  );
  return data?.data?.products?.edges ?? [];
}

export async function fetchShopifyProductByHandle(
  handle: string,
  countryCode?: string
): Promise<ShopifyProduct["node"] | null> {
  const data = (await storefrontApiRequest<{
    data: { product: ShopifyProduct["node"] | null };
  }>(PRODUCT_BY_HANDLE_QUERY, { handle, country: countryCode }, countryCode)) ?? {
    data: { product: null },
  };
  return data.data.product;
}

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        buyerIdentity {
          countryCode
        }
        lines(first: 100) {
          edges {
            node {
              id
              merchandise {
                ... on ProductVariant { id }
              }
            }
          }
        }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) {
          edges {
            node {
              id
              merchandise {
                ... on ProductVariant { id }
              }
            }
          }
        }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id }
      userErrors { field message }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id }
      userErrors { field message }
    }
  }
`;

export function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    // The store's primary domain may point at this marketing site, which would
    // 404 on checkout paths. Always use the permanent myshopify.com domain.
    url.host = SHOPIFY_STORE_PERMANENT_DOMAIN;
    url.protocol = "https:";
    url.searchParams.set("channel", "online_store");
    // Checkout lives on another domain, so the _fbp/_fbc cookies set on
    // kazevo.store are invisible to Shopify's Conversions API. Forward the
    // click identifiers in the URL so server-side events keep attribution.
    const clickIds = readClickIds();
    if (clickIds.fbclid) url.searchParams.set("fbclid", clickIds.fbclid);
    if (clickIds.fbp) url.searchParams.set("fbp", clickIds.fbp);
    if (clickIds.fbc) url.searchParams.set("fbc", clickIds.fbc);
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}


function isCartNotFoundError(
  userErrors: Array<{ field: string[] | null; message: string }>
): boolean {
  return userErrors.some(
    (e) =>
      e.message.toLowerCase().includes("cart not found") ||
      e.message.toLowerCase().includes("does not exist")
  );
}

export interface CartItemInput {
  variantId: string;
  quantity: number;
}

export async function createShopifyCart(
  item: CartItemInput,
  countryCode?: string
): Promise<
  | {
      cartId: string;
      checkoutUrl: string;
      lineId: string;
      countryCode: string | undefined;
    }
  | null
> {
  const data = await storefrontApiRequest<{
    data: {
      cartCreate: {
        cart: {
          id: string;
          checkoutUrl: string;
          buyerIdentity?: { countryCode?: string };
          lines: {
            edges: Array<{
              node: { id: string; merchandise: { id: string } };
            }>;
          };
        } | null;
        userErrors: Array<{ field: string[] | null; message: string }>;
      };
    };
  }>(
    CART_CREATE_MUTATION,
    {
      input: {
        lines: [{ quantity: item.quantity, merchandiseId: item.variantId }],
        buyerIdentity: countryCode ? { countryCode } : undefined,
      },
    },
    countryCode
  );

  const userErrors = data?.data?.cartCreate?.userErrors ?? [];
  if (userErrors.length > 0) {
    console.error("Cart creation failed:", userErrors);
    return null;
  }

  const cart = data?.data?.cartCreate?.cart;
  if (!cart?.checkoutUrl) return null;

  const lineId = cart.lines.edges[0]?.node?.id;
  if (!lineId) return null;

  return {
    cartId: cart.id,
    checkoutUrl: formatCheckoutUrl(cart.checkoutUrl),
    lineId,
    countryCode: cart.buyerIdentity?.countryCode,
  };
}

export async function addLineToShopifyCart(
  cartId: string,
  item: CartItemInput,
  countryCode?: string
): Promise<{ success: boolean; lineId?: string; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest<{
    data: {
      cartLinesAdd: {
        cart: {
          lines: {
            edges: Array<{
              node: { id: string; merchandise: { id: string } };
            }>;
          };
        } | null;
        userErrors: Array<{ field: string[] | null; message: string }>;
      };
    };
  }>(
    CART_LINES_ADD_MUTATION,
    {
      cartId,
      lines: [{ quantity: item.quantity, merchandiseId: item.variantId }],
    },
    countryCode
  );

  const userErrors = data?.data?.cartLinesAdd?.userErrors ?? [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) {
    console.error("Add line failed:", userErrors);
    return { success: false };
  }

  const lines = data?.data?.cartLinesAdd?.cart?.lines?.edges ?? [];
  const newLine = lines.find((l) => l.node.merchandise.id === item.variantId);
  const lineId = newLine?.node?.id;
  return lineId ? { success: true, lineId } : { success: true };
}

export async function updateShopifyCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
  countryCode?: string
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest<{
    data: {
      cartLinesUpdate: {
        userErrors: Array<{ field: string[] | null; message: string }>;
      };
    };
  }>(
    CART_LINES_UPDATE_MUTATION,
    {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
    countryCode
  );

  const userErrors = data?.data?.cartLinesUpdate?.userErrors ?? [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) {
    console.error("Update line failed:", userErrors);
    return { success: false };
  }
  return { success: true };
}

export async function removeLineFromShopifyCart(
  cartId: string,
  lineId: string,
  countryCode?: string
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest<{
    data: {
      cartLinesRemove: {
        userErrors: Array<{ field: string[] | null; message: string }>;
      };
    };
  }>(
    CART_LINES_REMOVE_MUTATION,
    {
      cartId,
      lineIds: [lineId],
    },
    countryCode
  );

  const userErrors = data?.data?.cartLinesRemove?.userErrors ?? [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) {
    console.error("Remove line failed:", userErrors);
    return { success: false };
  }
  return { success: true };
}

const CART_QUERY = `
  query cart($id: ID!) {
    cart(id: $id) {
      id
      totalQuantity
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                price { amount currencyCode }
              }
            }
          }
        }
      }
    }
  }
`;

export interface ShopifyCartSnapshot {
  id: string;
  totalQuantity: number;
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        merchandise: { id: string; price: { amount: string; currencyCode: string } };
      };
    }>;
  };
}

export async function getShopifyCart(
  cartId: string,
  countryCode?: string
): Promise<{ data: { cart: ShopifyCartSnapshot | null } } | undefined> {
  return storefrontApiRequest<{ data: { cart: ShopifyCartSnapshot | null } }>(
    CART_QUERY,
    { id: cartId },
    countryCode
  );
}

