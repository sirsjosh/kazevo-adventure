import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { isSoldOut, isPreorderClosed } from "@/lib/stock";

interface ProductCardProps {
  product: ShopifyProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);
  const [selectedVariant] = useState(product.node.variants.edges[0]?.node);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedVariant || soldOut) return;

    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
    });
  };

  const soldOut = isSoldOut(product.node.handle);
  const image = product.node.images.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;

  return (
    <article className="group flex flex-col rounded-3xl border border-border bg-card overflow-hidden transition-transform duration-300 hover:-translate-y-1">
      <Link
        to="/product/$handle"
        params={{ handle: product.node.handle }}
        className="relative aspect-square overflow-hidden bg-muted"
      >
        {image ? (
          <img
            src={image.url}
            alt={image.altText ?? product.node.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </Link>
      <div className="flex flex-col flex-1 p-5">
        <Link
          to="/product/$handle"
          params={{ handle: product.node.handle }}
          className="group/link"
        >
          <h3 className="font-display text-lg font-bold leading-tight group-hover/link:text-primary transition-colors">
            {product.node.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground flex-1">
          {product.node.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="font-display text-xl font-black">
            {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
          </span>
          <Button
            onClick={handleAddToCart}
            disabled={isLoading || soldOut || !selectedVariant?.availableForSale}
            size="sm"
            className="rounded-full"
          >
            {soldOut ? (
              "Sold out"
            ) : isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ShoppingBag className="h-4 w-4 mr-1.5" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
