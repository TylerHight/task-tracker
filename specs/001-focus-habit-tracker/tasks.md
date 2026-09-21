# Tasks: Personal Focus and Habit Tracker MVP

**Input**: Design documents from `/specs/001-focus-habit-tracker/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md, quickstart.md

**Tests**: Required by the project constitution for persistence, import/export, Google Calendar,
Google Sheets, conflict detection, and retry behavior.

**Organization**: Tasks are grouped by user story so each increment can be implemented and tested
independently after the shared foundation is ready.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the TypeScript full-stack PWA project and its developer tooling.

- [X] T001 Create the Next.js TypeScript project, package scripts, and source/test directories in `package.json` and `src/`
- [X] T002 [P] Configure TypeScript, ESLint, Prettier, and path aliases in `tsconfig.json`, `eslint.config.mjs`, and `.prettierrc`
- [X] T003 [P] Configure Vitest, Playwright, and coverage scripts in `vitest.config.ts`, `playwright.config.ts`, and `package.json`
- [X] T004 [P] Create environment-variable validation and example configuration in `src/lib/env.ts` and `.env.example`
- [X] T005 [P] Create mobile-first global tokens, base layout, and responsive shell in `src/app/layout.tsx` and `src/styles/globals.css`
- [X] T006 Configure PWA manifest, icons, root service-worker registration, and app-shell caching in `src/app/manifest.ts`, `src/pwa/service-worker.ts`, and `public/icons/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the shared database, authentication, validation, error, and durable-job
foundation required by every story.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T007 Define PostgreSQL connection, Drizzle configuration, and migration workflow in `drizzle.config.ts`, `src/server/db/client.ts`, and `src/server/db/migrations/`
- [X] T008 Define shared Zod DTOs, error codes, response helpers, and time utilities in `src/lib/schemas.ts`, `src/lib/errors.ts`, and `src/lib/time.ts`
- [X] T009 [P] Implement application sign-in/session middleware in `src/server/auth/session.ts` and `src/app/api/auth/[...route]/route.ts`
- [X] T010 Create the shared Drizzle schema and migration for users, GoogleCredential, activities, session records, timer sessions, and outbox operations in `src/server/db/schema.ts` and `src/server/db/migrations/0001_core.ts`
- [X] T011 Implement encrypted server-only Google credential storage, incremental OAuth state/PKCE validation, scope tracking, and disconnect/revocation after T010 in `src/server/auth/google.ts` and `src/app/api/google/[feature]/callback/route.ts`
- [X] T012 Implement transaction-scoped repositories and idempotency-key handling in `src/server/db/repositories.ts` and `src/server/services/outbox-service.ts`
- [X] T013 [P] Implement authenticated route middleware, request validation, structured error logging, and retryable-error mapping in `src/app/api/_lib/route.ts` and `src/server/observability/logger.ts`
- [X] T014 [P] Implement offline IndexedDB stores for pending captures and the foreground `online`/startup/manual retry drain in `src/pwa/offline-outbox.ts` and `src/pwa/retry-client.ts`
- [X] T015 [P] Write persistence/idempotency integration tests, including server failure after offline capture acknowledgement, in `tests/integration/persistence-and-outbox.test.ts`
- [X] T016 [P] Write OAuth scope/token-security unit tests ensuring no refresh token is returned to the browser in `tests/unit/google-auth.test.ts`

**Checkpoint**: Database, auth, offline outbox, validation, and safe retry primitives are ready.

---

## Phase 3: User Story 1 - Complete Focused Activity (Priority: P1) 🎯 MVP

**Goal**: Start a name-only or recent activity, run the flexible timer, and persist an accurate
completed session with no category requirement.

**Independent Test**: Start a named activity, pause/resume, complete it, and verify required
record fields; then start that activity again through the two-action recent flow.

### Tests for User Story 1

- [X] T017 [P] [US1] Write contract tests for `POST /api/activities/start` and timer state routes in `tests/contract/timer-api.test.ts`
- [X] T018 [P] [US1] Write timer state-transition and paused-duration unit tests in `tests/unit/timer-service.test.ts`
- [X] T019 [P] [US1] Write instrumented responsive end-to-end tests using stable browser performance marks for name-only start <=15 seconds and recent two-action start <=5 seconds, plus the 25-minute preset, pause/resume, cancel, and complete flows in `tests/e2e/focus-timer.spec.ts`

