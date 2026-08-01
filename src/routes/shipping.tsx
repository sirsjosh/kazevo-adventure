import { createFileRoute } from "@tanstack/react-router";

import { PolicyPage } from "@/components/PolicyPage";

const SITE_URL = "https://kazevo-adventure-launch.lovable.app";
const title = "Shipping Policy — kazevo by solarah";
const description =
  "Free worldwide shipping on every kazevo order. Processing in 1–3 business days, tracked YunExpress delivery, and clear customs guidance.";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/shipping` },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/shipping` }],
  }),
  component: Shipping,
});

function Shipping() {
  return (
    <PolicyPage
      title="Shipping Policy"
      intro="Thank you for choosing Solarah. We are committed to delivering radiant comfort to your doorstep with a seamless, worry-free experience."
    >
      <section>
        <h2>1. Shipping methods and timelines</h2>
        <p>
          We ship all orders via <strong>YunExpress Standard</strong> from our logistics
          center in mainland China.
        </p>
        <ul>
          <li>
            <strong>Processing time:</strong> orders are processed within 1–3 business days
            (excluding weekends and Chinese public holidays).
          </li>
          <li>
            <strong>Tracking:</strong> once your order is dispatched, you receive a
            confirmation email with a tracking number.
          </li>
          <li>
            <strong>Delivery estimates:</strong> United States 7–12 business days, Canada
            8–15 business days, other international destinations 10–20 business days.
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Shipping costs</h2>
        <p>
          <strong>Shipping is free on every order, worldwide.</strong> The shipping cost is
          already included in the product price you see — no surprises at checkout.
        </p>
      </section>

      <section>
        <h2>3. International shipping</h2>
        <p>
          We ship worldwide, including the United States, Canada, and most countries.
          International orders may be subject to customs duties, taxes, or import fees
          levied by your local customs authority. These charges are the responsibility of
          the customer.
        </p>
      </section>

      <section>
        <h2>4. Delivery delays</h2>
        <p>Occasionally, delays may occur due to:</p>
        <ul>
          <li>Inclement weather</li>
          <li>Carrier issues</li>
          <li>Customs inspections</li>
          <li>Peak holiday seasons</li>
        </ul>
        <p>
          If your order is taking longer than expected, reach out to{" "}
          <a href="mailto:info@solarah.net">info@solarah.net</a> and we will investigate.
        </p>
      </section>

      <section>
        <h2>5. Order tracking</h2>
        <p>
          Once your order is processed you receive a tracking number in your shipping
          confirmation email, which you can use to follow your parcel's journey.
        </p>
      </section>

      <section>
        <h2>6. Shipping restrictions</h2>
        <ul>
          <li>
            We are unable to ship to P.O. boxes, APO/FPO addresses, or certain remote areas
            where carrier service is unavailable.
          </li>
          <li>
            Some products may have size or weight restrictions that prevent shipping to
            specific destinations. Any such restrictions are noted on the product page.
          </li>
        </ul>
      </section>

      <section>
        <h2>7. Returns</h2>
        <p>
          We offer a 30-day return window from the date you receive your item. Once your
          return is accepted we provide a prepaid return shipping label — you won't have to
          cover return postage. See our <a href="/refund-policy">Refund Policy</a> for full
          details.
        </p>
      </section>

      <section>
        <h2>8. Contact us</h2>
        <p>
          Email <a href="mailto:info@solarah.net">info@solarah.net</a>. We respond to all
          messages within 48 hours.
        </p>
      </section>
    </PolicyPage>
  );
}
