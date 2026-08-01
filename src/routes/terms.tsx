import { createFileRoute } from "@tanstack/react-router";

import { PolicyPage } from "@/components/PolicyPage";

const SITE_URL = "https://kazevo-adventure-launch.lovable.app";
const title = "Terms of Service — kazevo by solarah";
const description =
  "The terms and conditions governing purchases and use of the kazevo by solarah store, operated by Solarah Limited, Hong Kong.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/terms` },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/terms` }],
  }),
  component: Terms,
});

function Terms() {
  return (
    <PolicyPage
      title="Terms of Service"
      intro="Last updated: August 01, 2026. These terms describe your rights and responsibilities when you use our services. Solarah is powered by Shopify."
    >
      <section>
        <h2>1. Access and account</h2>
        <p>
          By agreeing to these Terms of Service you represent that you are at least the age
          of majority in your state or province of residence. You may be asked to provide
          information such as your email address, billing, payment and shipping details, and
          you warrant that all information you provide is correct, current and complete. You
          are solely responsible for maintaining the security of your account credentials.
        </p>
      </section>

      <section>
        <h2>2. Our products</h2>
        <p>
          We make every effort to represent our products accurately. Colors or product
          appearance may differ based on your device settings. All product descriptions are
          subject to change at any time without notice.
        </p>
      </section>

      <section>
        <h2>3. Orders</h2>
        <p>
          When you place an order you are making an offer to purchase. We reserve the right
          to accept or decline your order for any reason. Purchases are subject to return or
          exchange solely in accordance with our{" "}
          <a href="/refund-policy">Refund Policy</a>.
        </p>
      </section>

      <section>
        <h2>4. Prices and billing</h2>
        <p>
          Prices, discounts and promotions are subject to change without notice. Unless
          otherwise stated, posted prices do not include taxes, handling or customs charges.
        </p>
      </section>

      <section>
        <h2>5. Shipping and delivery</h2>
        <p>
          We are not liable for shipping and delivery delays. All delivery times are
          estimates only. Once we transfer products to the carrier, title and risk of loss
          passes to you. See our <a href="/shipping">Shipping Policy</a>.
        </p>
      </section>

      <section>
        <h2>6. Intellectual property</h2>
        <p>
          All trademarks, text, images and designs on our services are owned by Solarah, its
          affiliates or licensors. You may use the services for personal, non-commercial use
          only.
        </p>
      </section>

      <section>
        <h2>7. Optional tools and third-party links</h2>
        <p>
          We may provide access to third-party tools or links to third-party websites. We
          have no control over these and provide them "as is" without warranties. Use is
          entirely at your own risk.
        </p>
      </section>

      <section>
        <h2>8. Relationship with Shopify</h2>
        <p>
          Solarah is powered by Shopify. Shopify is not responsible for any aspect of sales
          between you and Solarah, and you release Shopify from all claims arising from your
          transactions with us.
        </p>
      </section>

      <section>
        <h2>9. Privacy</h2>
        <p>
          All personal information collected is subject to our privacy practices and
          Shopify's Privacy Policy.
        </p>
      </section>

      <section>
        <h2>10. Feedback</h2>
        <p>
          If you submit feedback or reviews, you grant us a perpetual, worldwide,
          royalty-free license to use and distribute such content for any purpose.
        </p>
      </section>

      <section>
        <h2>11. Prohibited uses</h2>
        <p>
          You may not use the services for any unlawful purpose, to infringe intellectual
          property, or to harass others. Automated access such as scraping is prohibited
          without authorization.
        </p>
      </section>

      <section>
        <h2>12. Disclaimer of warranties and limitation of liability</h2>
        <p>
          The services and all products are provided "as is" without any warranties. In no
          case shall Solarah, its directors or employees be liable for any indirect,
          incidental or consequential damages arising from your use of the services.
        </p>
      </section>

      <section>
        <h2>13. Governing law</h2>
        <p>
          These Terms of Service shall be governed by and construed in accordance with the
          laws of Hong Kong.
        </p>
      </section>

      <section>
        <h2>14. Contact information</h2>
        <p>
          Solarah Limited, Unit 505, 5/F, King's Commercial Building, 2-4 Chatham Court,
          Tsim Sha Tsui, Kowloon, Hong Kong. Phone{" "}
          <a href="tel:+8613917084308">+86 13917084308</a>, email{" "}
          <a href="mailto:info@solarah.net">info@solarah.net</a>.
        </p>
      </section>
    </PolicyPage>
  );
}
