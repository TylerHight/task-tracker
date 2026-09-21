# HTTP Interface Contract

All routes require the signed-in user unless stated otherwise. Route handlers validate input,
return JSON errors with stable machine-readable codes, and never expose Google refresh tokens.

| Area | Route and method | Request / response contract |
| --- | --- | --- |
| Activities | `POST /api/activities/start` | `{ name, presetMinutes? }` creates/runs a timer; name is the only required user field. Returns timer state. |
| Timer | `POST /api/timers/{id}/pause`, `/resume`, `/complete`, `/cancel` | Complete optionally accepts notes/custom fields and returns persisted record plus Calendar publication state. |
| History | `GET /api/records?filters` and `PATCH /api/records/{id}` | Lists filterable records or applies validated local edits, incrementing version. |
| CSV | `GET /api/records/export.csv` | Returns documented headers and every available record field. |
| Google connect | `POST /api/google/{calendar|sheets}/connect` | Begins incremental consent for that feature; callback stores encrypted server credentials. |
| Calendar | `GET /api/calendars`; `POST /api/calendar-publications/{recordId}/retry` | Lists selectable calendars or requeues one eligible publication. |
| Sheets | `POST /api/sheets/link`; `POST /api/sheets/import`; `POST /api/sheets/sync` | Links selected file, imports normalized rows, or starts a serialized manual sync. Returns job/result/conflicts. |
| Conflicts | `GET /api/sheets/conflicts`; `POST /api/sheets/conflicts/{id}/resolve` | Returns both versions; resolution explicitly chooses local, Sheet, or validated merged payload. |
| Offline capture | `POST /api/offline-capture` | Requires idempotency key and record/timer payload. Same key returns the original accepted result without duplicate record creation. |

Calendar create/update always uses server-owned deterministic event IDs and does not expose a pull
endpoint. A Sheet manual-sync response reports inserted, updated, pulled, unchanged, invalid, and
conflict counts. All retryable failures include a retry state, not data loss.
