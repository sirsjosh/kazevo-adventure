import { createFileRoute } from "@tanstack/react-router";

import { PolicyPage } from "@/components/PolicyPage";

const SITE_URL = "https://kazevo-adventure-launch.lovable.app";
const title = "Legal Notice — kazevo by solarah";
const description =
  "Company information, registered office, content responsibility, copyright and governing law for Solarah Limited, operator of the kazevo store.";

export const Route = createFileRoute("/legal")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/legal` },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/legal` }],
  }),
  component: Legal,
});

function Legal() {
  return (
    <PolicyPage title="Legal Notice">
      <section>
        <h2>1. Company information</h2>
        <p>
          This website is operated by <strong>Solarah Limited</strong>, registered in Hong
          Kong. Registration number: pending — to be added upon receipt of the Certificate
          of Incorporation.
        </p>
      </section>

      <section>
        <h2>2. Registered office</h2>
        <p>
          Unit 505, 5/F, King's Commercial Building, 2-4 Chatham Court, Tsim Sha Tsui,
          Kowloon, Hong Kong.
        </p>
      </section>

      <section>
        <h2>3. Contact information</h2>
        <p>
          Email <a href="mailto:info@solarah.net">info@solarah.net</a>.
        </p>
      </section>

      <section>
        <h2>4. Responsible for content</h2>
        <p>Solarah Limited.</p>
      </section>

      <section>
        <h2>5. Disclaimer</h2>
        <p>
          The information on this website is for general informational purposes only. While
          we strive to keep content accurate and up to date, we make no warranties about its
          completeness, accuracy or suitability. Any reliance you place on such information
          is strictly at your own risk.
        </p>
      </section>

      <section>
        <h2>6. External links</h2>
        <p>
          Our site may contain links to external websites. We have no control over their
          nature, content and availability and accept no responsibility for them.
        </p>
      </section>

      <section>
        <h2>7. Copyright</h2>
        <p>
          All content on this website — including text, images, logos and product designs —
          is the property of Solarah Limited unless otherwise stated. Unauthorized use,
          reproduction or distribution is strictly prohibited.
        </p>
      </section>

      <section>
        <h2>8. Governing law</h2>
        <p>
          This legal notice and all matters relating to your use of this website are
          governed by the laws of Hong Kong.
        </p>
      </section>
    </PolicyPage>
  );
}