### Implementation for User Story 1

- [X] T020 [P] [US1] Add activity, timer-session, and completed-session schema constraints in `src/server/db/schema.ts`, including “completed timer sessions require exact start/end and non-negative duration”
- [X] T021 [US1] Implement activity lookup/creation and timer transitions `RUNNING→PAUSED/COMPLETED/CANCELLED` and `PAUSED→RUNNING/COMPLETED/CANCELLED` in `src/server/services/timer-service.ts`
- [X] T022 [US1] Implement start, pause, resume, complete, and cancel route handlers in `src/app/api/activities/start/route.ts` and `src/app/api/timers/[id]/[action]/route.ts`
- [X] T023 [P] [US1] Implement the mobile-first start/recent-activity control and only-required-name validation in `src/components/activity-start.tsx`
- [X] T024 [P] [US1] Implement timer controls, 25-minute preset, elapsed display, and paused state in `src/components/focus-timer.tsx`
- [X] T025 [US1] Compose the focus page and offline-pending completion handoff in `src/app/(app)/focus/page.tsx` and `src/pwa/offline-outbox.ts`

**Checkpoint**: User Story 1 is a usable, independently testable timer MVP.

---

## Phase 4: User Story 2 - Enrich and Review Activity History (Priority: P2)

**Goal**: Let users attach optional structured details and review editable, filterable history and
basic charts, including date-only historical records.

**Independent Test**: Complete a session, add notes/custom fields, filter history, and confirm the
record and its values appear in table and charts.

### Tests for User Story 2

- [ ] T026 [P] [US2] Write contract tests for record listing and editing in `tests/contract/records-api.test.ts`
- [ ] T027 [P] [US2] Write custom-field validation and date-only eligibility unit tests in `tests/unit/record-validation.test.ts`
- [ ] T028 [P] [US2] Write history/filter/chart responsive end-to-end tests in `tests/e2e/history.spec.ts`

### Implementation for User Story 2

- [ ] T029 [US2] Extend record persistence with `time_precision`, versioned optional notes, and optional custom-field JSON in `src/server/db/schema.ts` and `src/server/services/record-service.ts`, enforcing “custom fields are optional JSON object keys with primitive/array values”
- [ ] T030 [US2] Implement filterable list and optimistic-version edit routes in `src/app/api/records/route.ts` and `src/app/api/records/[id]/route.ts`
- [ ] T031 [P] [US2] Implement optional notes and add/remove custom-field key-value editor in `src/components/record-details-form.tsx`
- [ ] T032 [P] [US2] Implement accessible filterable history table and date-only display in `src/components/history-table.tsx`
- [ ] T033 [P] [US2] Implement basic duration/activity charts that include `DATE_ONLY` records in `src/components/history-charts.tsx`
- [ ] T034 [US2] Compose history, edit, filtering, and charts page in `src/app/(app)/history/page.tsx`

**Checkpoint**: User Story 2 independently supports flexible record enrichment and review.

---

## Phase 5: User Story 3 - Own, Export, and Import Records (Priority: P2)

**Goal**: Export understandable CSV and import valid historical Sheet-style rows while retaining
date-only records for review and charts.

**Independent Test**: Export saved records, then import exact-time and date-only workout rows; all
valid rows remain editable and the invalid rows are reported without corrupting local data.

### Tests for User Story 3

- [ ] T035 [P] [US3] Write CSV export contract and readable-header tests in `tests/contract/csv-export.test.ts`
- [ ] T036 [P] [US3] Write importer integration tests using the spreadsheet configured timezone and unformatted/raw values where available to prove deterministic date/duration normalization, date-only preservation with null times/no Calendar event, invalid-row reporting, custom JSON handling, and local-record preservation in `tests/integration/sheet-import.test.ts`
- [ ] T037 [P] [US3] Write import/export end-to-end tests in `tests/e2e/import-export.spec.ts`

### Implementation for User Story 3

