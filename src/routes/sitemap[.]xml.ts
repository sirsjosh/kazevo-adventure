import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { fetchShopifyProducts } from "@/lib/shopify";

const BASE_URL = "https://kazevo-adventure-launch.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/kazevo-mini", changefreq: "weekly", priority: "0.9" },
          { path: "/kazevo-outdoor", changefreq: "weekly", priority: "0.9" },
          {
            path: "/blog/choosing-an-ultralight-backpack",
            changefreq: "monthly",
            priority: "0.7",
          },
          { path: "/contact", changefreq: "yearly", priority: "0.5" },
          { path: "/shipping", changefreq: "yearly", priority: "0.4" },
          { path: "/refund-policy", changefreq: "yearly", priority: "0.4" },
          { path: "/terms", changefreq: "yearly", priority: "0.3" },
          { path: "/legal", changefreq: "yearly", priority: "0.3" },
        ];


        try {
          const products = await fetchShopifyProducts("*", 50);
          for (const product of products) {
            entries.push({
              path: `/product/${encodeURIComponent(product.node.handle)}`,
              changefreq: "weekly",
              priority: "0.8",
            });
          }
        } catch {
          // If Shopify is unreachable, still serve the static routes.
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
