<!--
Sync Impact Report
- Version change: unversioned scaffold -> 1.0.0
- Modified principles: scaffold placeholders -> User Friction First; Data Ownership and
  Portability; Data Integrity over Convenience; Privacy and Least Privilege; Test Behavior at
  Boundaries; Build Narrowly and Iteratively
- Added sections: Product and Data Constraints; Development Workflow and Completion Gates
- Removed sections: none
- Follow-up TODOs: TODO(RATIFICATION_DATE): confirm the original adoption date.
-->
# Task Tracker Constitution

## Core Principles

### I. User Friction First
Starting a previously used activity MUST take only a few seconds. Activity name is the sole
required field a user enters; every other field MUST be optional, inferred from prior choices, or
collected after the activity has started. Product decisions MUST favor an immediate return to a
known activity over setup, configuration, or data-entry convenience for the system.

Rationale: Task Tracker succeeds only when recording work is easier than skipping it.

### II. Data Ownership and Portability
The application database MUST be the source of truth for all user records. Users MUST be able to
view and edit their records and import or export them in understandable structured formats,
including CSV and Google Sheets. Imports and exports MUST preserve documented fields and convey
any unsupported data or validation issues clearly.

Rationale: Users retain control of their history and can move or recover it without dependence on
an integration.

### III. Data Integrity over Convenience
Google Calendar and Google Sheets sync MUST be retryable, duplicate-safe, and unable to lose a
local record. Local persistence MUST complete independently of remote sync success. When a sync
conflict cannot be resolved without overwriting a user record, the application MUST present it for
user review; it MUST NOT silently overwrite either record.

Rationale: A reliable local history is more important than an apparently seamless integration.

### IV. Privacy and Least Privilege
Each feature MUST request only the permissions and data access it needs. The product MUST NOT
perform passive surveillance, automatic activity tracking, or collect data unrelated to an
explicit user-requested feature. Permission prompts and connected-service access MUST be scoped
and explainable to the user.

Rationale: Trust requires that tracking remain intentional and under user control.

### V. Test Behavior at Boundaries
Automated tests are required for persistence, imports, exports, Google Calendar sync, Google
Sheets sync, conflict detection, and retry behavior. Boundary tests MUST cover success, failure,
idempotency where applicable, and the preservation of local records when a remote operation
fails.

Rationale: Data loss and duplication occur at system boundaries, where manual testing is not a
sufficient safeguard.

### VI. Build Narrowly and Iteratively
Development MUST prioritize the focus timer, activity history, structured custom fields, and
reliable integrations. Social features, AI coaching, and two-way Google Calendar sync are
explicitly deferred until real user use validates their need. New scope requires evidence of user
value and a Spec Kit amendment or feature specification before it is accepted.

Rationale: A small, dependable core creates useful feedback sooner than a broad, speculative
product.

## Product and Data Constraints

The local application database is authoritative. External calendars and spreadsheets are
integrations, not replacements for local storage. Structured custom fields MUST have documented
schemas and validation so that they can be edited, imported, and exported predictably. Sync
implementations MUST retain enough identity and operation state to safely retry without creating
duplicates.

## Development Workflow and Completion Gates

Every feature MUST have an approved Spec Kit specification, implementation plan, and
dependency-ordered task list before implementation begins. Completion requires automated tests
covering applicable behavior and boundaries, plus a Spec Kit convergence check confirming the
codebase satisfies the approved specification, plan, and tasks. A feature is not complete while
required tests fail, required artifacts are absent, or convergence identifies unaddressed work.

## Governance

This constitution supersedes conflicting project practices. Amendments MUST be proposed in the
constitution, identify affected principles or sections, include a Sync Impact Report, and be
approved before adoption. Versioning follows semantic intent: MAJOR for backward-incompatible
principle removals or redefinitions, MINOR for new principles or materially expanded guidance,
and PATCH for clarifications or non-semantic refinements. Every feature review and convergence
check MUST verify compliance with this constitution; deviations require an explicit, approved
amendment rather than an undocumented exception.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): confirm original adoption date |
**Last Amended**: 2026-09-10