- [ ] T038 [US3] Implement CSV serialization using `record_id, activity_name, start_at, end_at, activity_date, duration_seconds, status, notes, custom_fields_json, updated_at, record_version` in `src/lib/csv.ts` and `src/app/api/records/export.csv/route.ts`
- [ ] T039 [US3] Implement deterministic normalized row parsing that reads unformatted/raw Sheet values where available, converts date and duration using the spreadsheet configured timezone, and maps date-plus-duration/no-times to `DATE_ONLY` with null timestamps and Calendar eligibility false without inventing a time in `src/server/integrations/sheets/importer.ts`
- [ ] T040 [US3] Implement import transaction, invalid-row report, and stable-ID upsert rules in `src/server/services/sheet-import-service.ts` and `src/app/api/sheets/import/route.ts`
- [ ] T041 [US3] Implement import results UI and CSV export action in `src/components/import-export-panel.tsx` and `src/app/(app)/history/page.tsx`

**Checkpoint**: User Story 3 independently delivers portable local history and safe historical import.

---

## Phase 6: User Story 4 - Synchronize Google Sheet Safely (Priority: P3)

**Goal**: Link a user-selected Sheet and manually sync bidirectionally without duplicate rows or
silent conflict resolution.

**Independent Test**: Sync twice with no changes, then edit one record in both places; confirm one
row per stable ID and an explicit conflict before any overwrite.

### Tests for User Story 4

- [ ] T042 [P] [US4] Write Sheet OAuth/link and manual-sync route contract tests in `tests/contract/sheets-api.test.ts`
- [ ] T043 [P] [US4] Write mocked-Google integration tests for push, pull, repeated sync, missing/duplicate IDs, retries, and snapshot refresh in `tests/integration/sheets-sync.test.ts`
- [ ] T044 [P] [US4] Write conflict detector/resolution unit tests ensuring divergent versions create `PENDING` conflicts with no overwrite in `tests/unit/sheet-conflict-service.test.ts`
- [ ] T045 [P] [US4] Write browser tests for Google account selection, Sheet Picker browse/select, tab selection, link confirmation and visible linked-Sheet state, plus manual sync and conflict review in `tests/e2e/sheets-sync.spec.ts`

### Implementation for User Story 4

- [ ] T046 [US4] Add SheetLink, SheetSnapshot, SheetConflict, and serialized sync-job schema/migration in `src/server/db/schema.ts` and `src/server/db/migrations/0002_sheets.ts`
- [ ] T047 [US4] Implement incremental `drive.file` consent, selected-file linking, and server-side Sheets client in `src/server/integrations/sheets/client.ts` and `src/app/api/sheets/link/route.ts`
- [ ] T048 [US4] Implement managed-tab header/schema creation and normalized batch reader keyed only by visible `record_id` in `src/server/integrations/sheets/managed-sheet.ts`
- [ ] T049 [US4] Implement serialized snapshot comparison: local-only push, Sheet-only pull, unchanged no-op, and divergent pending conflict in `src/server/services/sheet-sync-service.ts`
- [ ] T050 [US4] Implement exact-ID batch update/append retry behavior and post-write reread before snapshot persistence in `src/server/integrations/sheets/writer.ts`
- [ ] T051 [US4] Implement manual sync, conflict list, and explicit local/Sheet/validated-merge resolution routes in `src/app/api/sheets/sync/route.ts` and `src/app/api/sheets/conflicts/[id]/resolve/route.ts`
- [ ] T052 [P] [US4] Implement a dedicated user-facing Google account connection, Sheet Picker browse/select, tab selection, link confirmation, visible linked-Sheet state, and manual-sync pending/retry UI in `src/components/sheet-sync-panel.tsx`
- [ ] T053 [P] [US4] Implement side-by-side conflict review and explicit resolution UI in `src/components/sheet-conflict-review.tsx`

**Checkpoint**: User Story 4 is independently safe under repeat sync, remote failure, and conflicts.

---

## Phase 7: User Story 5 - Publish Completed Sessions to Calendar (Priority: P3)

**Goal**: Let users select a Google Calendar and publish each eligible completed session once with a
retryable failure state, without importing Calendar changes.

**Independent Test**: Select a Calendar, complete an eligible session, simulate failed publish and
retry, then verify exactly one event and an intact local record.

### Tests for User Story 5

- [ ] T054 [P] [US5] Write Calendar connect/list/retry route contract tests in `tests/contract/calendar-api.test.ts`
- [ ] T055 [P] [US5] Write mocked-Google integration tests for deterministic ID insert, 409 fetch/update, transient retry, and local-record preservation in `tests/integration/calendar-publication.test.ts`
- [ ] T056 [P] [US5] Write Calendar eligibility unit tests proving `DATE_ONLY` and invalid exact-time records never enqueue publication in `tests/unit/calendar-eligibility.test.ts`
- [ ] T057 [P] [US5] Write Calendar selection/publication/retry browser tests in `tests/e2e/calendar-sync.spec.ts`

