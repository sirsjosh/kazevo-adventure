// Manual sold-out overrides.
// Some products stay visible in the catalog for discovery but must not be
// purchasable, regardless of what Shopify reports for inventory.
export const SOLD_OUT_HANDLES = new Set<string>([
  // Plaid Corduroy Tote Bag
  "飞泓跨境格子托特包高颜值大容量灯芯绒单肩包休闲旅行便携手提包",
]);

export function isSoldOut(handle?: string | null): boolean {
  return !!handle && SOLD_OUT_HANDLES.has(handle);
}
