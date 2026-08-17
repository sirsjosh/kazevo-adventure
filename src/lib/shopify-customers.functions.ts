import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  email: z.string().trim().email().max(254),
  source: z.string().max(60).optional(),
});

/**
 * Syncs an email subscriber into Shopify.
 *
 * Security: this endpoint is callable by anyone, so it never trusts the caller.
 * It only acts on emails that already exist as an unsynced row in
 * `email_subscribers`, marks the row as synced first (so repeat calls become
 * no-ops), and always returns an opaque `{ status: "ok" }` so callers cannot
 * enumerate whether an email is an existing Shopify customer.
 */
export const syncEmailSubscriberToShopify = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<{ status: "ok" }> => {
    const shopDomain = process.env["SHOPIFY_STORE_PERMANENT_DOMAIN"];
    const token =
      process.env["SHOPIFY_ADMIN_API_TOKEN"] ?? process.env["SHOPIFY_ACCESS_TOKEN"];

    const email = data.email.toLowerCase();
    const tags = ["kazevo-popup", data.source ?? "discount_popup"];

    try {
      if (!shopDomain || !token) {
        console.error("Shopify customer sync skipped: missing store domain or admin token");
        return { status: "ok" };
      }

      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

      // Claim the subscriber row: only rows captured through our own flows and
      // not yet synced are eligible. This makes the endpoint non-forgeable for
      // arbitrary third-party emails and idempotent under repeat calls.
      const { data: claimed, error: claimError } = await supabaseAdmin
        .from("email_subscribers")
        .update({ shopify_synced_at: new Date().toISOString() })
        .eq("email", email)
        .is("shopify_synced_at", null)
        .select("id");

      if (claimError) {
        console.error("Shopify customer sync claim failed:", claimError.message);
        return { status: "ok" };
      }

      if (!claimed || claimed.length === 0) {
        // Unknown or already-synced email: do nothing, reveal nothing.
        return { status: "ok" };
      }

      const { syncSubscriberToShopify } = await import("./shopify-customers.server");
      const result = await syncSubscriberToShopify(shopDomain, token, email, tags);

      if (result.status === "error") {
        console.error("Shopify customer sync failed:", result.message);
        // Allow a later retry for this subscriber.
        await supabaseAdmin
          .from("email_subscribers")
          .update({ shopify_synced_at: null })
          .eq("email", email);
      }
    } catch (error) {
      console.error("Shopify customer sync threw:", error);
    }

    return { status: "ok" };
  });

