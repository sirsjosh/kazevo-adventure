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
  "deep purple": purple.url,
  "deep green": mint.url,
  "vibrant orange": orange.url,
  "orange": orange.url,
  "lilac bloom": lavender.url,
  "light purple": lavender.url,
  "lilac": lavender.url,
  "light green": lime.url,
  "classic black": black.url,
  "black": black.url,
};

export const colorDotMap: Record<string, string> = {
  "深紫色": "oklch(0.62 0.19 300)",
  "橘色": "oklch(0.75 0.17 75)",
  "深绿色": "oklch(0.85 0.13 172)",
  "浅绿色": "oklch(0.87 0.2 122)",
  "浅紫色": "oklch(0.78 0.11 300)",
  "黑色": "oklch(0.25 0.02 285)",
  "deep purple": "oklch(0.62 0.19 300)",
  "vibrant orange": "oklch(0.75 0.17 75)",
  "orange": "oklch(0.75 0.17 75)",
  "deep green": "oklch(0.85 0.13 172)",
  "light green": "oklch(0.87 0.2 122)",
  "lilac bloom": "oklch(0.78 0.11 300)",
  "light purple": "oklch(0.78 0.11 300)",
  "lilac": "oklch(0.78 0.11 300)",
  "classic black": "oklch(0.25 0.02 285)",
  "black": "oklch(0.25 0.02 285)",
  "mixed": "oklch(0.8 0.13 200)",
  "light blue": "oklch(0.82 0.09 240)",
  "pink": "oklch(0.85 0.09 5)",
  "black – single sling": "oklch(0.25 0.02 285)",
  "black – double sling": "oklch(0.32 0.02 285)",
  "blue – single sling": "oklch(0.55 0.19 265)",
  "blue – double sling": "oklch(0.62 0.17 265)",
  "red – single sling": "oklch(0.55 0.21 25)",
  "red – double sling": "oklch(0.62 0.19 25)",
  // Football hand bag / retro leather / kids + crossbody colourways
  "white": "oklch(0.97 0.005 285)",
  "cream": "oklch(0.93 0.04 95)",
  "brown": "oklch(0.45 0.08 55)",
  "light brown": "oklch(0.62 0.09 70)",
  "dark brown": "oklch(0.33 0.05 50)",
  "khaki": "oklch(0.72 0.06 95)",
  "denim blue": "oklch(0.55 0.11 250)",
  "blue": "oklch(0.58 0.17 255)",
  "purple": "oklch(0.62 0.19 300)",
  "green": "oklch(0.72 0.15 155)",
  "lime green": "oklch(0.87 0.2 122)",
  "yellow": "oklch(0.88 0.16 95)",
  "dark pink": "oklch(0.65 0.19 5)",
  "pink + green": "oklch(0.78 0.13 60)",
  // Football fan leather crossbody / hiking pack / mini crossbody colourways
  "elephant grain (textured leather)": "oklch(0.55 0.02 90)",
  "vintage brown": "oklch(0.42 0.07 55)",
  "vintage brown – light": "oklch(0.58 0.08 60)",
  "light gray": "oklch(0.78 0.01 285)",
  "light grey": "oklch(0.78 0.01 285)",
  "gray": "oklch(0.65 0.01 285)",
  "grey": "oklch(0.65 0.01 285)",
  "grain brown": "oklch(0.5 0.07 55)",
  "horse brown": "oklch(0.4 0.09 45)",
  "mocha brown": "oklch(0.46 0.05 60)",
  "amber grain": "oklch(0.62 0.12 70)",
  "purple with pink": "oklch(0.65 0.16 320)",
  "pink with green": "oklch(0.78 0.13 60)",
  "coffee khaki": "oklch(0.55 0.05 70)",
  "khaki + blue": "oklch(0.66 0.09 190)",
  "blue + green": "oklch(0.68 0.14 200)",
  "purple + blue": "oklch(0.6 0.17 285)",
  "purple + green": "oklch(0.68 0.15 230)",
  // Boge Wade / denim bottle bag / dopamine chest bag / large-capacity pack
  "wisteria purple (attached pouch color will be sent randomly)": "oklch(0.68 0.12 300)",
  "beeswax yellow (attached pouch color will be sent randomly)": "oklch(0.85 0.15 90)",
  "wisteria purple": "oklch(0.68 0.12 300)",
  "beeswax yellow": "oklch(0.85 0.15 90)",
  "denim bichon": "oklch(0.62 0.09 250)",
  "denim kitten": "oklch(0.55 0.1 255)",
  "green / blue": "oklch(0.68 0.14 200)",
  "green+blue": "oklch(0.68 0.14 200)",
  "black gradient": "oklch(0.35 0.03 285)",
  "pink gradient": "oklch(0.8 0.12 5)",
  "purple gradient": "oklch(0.68 0.15 300)",
  "blue gradient": "oklch(0.7 0.13 245)",
  // Insulated drinks tote stripes
  "black and white": "oklch(0.35 0.01 285)",
  "rend and white": "oklch(0.58 0.2 25)",
  "red and white": "oklch(0.58 0.2 25)",
  "blue and white": "oklch(0.6 0.15 250)",
  // Transparent PVC backpack
  "purple transparent": "oklch(0.78 0.1 300)",
  "pink transparent": "oklch(0.86 0.07 5)",
  "gray transparent": "oklch(0.82 0.01 285)",
  "black transparent": "oklch(0.45 0.02 285)",
  // Corduroy + canvas totes
  "baige": "oklch(0.9 0.04 85)",
  "beige": "oklch(0.9 0.04 85)",
  "green and white": "oklch(0.72 0.1 155)",
  "khaki plaid": "oklch(0.74 0.07 90)",
  "strawberry": "oklch(0.68 0.19 15)",
  "blue floral": "oklch(0.66 0.12 250)",
  // 40oz insulated tumbler
  "coffee": "oklch(0.42 0.06 55)",
  "off-white": "oklch(0.95 0.015 90)",
  "apricot": "oklch(0.85 0.08 65)",
  "mint green": "oklch(0.85 0.09 165)",
};



