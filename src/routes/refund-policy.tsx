import { createFileRoute } from "@tanstack/react-router";

import { PolicyPage } from "@/components/PolicyPage";

const SITE_URL = "https://kazevo-adventure-launch.lovable.app";
const title = "Refund Policy — kazevo by solarah";
const description =
  "30-day returns on kazevo backpacks: eligibility, how to start a return, damages, exchanges, EU cooling-off period and refund timelines.";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/refund-policy` },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/refund-policy` }],
  }),
  component: Refunds,
});

function Refunds() {
  return (
    <PolicyPage
      title="Refund Policy"
      intro="Thank you for shopping with Solarah. If you are not entirely satisfied with your purchase, we are here to help."
    >
      <section>
        <h2>1. Return policy overview</h2>
        <p>
          We have a <strong>30-day return policy</strong> — you have 30 days after receiving
          your item to request a return. To be eligible, your item must be:
        </p>
        <ul>
          <li>In the same condition that you received it</li>
          <li>Unworn or unused</li>
          <li>With all original tags attached</li>
          <li>In its original packaging</li>
          <li>Accompanied by the receipt or proof of purchase</li>
        </ul>
      </section>

      <section>
        <h2>2. How to start a return</h2>
        <p>
          Contact our support team at{" "}
          <a href="mailto:info@solarah.net">info@solarah.net</a>. If your return is
          accepted, we send you a return shipping label along with instructions on how and
          where to send your package. Items sent back without first requesting a return
          will not be accepted.
        </p>
      </section>

      <section>
        <h2>3. Damages and issues</h2>
        <p>
          Please inspect your order upon reception. Contact us immediately if the item is
          defective, damaged, or if you receive the wrong item.
        </p>
      </section>

      <section>
        <h2>4. Exceptions and non-returnable items</h2>
        <ul>
          <li>Perishable goods (such as food, flowers, or plants)</li>
          <li>Custom products (such as special orders or personalized items)</li>
          <li>Personal care goods (such as beauty products)</li>
          <li>Hazardous materials, flammable liquids, or gases</li>
        </ul>
        <p>We also cannot accept returns on sale items or gift cards.</p>
      </section>

      <section>
        <h2>5. Exchanges</h2>
        <p>
          The fastest way to get what you want is to return the item you have. Once the
          return is accepted, you may make a separate purchase for the new item.
        </p>
      </section>

      <section>
        <h2>6. European Union 14-day cooling off period</h2>
        <p>
          If the merchandise is being shipped into the European Union, you have the right to
          cancel or return your order within 14 days, for any reason and without
          justification. The item must still meet the eligibility criteria in section 1.
        </p>
      </section>

      <section>
        <h2>7. Refunds</h2>
        <p>
          We notify you once we've received and inspected your return to let you know if the
          refund was approved.
        </p>
        <ul>
          <li>
            <strong>Approval:</strong> you'll be automatically refunded on your original
            payment method within 10 business days.
          </li>
          <li>
            <strong>Processing time:</strong> it can take some time for your bank or credit
            card company to process and post the refund.
          </li>
          <li>
            <strong>Delays:</strong> if more than 15 business days have passed since we
            approved your return and you have not received your refund, contact{" "}
            <a href="mailto:info@solarah.net">info@solarah.net</a>.
          </li>
        </ul>
      </section>
    </PolicyPage>
  );
}
