import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  email: z.string().trim().email().max(254),
  source: z.string().max(60).optional(),
});

export const syncEmailSubscriberToShopify = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<{ status: string }> => {
    const shopDomain = process.env["SHOPIFY_STORE_PERMANENT_DOMAIN"];
    const token =
      process.env["SHOPIFY_ADMIN_API_TOKEN"] ?? process.env["SHOPIFY_ACCESS_TOKEN"];

    if (!shopDomain || !token) {
      console.error("Shopify customer sync skipped: missing store domain or admin token");
      return { status: "skipped" };
    }

    const email = data.email.toLowerCase();
    const tags = ["kazevo-popup", data.source ?? "discount_popup"];

    try {
      const { syncSubscriberToShopify } = await import("./shopify-customers.server");
      const result = await syncSubscriberToShopify(shopDomain, token, email, tags);

      if (result.status === "error") {
        console.error("Shopify customer sync failed:", result.message);
        return { status: "error" };
      }

      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin
        .from("email_subscribers")
        .update({ shopify_synced_at: new Date().toISOString() })
        .eq("email", email);

      return { status: result.status };
    } catch (error) {
      console.error("Shopify customer sync threw:", error);
      return { status: "error" };
    }
  });
