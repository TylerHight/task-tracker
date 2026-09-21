# Research: Personal Focus and Habit Tracker MVP

## PWA installation, offline capture, and retry

**Decision**: Ship a manifest and root-scoped service worker over HTTPS; cache app shell/assets
only. On completion, atomically persist an idempotent outbox operation in IndexedDB, then send it
when online. Retry at startup, on `online`, and by an explicit Retry action. Use Background Sync
only as an optional accelerator.

**Rationale**: Background Sync lacks universal, guaranteed execution. A durable foreground
fallback preserves work; cached assets are not a data store. Records are visibly pending until the
server accepts them, where PostgreSQL becomes canonical.

**Alternatives considered**: service-worker-only retry, periodic sync, and Cache Storage records
were rejected for reliability or scope.

Sources: [manifest](https://web.dev/learn/pwa/web-app-manifest),
[offline data](https://web.dev/learn/pwa/offline-data),
[Background Sync](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API).

## Google OAuth and tokens

**Decision**: OIDC sign-in plus authorization-code OAuth with PKCE, state, HTTPS redirects, and
incremental consent. Encrypt refresh tokens server-side; store scopes, expiry, and revocation;
never place them in browser storage. Request Calendar access only on Calendar enablement and use
`drive.file` plus Google Picker for the chosen Sheet.

**Rationale**: This minimizes access and supports server-side retries without exposing durable
credentials to the browser.

**Alternatives considered**: broad Drive/Sheets scopes and browser-held refresh tokens were
rejected for least privilege and security.

Sources: [web-server OAuth](https://developers.google.com/identity/protocols/oauth2/web-server),
[authorization](https://developers.google.com/identity/oauth2/web/guides/how-user-authz-works),
[Sheets scopes](https://developers.google.com/workspace/sheets/api/scopes),
[Calendar auth](https://developers.google.com/workspace/calendar/api/auth).

## Duplicate-safe Calendar publishing

**Decision**: After local persistence, enqueue a Calendar job with selected calendar ID and a
deterministic valid event ID derived from the immutable session ID. Insert with that ID; on a retry
409, fetch/update it rather than insert. Persist remote ID and an `appRecordId` private extended
property. Retry transient failures with bounded backoff and visible retry; never import Calendar
edits.

**Rationale**: Client-supplied IDs unique per Calendar make uncertain writes safely recoverable.

**Alternatives considered**: title search and two-way Calendar sync were rejected as ambiguous and
out of scope.

Sources: [event insert](https://developers.google.com/workspace/calendar/api/v3/reference/events/insert),
[errors](https://developers.google.com/workspace/calendar/api/guides/errors),
[extended properties](https://developers.google.com/workspace/calendar/api/guides/extended-properties).

## Manual Sheet sync and flexible data

**Decision**: Use a managed tab with visible immutable `record_id`, `record_version`, `updated_at`,
and `custom_fields_json`. Manual sync reads and normalizes all managed rows, indexes by ID, and
compares both sides with a persisted last-synced hash. Local-only pushes, Sheet-only pulls, neither
does nothing, and divergent values create a pending conflict with no overwrite. Serialize jobs;
batch reads/writes; reread writes before saving a new snapshot. Date+duration rows without times
become `DATE_ONLY`, preserve start/end null, and are Calendar-ineligible. Custom fields are a
validated JSON object displayed as optional key-value rows.

**Rationale**: IDs survive sorting/insertion; snapshots distinguish concurrent edits; JSON avoids
categories and supports varied activities without data loss.

**Alternatives considered**: row numbers, last-write-wins, categories, and inferred timestamps
were rejected for fragility, integrity, friction, and false Calendar data.

Sources: [Sheets values](https://developers.google.com/workspace/sheets/api/guides/values),
[batch updates](https://developers.google.com/workspace/sheets/api/guides/batchupdate),
[metadata](https://developers.google.com/workspace/sheets/api/guides/metadata),
[date/time rendering](https://developers.google.com/workspace/sheets/api/reference/rest/v4/DateTimeRenderOption).
