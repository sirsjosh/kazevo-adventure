import purple from "@/assets/purple.jpg.asset.json";
import orange from "@/assets/orange.jpg.asset.json";
import mint from "@/assets/mint.jpg.asset.json";
import lavender from "@/assets/lavender.jpg.asset.json";
import lime from "@/assets/lime.jpg.asset.json";
import black from "@/assets/black.jpg.asset.json";

export const variantImageMap: Record<string, string> = {
  "深紫色": purple.url,
  "深绿色": mint.url,
  "橘色": orange.url,
  "浅紫色": lavender.url,
  "浅绿色": lime.url,
  "黑色": black.url,
};

export const colorDotMap: Record<string, string> = {
  "深紫色": "oklch(0.62 0.19 300)",
  "橘色": "oklch(0.75 0.17 75)",
  "深绿色": "oklch(0.85 0.13 172)",
  "浅绿色": "oklch(0.87 0.2 122)",
  "浅紫色": "oklch(0.78 0.11 300)",
  "黑色": "oklch(0.25 0.02 285)",
};

export const colorNameMap: Record<string, string> = {
  "深紫色": "Deep Purple",
  "橘色": "Vibrant Orange",
  "深绿色": "Deep Green",
  "浅绿色": "Light Green",
  "浅紫色": "Lilac Bloom",
  "黑色": "Classic Black",
};

export const fallbackVariantImage = purple.url;

export function getVariantColorValue(
  selectedOptions: Array<{ name: string; value: string }>
): string | undefined {
  return selectedOptions.find((o) => /color|colour|颜色/i.test(o.name))?.value;
}

export function getVariantImage(
  selectedOptions: Array<{ name: string; value: string }>
): string {
  const colorValue = getVariantColorValue(selectedOptions);
  return (colorValue && variantImageMap[colorValue]) || fallbackVariantImage;
}
