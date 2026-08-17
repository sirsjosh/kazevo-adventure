const SHOPIFY_ADMIN_API_VERSION = "2025-07";

const CUSTOMER_CREATE = `
  mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer { id }
      userErrors { field message }
    }
  }
`;

const CUSTOMERS_SEARCH = `
  query findCustomer($query: String!) {
    customers(first: 1, query: $query) {
      edges { node { id } }
    }
  }
`;

const CONSENT_UPDATE = `
  mutation consent($input: CustomerEmailMarketingConsentUpdateInput!) {
    customerEmailMarketingConsentUpdate(input: $input) {
      customer { id }
      userErrors { field message }
    }
  }
`;

const TAGS_ADD = `
  mutation tagsAdd($id: ID!, $tags: [String!]!) {
    tagsAdd(id: $id, tags: $tags) {
      userErrors { field message }
    }
  }
`;

interface AdminResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

async function adminRequest<T>(
  shopDomain: string,
  token: string,
  query: string,
  variables: Record<string, unknown>
): Promise<AdminResponse<T>> {
  const response = await fetch(
    `https://${shopDomain}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  if (!response.ok) {
    throw new Error(`Shopify Admin API HTTP ${response.status}`);
  }

  return (await response.json()) as AdminResponse<T>;
}

export interface SyncResult {
  status: "created" | "updated" | "skipped" | "error";
  message?: string;
}

/**
 * Creates the subscriber as a Shopify customer with email marketing consent.
 * When the customer already exists, their consent is refreshed instead.
 */
export async function syncSubscriberToShopify(
  shopDomain: string,
  token: string,
  email: string,
  tags: string[]
): Promise<SyncResult> {
  const consentedAt = new Date().toISOString();

  const created = await adminRequest<{
    customerCreate: {
      customer: { id: string } | null;
      userErrors: Array<{ field: string[] | null; message: string }>;
    };
  }>(shopDomain, token, CUSTOMER_CREATE, {
    input: {
      email,
      tags,
      emailMarketingConsent: {
        marketingState: "SUBSCRIBED",
        marketingOptInLevel: "SINGLE_OPT_IN",
        consentUpdatedAt: consentedAt,
      },
    },
  });

  if (created.errors?.length) {
    return { status: "error", message: created.errors.map((e) => e.message).join(", ") };
  }

  if (created.data?.customerCreate?.customer?.id) {
    return { status: "created" };
  }

  const userErrors = created.data?.customerCreate?.userErrors ?? [];
  const alreadyExists = userErrors.some((e) =>
    /taken|already/i.test(e.message)
  );

  if (!alreadyExists) {
    return {
      status: "error",
      message: userErrors.map((e) => e.message).join(", ") || "Unknown Shopify error",
    };
  }

  // Existing customer — look them up and refresh marketing consent.
  const found = await adminRequest<{
    customers: { edges: Array<{ node: { id: string } }> };
  }>(shopDomain, token, CUSTOMERS_SEARCH, {
    query: `email:${JSON.stringify(email)}`,
  });

  const customerId = found.data?.customers?.edges?.[0]?.node?.id;
  if (!customerId) {
    return { status: "error", message: "Existing customer not found" };
  }

  const consent = await adminRequest<{
    customerEmailMarketingConsentUpdate: {
      userErrors: Array<{ field: string[] | null; message: string }>;
    };
  }>(shopDomain, token, CONSENT_UPDATE, {
    input: {
      customerId,
      emailMarketingConsent: {
        marketingState: "SUBSCRIBED",
        marketingOptInLevel: "SINGLE_OPT_IN",
        consentUpdatedAt: consentedAt,
      },
    },
  });

  const consentErrors =
    consent.data?.customerEmailMarketingConsentUpdate?.userErrors ?? [];
  if (consentErrors.length > 0) {
    return { status: "error", message: consentErrors.map((e) => e.message).join(", ") };
  }

  await adminRequest(shopDomain, token, TAGS_ADD, { id: customerId, tags });

  return { status: "updated" };
}