export const colorNameMap: Record<string, string> = {
  "baige": "Beige",
  "khaki plaid": "Khaki Plaid",
  "green and white": "Green / White",
  "深紫色": "Deep Purple",
  "橘色": "Vibrant Orange",
  "深绿色": "Deep Green",
  "浅绿色": "Light Green",
  "浅紫色": "Lilac Bloom",
  "黑色": "Classic Black",
  "rend and white": "Red / White Stripe",
  "black and white": "Black / White Stripe",
  "blue and white": "Blue / White Stripe",
};


export const fallbackVariantImage = purple.url;

function lookup(map: Record<string, string>, value?: string): string | undefined {
  if (!value) return undefined;
  const raw = value.trim();
  const direct = map[raw] ?? map[raw.toLowerCase()];
  if (direct) return direct;
  // Some variants append a size, e.g. "Yellow - small" or "Cream – big".
  const base = raw.toLowerCase().split(/\s+[-–—]\s+/)[0]?.trim();
  return base ? map[base] : undefined;
}


export function getVariantColorValue(
  selectedOptions: Array<{ name: string; value: string }>
): string | undefined {
  return selectedOptions.find((o) => /color|colour|颜色/i.test(o.name))?.value;
}

export function getVariantImage(
  selectedOptions: Array<{ name: string; value: string }>
): string {
  return lookup(variantImageMap, getVariantColorValue(selectedOptions)) ?? fallbackVariantImage;
}

export function getVariantColorName(
  selectedOptions: Array<{ name: string; value: string }>
): string {
  const colorValue = getVariantColorValue(selectedOptions);
  if (!colorValue) return "";
  return lookup(colorNameMap, colorValue) ?? colorValue;
}

export function getVariantDotColor(colorValue?: string): string {
  return lookup(colorDotMap, colorValue) ?? "oklch(0.7 0.05 300)";
}

export function getColorLabel(colorValue?: string): string {
  return lookup(colorNameMap, colorValue) ?? colorValue ?? "";
}


export function formatMoney(
  amount: number,
  currencyCode: string = "USD",
  locale: string = "en-US"
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}

export function formatUsd(amount: number): string {
  return formatMoney(amount, "USD", "en-US");
}
