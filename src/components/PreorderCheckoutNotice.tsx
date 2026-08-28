import { Package } from "lucide-react";

import { PREORDER_CONFIGS, isPreorderClosed } from "@/lib/stock";

interface PreorderCheckoutNoticeProps {
  handles: string[];
}

export function PreorderCheckoutNotice({ handles }: PreorderCheckoutNoticeProps) {
  const activeHandle = handles.find((handle) => {
    const config = PREORDER_CONFIGS[handle];
    return config && !isPreorderClosed(handle);
  });

  const config = activeHandle ? PREORDER_CONFIGS[activeHandle] : null;
  if (!config) return null;

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/10 p-3 text-sm text-foreground">
      <Package className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <p>
        <span className="font-semibold text-primary">Pre-order:</span> this item ships before{" "}
        <span className="font-semibold">{config.shipsBy}</span>.
      </p>
    </div>
  );
}
