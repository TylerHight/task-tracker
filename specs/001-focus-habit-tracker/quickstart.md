# Quickstart Validation Guide

## Prerequisites

- A managed PostgreSQL development database and application environment variables.
- A Google OAuth client with HTTPS development redirect URI.
- A test Google account, one editable Google Sheet, and a dedicated test Calendar.
- Node.js LTS and project dependencies installed after implementation.

## Validation scenarios

1. Start a new activity with its name only; use pause/resume and 25-minute preset; complete it.
   Confirm required record fields and no required category/custom field.
2. Start the same activity again using the recent-activity action. Confirm <=2 actions and the
   target timing goal. View/filter history and charts.
3. Install the PWA, go offline, complete a session, reload, reconnect, and use visible retry.
   Confirm exactly one authoritative record after acknowledgement.
4. Add notes and custom fields; export CSV. Confirm readable documented data and stable IDs.
5. Link a selected Sheet, import exact-time and date-only rows, then verify both in history while
   only exact-time eligible sessions can publish to Calendar.
6. Run unchanged manual Sheet sync twice; confirm no duplicates. Edit a record locally and in Sheet,
   run sync, and confirm a pending conflict with no overwrite until an explicit selection.
7. Connect Calendar incrementally, select dedicated and primary options, complete an eligible
   session, and confirm one event. Simulate a transient failure and retry; confirm local record
   survives and exactly one event exists.

## Test commands

The implementation must provide documented package scripts for unit, integration, contract, and
end-to-end suites. Run all suites before completion, including mocked Google failure/retry and a
real sandbox-only integration smoke test when credentials are available. See [data-model.md](data-model.md)
and [contracts/api.md](contracts/api.md) for expected states and interfaces.
