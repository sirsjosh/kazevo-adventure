# Meta Dataset Quality API integration

## Before anything else: rotate the token

The token was pasted into chat in plaintext, so it must be considered exposed.
Revoke it in Meta Business Settings (System Users -> the issuing user ->
regenerate token) and issue a replacement. The replacement is entered through
the secure secret form, never typed into chat.

## Goal
Store the Meta Dataset Quality API token securely and use it to fetch event-quality diagnostics from Meta, then surface them in a simple internal dashboard so you can monitor the 4.4/10 score as it improves.

## Token capability check (first implementation step)

Meta tokens all share the `EAA...` shape; read-only quality access and
event-sending CAPI access are distinguished only by granted permissions. The
first build step calls the Graph API debug endpoint with the new token to list
its scopes and report back which of these are available:

- reading dataset quality diagnostics (this plan)
- sending server-side Conversions API events (the follow-up that actually
  raises the match-quality score)

If the token turns out to carry event-sending permission, the CAPI send path
becomes available without obtaining a second token.

## What will be built


### 1. Secure secret storage
- Add the token as a runtime secret named `META_DATASET_QUALITY_API_TOKEN` using Lovable's secret tooling.
- Read it only inside server-function handlers; it is never exposed to the browser.

### 2. Server function for Meta diagnostics
- Create `src/lib/meta-quality.functions.ts` with a TanStack `createServerFn`.
- The function calls the Meta Graph API endpoint for dataset event quality:
  ```text
  GET https://graph.facebook.com/v22.0/{pixel_id}/events_quality
  ```
  passing `access_token` and the dataset/pixel ID.
- Parse the response into a typed DTO with fields such as overall score, coverage, deduplication rate, and any issue flags Meta returns.
- Handle errors gracefully: if the token is invalid or the API returns an error, return a typed error message instead of crashing the page.

### 3. Internal dashboard route
- Create a lightweight route at `/admin/meta-quality` (or another path you prefer).
- The route calls the server function via TanStack Query and displays:
  - Overall dataset quality score
  - Event coverage / deduplication metrics
  - Last updated timestamp
  - Raw diagnostic flags (rendered read-only)
- Style it with the existing Tailwind v4 tokens and shadcn components.

### 4. Route protection
- Wrap the dashboard under the existing Supabase auth gate so only signed-in admins can view it.
- If no admin-role check exists yet, gate it behind a simple "signed in" check first and leave a commented hook for a future `user_roles` table.

### 5. Head metadata
- Add a unique `<title>` and `<meta name="description">` to the new route.

## What is NOT in this plan

- Sending server-side Conversions API events. That requires a **Conversions API access token** and a separate `/api/public/meta-capi` endpoint. If you later obtain that token, it can be added as `META_CAPI_ACCESS_TOKEN` and the send path can be built as a follow-up.
- Automated fixes based on the diagnostics. This plan only surfaces the data so you (and future code) can act on it.

## Files to create or edit

- `src/lib/meta-quality.functions.ts` — new server function
- `src/routes/admin/meta-quality.tsx` — new dashboard route
- `src/routes/__root.tsx` — add global `<Toaster />` if not already present (for error toasts)
- Secret: `META_DATASET_QUALITY_API_TOKEN`

## Acceptance criteria

- The token is stored as a runtime secret and never appears in the codebase.
- `/admin/meta-quality` loads Meta's diagnostics and displays the current dataset quality score.
- Errors from Meta are surfaced in the UI instead of failing silently.
- The route is accessible only to signed-in users.
