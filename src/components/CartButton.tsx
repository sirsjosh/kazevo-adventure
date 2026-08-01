import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cartStore";

export function CartButton() {
  const { setDrawerOpen, items } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative shrink-0"
      onClick={() => setDrawerOpen(true)}
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
          {totalItems}
        </Badge>
      )}
    </Button>
  );
}
