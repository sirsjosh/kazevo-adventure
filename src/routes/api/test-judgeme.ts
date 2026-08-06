import { createFileRoute } from "@tanstack/react-router";
import { fetchJudgeMeReviewsByHandle } from "@/lib/judgeme.server";

export const Route = createFileRoute("/api/test-judgeme")({
  server: {
    handlers: {
      GET: async () => {
        const shopDomain = process.env["SHOPIFY_STORE_PERMANENT_DOMAIN"];
        const apiToken = process.env["JUDGE_ME_API_TOKEN"];
        const handle = "kazevo-mini";

        if (!shopDomain || !apiToken) {
          return Response.json({ error: "Missing env", shopDomain: !!shopDomain, apiToken: !!apiToken });
        }

        const result = await fetchJudgeMeReviewsByHandle(shopDomain, apiToken, handle);
        return Response.json({ handle, ...result });
      },
    },
  },
});
