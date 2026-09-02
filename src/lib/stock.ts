// Manual sold-out overrides.
// Some products stay visible in the catalog for discovery but must not be
// purchasable, regardless of what Shopify reports for inventory.
export const SOLD_OUT_HANDLES = new Set<string>([
  // none currently — Plaid Corduroy Tote Bag is now a pre-order campaign
]);

interface PreorderConfig {
  deadline: string;
  shipsBy: string;
}

export const PREORDER_CONFIGS: Record<string, PreorderConfig> = {
  // Plaid Corduroy Tote Bag pre-order campaign
  "飞泓跨境格子托特包高颜值大容量灯芯绒单肩包休闲旅行便携手提包": {
    deadline: "2026-09-30T23:59:59+07:00",
    shipsBy: "3 October 2026",
  },
};

export function isSoldOut(handle?: string | null): boolean {
  return !!handle && SOLD_OUT_HANDLES.has(handle);
}

export function isPreorderClosed(handle?: string | null): boolean {
  if (!handle) return false;
  const config = PREORDER_CONFIGS[handle];
  if (!config) return false;
  return Date.parse(config.deadline) <= Date.now();
}

// True while a product has an active pre-order campaign (before its deadline).
// During the campaign the purchase button ignores Shopify availability so
// pre-orders can be taken regardless of reported inventory.
export function isPreorderActive(handle?: string | null): boolean {
  if (!handle) return false;
  return !!PREORDER_CONFIGS[handle] && !isPreorderClosed(handle);
}
