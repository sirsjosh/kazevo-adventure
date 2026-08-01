import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import { PolicyPage } from "@/components/PolicyPage";

const SITE_URL = "https://kazevo-adventure-launch.lovable.app";
const title = "Contact — kazevo by solarah";
const description =
  "Questions about your kazevo backpack, an order or a return? Email info@solarah.net or call +86 13917084308 — we reply within 48 hours.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/contact` },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/contact` }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <PolicyPage
      title="Contact Solarah"
      intro="We are here to help. Whether you have questions about our products, need assistance with an order, or just want to share feedback, please reach out."
    >
      <section>
        <h2>Get in touch</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <a
            href="mailto:info@solarah.net"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Mail size={18} />
            </span>
            <span className="font-medium text-foreground">info@solarah.net</span>
          </a>
          <a
            href="tel:+8613917084308"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Phone size={18} />
            </span>
            <span className="font-medium text-foreground">+86 13917084308</span>
          </a>
        </div>
        <p>We aim to respond to all email inquiries within 48 hours.</p>
      </section>

      <section>
        <h2>Our office</h2>
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <MapPin size={18} />
          </span>
          <address className="not-italic leading-relaxed">
            <strong>Solarah Limited</strong>
            <br />
            Unit 505, 5/F, King's Commercial Building
            <br />
            2-4 Chatham Court, Tsim Sha Tsui
            <br />
            Kowloon, Hong Kong
          </address>
        </div>
      </section>

      <section>
        <h2>Returns</h2>
        <p>
          For returns, please refer to our <a href="/refund-policy">Refund Policy</a> or
          email us to initiate the process.
        </p>
      </section>
    </PolicyPage>
  );
}
