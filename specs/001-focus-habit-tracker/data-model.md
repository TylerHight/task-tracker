# Data Model: Personal Focus and Habit Tracker MVP

## Authoritative records

### User

Application account. Owns all records and at most one active Sheet link and Calendar link.

### Activity

Reusable, user-owned name used for fast starts. Fields: `id`, `user_id`, normalized `name`,
`last_used_at`, `use_count`, timestamps. The normalized name is unique per user; activity name is
the only required start field.

### SessionRecord

Authoritative activity history row. Fields: UUID `id`, `user_id`, `activity_id`, display
`activity_name`, `status` (`COMPLETED`, `CANCELLED`, `HISTORICAL`), `started_at` nullable,
`ended_at` nullable, `activity_date`, `duration_seconds`, `time_precision` (`EXACT`, `DATE_ONLY`),
optional `notes`, JSON `custom_fields`, `version`, timestamps, and `calendar_eligible`.

Rules: completed timer sessions require exact start/end and non-negative duration. Historical rows
require date plus duration and have `DATE_ONLY` with null timestamps. Categories are absent;
custom fields are optional JSON object keys with primitive/array values, reserved-key and size
validation. Only `EXACT` completed rows with valid times are Calendar-eligible.

### TimerSession

An in-progress client/server session: `id`, activity reference, started time, accumulated active
seconds, `state` (`RUNNING`, `PAUSED`, `COMPLETED`, `CANCELLED`), and pause start. Transitions:
RUNNING→PAUSED/COMPLETED/CANCELLED; PAUSED→RUNNING/COMPLETED/CANCELLED. Completion creates a
SessionRecord; cancellation creates no completed record.

## Integration records

### GoogleCredential

Per-user encrypted refresh token plus granted scopes, token expiry/revocation state, and Google
subject. Tokens are server-only and deleted/revoked on disconnect.

### SheetLink and SheetSnapshot

`SheetLink`: user, spreadsheet ID, managed tab ID/name, state, timestamps. `SheetSnapshot`: link,
record ID, normalized payload hash, remote version/updated value, last synced time and row hint.
`record_id`, not row hint, is the immutable join key. Missing, malformed, or duplicate remote IDs
are review errors.

### SheetConflict

Persisted conflict: link, record ID, local payload/version, remote payload/version, snapshot hash,
`PENDING|RESOLVED`, selected resolution, timestamps. A pending conflict blocks its record from
automatic push/pull.

### CalendarLink and CalendarPublication

`CalendarLink`: user, Google account, selected calendar ID, whether primary was chosen.
`CalendarPublication`: session record, calendar ID, deterministic event ID, remote event ID,
`PENDING|SUCCEEDED|FAILED`, attempts, next attempt, last error. Unique `(record_id, calendar_id)`
and deterministic event ID make retry idempotent.

### OutboxOperation

Durable operation for server sync or local offline capture: UUID idempotency key, operation type,
serialized payload, state (`PENDING|PROCESSING|FAILED|SUCCEEDED`), attempts, retry time, error.
Local IndexedDB entries are deleted only after server acknowledgement; server outbox entries are
the durable integration retry source.

## Sheet/CSV interchange

Managed headers: `record_id`, `activity_name`, `start_at`, `end_at`, `activity_date`,
`duration_seconds`, `status`, `notes`, `custom_fields_json`, `updated_at`, `record_version`.
Dates/times are ISO values; duration is integer seconds. Import validates all required context,
reports invalid rows, and never silently discards malformed custom JSON.
