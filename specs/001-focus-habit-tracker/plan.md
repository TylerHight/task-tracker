# Implementation Plan: Personal Focus and Habit Tracker MVP

**Branch**: `001-focus-habit-tracker` | **Date**: 2026-09-11 | **Spec**: [spec.md](spec.md)

## Summary

Build a mobile-first TypeScript PWA for one user's focus and habit records. React via Next.js
provides the interface and server routes; managed PostgreSQL is authoritative. IndexedDB holds a
durable offline-capture outbox. Server-held Google credentials run manual Sheet sync and one-way
Calendar publication. Stable record IDs, snapshots, and deterministic Calendar event IDs make
retries duplicate-safe and require explicit conflict review.

## Technical Context

**Language/Version**: TypeScript; current supported Node.js LTS

**Primary Dependencies**: Next.js/React, Drizzle ORM, PostgreSQL driver, OAuth/OIDC library,
Google APIs client, schema validation, PWA service-worker tooling, IndexedDB wrapper, TypeScript
unit/integration test runner, browser end-to-end test runner

**Storage**: Managed PostgreSQL (authoritative); IndexedDB for unacknowledged offline capture and
outbox only; Cache Storage for app shell/assets only

**Testing**: Unit; PostgreSQL and mocked-Google integration; HTTP contract; responsive PWA/offline
browser end-to-end tests

**Target Platform**: Installable responsive PWA on current phone and desktop browsers; Node server

**Project Type**: Full-stack web application

**Performance Goals**: 95% of repeated starts <=5 seconds and <=2 taps/clicks; filtered history and
charts <=3 seconds for 10,000 records

**Constraints**: HTTPS; offline completion survives reload; remote failures never delete local
records; manual Sheet sync; one-way Calendar sync; least-privilege incremental OAuth; no passive
tracking

**Scale/Scope**: One private user per account, one Sheet and one selected Calendar; 10,000 records;
no teams, billing, native apps, social features, or AI coaching

## Constitution Check

### Pre-design Gate — PASS

- Name-only start and recent activity actions meet the friction principle.
- PostgreSQL, CSV, and visible Sheet fields preserve ownership; outbox records remain visibly
  pending until server acknowledgement, avoiding a second source of truth.
- Durable jobs, IDs, snapshots, conflict records, and retry states uphold integrity.
- Incremental consent and server-only tokens uphold privacy.
- Boundary test suites cover all constitution-mandated persistence, import/export, sync, conflict,
  and retry behavior.
- The scope excludes all deferred product areas.

### Post-design Gate — PASS

Date-only history is explicitly Calendar-ineligible; Sheet and Calendar operations only follow
local persistence and cannot silently overwrite divergent data. No exceptions are needed.

## Project Structure

### Documentation

```text
specs/001-focus-habit-tracker/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/api.md
└── tasks.md                 # created later by $speckit-tasks
```

### Source Code (repository root)

```text
src/
├── app/                     # pages and route handlers
├── components/              # timer, history, charts, sync/conflict UI
├── features/                # activities, sessions, history, integrations
├── server/
│   ├── db/                  # schema, migrations, repositories
│   ├── auth/                # app and Google OAuth
│   └── integrations/        # Calendar, Sheets, durable jobs
├── lib/                     # shared types, validation, time, CSV
└── pwa/                     # manifest, worker, offline outbox client
tests/{unit,integration,contract,e2e}/
```

**Structure Decision**: One full-stack TypeScript application keeps the MVP maintainable while
isolating browser PWA work from privileged server database and Google operations.

## Complexity Tracking

No constitution violations require justification.