### Implementation for User Story 5

- [ ] T058 [US5] Add CalendarLink and CalendarPublication schema/migration, including unique `(record_id, calendar_id)` and deterministic event ID, in `src/server/db/schema.ts` and `src/server/db/migrations/0003_calendar.ts`
- [ ] T059 [US5] Implement incremental Calendar consent, calendar listing, dedicated default selection, and explicit primary selection in `src/server/integrations/calendar/client.ts` and `src/app/api/calendars/route.ts`
- [ ] T060 [US5] Enqueue Calendar publication only after local completed-record transaction and only for `EXACT` valid times in `src/server/services/calendar-publication-service.ts` and `src/server/services/timer-service.ts`
- [ ] T061 [US5] Implement deterministic-ID event insert, `appRecordId` private properties, 409 fetch/update recovery, bounded backoff, and retry state in `src/server/integrations/calendar/publisher.ts`
- [ ] T062 [US5] Implement user-initiated publication retry route with no Calendar pull route in `src/app/api/calendar-publications/[recordId]/retry/route.ts`
- [ ] T063 [P] [US5] Implement Calendar selection and connection UI in `src/components/calendar-settings.tsx`
- [ ] T064 [P] [US5] Implement per-record publication status and retry UI in `src/components/calendar-publication-status.tsx`

**Checkpoint**: User Story 5 delivers one-way, duplicate-safe Calendar visibility.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete product against quality, privacy, accessibility, and performance
requirements.

- [ ] T065 [P] Add service-worker install/offline/update tests and supported-browser fallback coverage in `tests/e2e/pwa-offline.spec.ts`
- [ ] T066 [P] Audit keyboard, screen-reader, touch-target, and responsive behavior across `src/components/` and document fixes in `docs/accessibility.md`
- [ ] T067 [P] Add 10,000-record history performance test and required indexes in `tests/integration/history-performance.test.ts` and `src/server/db/migrations/0004_indexes.ts`
- [ ] T068 [P] Add integration disconnect/revocation, scope-denial, and no-passive-tracking tests in `tests/integration/google-privacy.test.ts`
- [ ] T069 Document deployment configuration, OAuth consent setup, managed Sheet headers, and recovery behavior in `README.md` and `docs/google-integrations.md`
- [ ] T070 Run every unit, integration, contract, end-to-end, and quickstart validation scenario; record results in `specs/001-focus-habit-tracker/quickstart.md`

---

## Dependencies & Execution Order

```text
Setup → Foundational → US1 (MVP)
                     ├→ US2 → US3 → US4
                     └→ US5
US4 and US5 → Polish
```

- Setup blocks Foundational.
- Foundational blocks all stories.
- US1 is the independently deployable MVP.
- US2 builds on persisted records from US1; US3 builds on the record model/history in US2; US4
  builds on import/interchange rules in US3.
- US5 requires the core completed-record foundation but may proceed in parallel with US2–US4 after
  US1 is stable.
- Polish follows all desired stories.

## Parallel Opportunities

- In Setup: T002–T005 can run in parallel after T001; T006 is independent of application code.
- In Foundational: T009, T010, T013, T014, T015, and T016 can run in parallel once schema direction
  is agreed; T012 follows T011.
- Within each story, test tasks marked `[P]` can run in parallel before implementation; independent
  UI components marked `[P]` can proceed alongside server implementation.
- US5 may be staffed independently after US1; US2/US3/US4 remain sequential to preserve their
  record/import/sync foundation.

## Parallel Example: User Story 4

```text
Task: T042 Sheet API contract tests in tests/contract/sheets-api.test.ts
Task: T043 mocked Sheets integration tests in tests/integration/sheets-sync.test.ts
Task: T044 conflict detector tests in tests/unit/sheet-conflict-service.test.ts
Task: T045 Sheets browser tests in tests/e2e/sheets-sync.spec.ts
```

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational work.
2. Complete US1 through T025.

### Incremental Delivery

1. Add US2 for usable history and optional details.
2. Add US3 for ownership and historical portability.
3. Add US4 for manual, conflict-safe Sheet editing.
4. Add US5 for one-way Calendar visibility.
5. Complete cross-cutting validation and then run `$speckit-converge` before declaring the feature complete.
