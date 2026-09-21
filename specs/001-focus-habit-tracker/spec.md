# Feature Specification: Personal Focus and Habit Tracker MVP

**Feature Branch**: `001-focus-habit-tracker`

**Created**: 2026-09-10

**Status**: Draft

**Input**: User description: "Create the MVP feature for a personal focus and habit tracker."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Complete Focused Activity (Priority: P1)

A single user starts a new activity by supplying only its name, or starts a previously used
activity in two taps/clicks within a few seconds. The user runs a flexible focus timer, using the
25-minute preset when desired, and can pause, resume, cancel, or complete the session. Completing
the session saves a usable record without requiring a category or other details.

**Why this priority**: Quick, intentional capture and completion are the core value of the MVP.

**Independent Test**: Start a named activity, pause and resume it, then complete it and confirm a
saved record has the correct activity name, time range, duration, and completed status.

**Acceptance Scenarios**:

1. **Given** no activity is active, **When** the user enters an activity name and starts a session,
   **Then** the session begins without requiring any other field.
2. **Given** an activity has been used previously, **When** the user selects it and confirms start,
   **Then** its session begins in two taps/clicks and the user does not re-enter the name.
3. **Given** a session is active, **When** the user pauses and resumes it, **Then** the elapsed
   duration excludes the paused interval.
4. **Given** a session is active, **When** the user cancels it, **Then** no completed activity
   record is created.
5. **Given** a session is active, **When** the user completes it, **Then** a completed record is
   saved with its actual start time, end time, and duration.

---

### User Story 2 - Enrich and Review Activity History (Priority: P2)

After completing focused work or a habit, the user adds optional notes and activity-specific
custom fields, such as bodyweight, workout details, study subject, or project outcome. The user
reviews records in a filterable history table and basic charts.

**Why this priority**: Flexible details and meaningful review turn timer events into an enduring
personal record without burdening session start.

**Independent Test**: Complete an activity, add optional notes and custom fields, then filter the
history and confirm the record and its details appear in the table and contribute to charts.

**Acceptance Scenarios**:

1. **Given** a completed session, **When** the user saves notes and custom field values, **Then**
   those values are stored with the activity record and no category is required.
2. **Given** activity history contains records, **When** the user filters by an available history
   criterion, **Then** the table and charts reflect only matching records.
3. **Given** an imported historical record has a date and duration but no exact time, **When** the
   user views history or charts, **Then** it remains available for review and contributes to
   applicable chart totals.

---

### User Story 3 - Own, Export, and Import Records (Priority: P2)

The user views and edits their local records, exports them as CSV, links a Google Sheet that can
be read and edited, and imports existing workout data from that Sheet. The local record store
remains authoritative.

**Why this priority**: Ownership, portability, and migration of existing data are essential to
long-term use and to trust in the tracker.

**Independent Test**: Create and edit records, export CSV, import Sheet rows including one without
an exact time, and verify that the resulting local records retain the supplied data and are
reviewable.

**Acceptance Scenarios**:

1. **Given** a saved record, **When** the user edits it, **Then** the updated local record is shown
   in history and becomes the authoritative version.
2. **Given** activity history exists, **When** the user exports CSV, **Then** each exported row is
   understandable and includes the record's available core and custom-field data.
3. **Given** a linked Sheet contains valid workout rows, **When** the user imports them, **Then**
   local records are created or updated according to their stable record IDs and import results
   identify invalid rows.

---

### User Story 4 - Synchronize Google Sheet Safely (Priority: P3)

The user manually synchronizes new and edited local records with a linked Google Sheet. Repeating
the synchronization does not duplicate records. If a record was edited both locally and in the
Sheet since their shared version, the user reviews the conflict before any overwrite occurs.

**Why this priority**: An editable external view is valuable only when it preserves the trusted
local history.

**Independent Test**: Synchronize a record twice, edit it in both locations, synchronize again,
and verify that one record remains and a conflict requires a user decision.

**Acceptance Scenarios**:

1. **Given** a linked Sheet and a new local record, **When** the user runs manual sync, **Then** one
   corresponding Sheet record is created with the same stable record ID.
2. **Given** a record already synchronized, **When** the user repeats sync without changes,
   **Then** no duplicate Sheet record is created.
3. **Given** a synchronized record was changed locally and in the Sheet, **When** the user runs
   sync, **Then** the application presents a conflict for review and performs no silent overwrite.

---

### User Story 5 - Publish Completed Sessions to Calendar (Priority: P3)

The user selects a Google account and a dedicated Calendar by default, or explicitly chooses the
primary Calendar. A completed session with valid start and end times is written once to that
Calendar. A failed Calendar attempt does not remove the local session and can be retried.

**Why this priority**: Calendar visibility complements the tracker while local data integrity
remains primary.

**Independent Test**: Select a Calendar, complete a timed session, retry a simulated failed
publication, and confirm exactly one Calendar event corresponds to the saved session.

**Acceptance Scenarios**:

1. **Given** the user is selecting a Calendar, **When** calendars are available, **Then** a
   dedicated Calendar is selected by default and the user may choose the primary Calendar.
2. **Given** a completed session with valid start and end times, **When** it is published,
   **Then** exactly one Calendar event is created for that session.
3. **Given** Calendar publication fails, **When** the user views the completed session, **Then**
   the local record remains saved and the user can retry publication.
4. **Given** an imported record without an exact start or end time, **When** Calendar publication
   is attempted, **Then** no Calendar event is created.

### Edge Cases

- Blank or whitespace-only activity names cannot start a session and receive a clear validation
  message.
- Completing a session immediately after starting records a non-negative actual duration.
- A paused session remains recoverable for resumption, completion, or cancellation without
  counting paused time.
- An interrupted or unavailable Calendar or Sheet connection leaves all local records intact and
  exposes a retryable sync state.
- Imported rows missing a date or duration are reported as invalid and do not create records.
- Imported rows with a date and duration but no exact time remain usable in history and charts but
  are ineligible for Calendar publication.
- Unrecognized or malformed stable record IDs are reported during import or sync and do not cause
  existing records to be overwritten.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow one user to start a new activity by entering only a non-blank
  activity name.
- **FR-002**: The system MUST make previously used activities selectable so the user can start one
  in two taps/clicks and within a few seconds under normal use.
- **FR-003**: The system MUST provide a flexible focus timer with a 25-minute preset and actions to
  pause, resume, cancel, and complete a session.
- **FR-004**: The system MUST record every completed session's activity name, start time, end time,
  actual duration, and completed status.
- **FR-005**: The system MUST allow optional notes and optional structured custom fields on a
  record, including values applicable to bodyweight, workout details, study subject, and project
  outcome, without requiring a category or any custom field.
- **FR-006**: The system MUST allow users to view and edit local activity records in a filterable
  history table with basic charts derived from the history.
- **FR-007**: The system MUST export local records as understandable CSV data including available
  core fields and custom-field data.
- **FR-008**: The system MUST allow a user to link one Google Sheet, read its records, and import
  valid existing workout data into the local record store.
- **FR-009**: The system MUST retain imported records with a date and duration but no exact time
  for history and charts, while marking them ineligible for Calendar publication.
- **FR-010**: The local application database MUST remain the source of truth for every activity
  record; remote integration failure MUST NOT remove or silently replace a local record.
- **FR-011**: The system MUST support user-initiated synchronization of new and edited local
  records to the linked Google Sheet using a stable record ID.
- **FR-012**: The system MUST make repeated Sheet synchronization idempotent: unchanged records
  MUST NOT create duplicate Sheet rows.
- **FR-013**: When both the local record and its linked Sheet record changed after their last
  shared version, the system MUST require user review before resolving the conflict and MUST NOT
  silently overwrite either version.
- **FR-014**: The system MUST let the user select a Google account and Calendar, selecting a
  dedicated Calendar by default while allowing the primary Calendar to be chosen.
- **FR-015**: The system MUST publish each eligible completed session once to the selected Calendar
  and retain a retryable failure state when publication cannot be completed.
- **FR-016**: The system MUST NOT import changes from Calendar events into app records in this MVP.
- **FR-017**: The system MUST request access only when needed for the user-selected Sheet or
  Calendar feature and MUST NOT perform passive activity surveillance or automatic activity
  tracking.
- **FR-018**: The MVP MUST exclude social features, leaderboards, team or project management,
  billing, AI coaching, native mobile applications, and two-way Calendar synchronization.

### Key Entities *(include if feature involves data)*

- **Activity**: A reusable user-named focus or habit type that supports rapid future starts.
- **Session Record**: The authoritative local record of a completed or otherwise finalized activity,
  including name, dates and times when known, duration, status, notes, custom fields, and stable
  record ID.
- **Custom Field**: An optional named structured value associated with a session record.
- **Sheet Link**: The user's linked Google Sheet and synchronization state for record IDs and their
  last shared versions.
- **Calendar Link**: The user's selected Google account and Calendar plus the publication state of
  eligible completed sessions.
- **Sync Conflict**: A record whose local and Sheet versions both changed after their last shared
  version and requires a user resolution.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can start a previously used activity in no more than two taps/clicks and in
  five seconds or less in 95% of observed attempts.
- **SC-002**: A user can start a new named activity and begin timing in 15 seconds or less without
  entering any field other than the name in 95% of observed attempts.
- **SC-003**: 100% of completed sessions retain their required name, start/end times, actual
  duration, and status after an interrupted Calendar or Sheet synchronization attempt.
- **SC-004**: Repeating an unchanged Sheet synchronization produces zero duplicate records in 100%
  of tested repetitions.
- **SC-005**: 100% of detected concurrent local-and-Sheet changes require an explicit user review
  before a version is overwritten.
- **SC-006**: 100% of imported records with a date and duration but no exact time remain visible in
  history and applicable charts while producing no Calendar event.
- **SC-007**: A user can filter history and see the matching table and basic charts in three
  seconds or less for a history of 10,000 records.
- **SC-008**: A user can export all available record data as a readable CSV file and identify the
  matching stable record IDs for 100% of exported records.

## Assumptions

- The MVP serves one user's private data and does not require collaboration or organization-level
  permissions.
- The user provides and authorizes access to a Google account only when choosing a Sheet or
  Calendar feature.
- A dedicated Calendar is an available Calendar selected for focus sessions; if one is unavailable,
  the user explicitly selects from available Calendars, including the primary Calendar.
- Basic charts summarize the user's stored activity history; advanced analytics are outside scope.
- Historical imports provide a date and duration at minimum; exact time fields are optional.
- CSV exports use documented headings for core data and a readable representation of custom fields.
- Calendar publishing is one-way in this MVP: Calendar events are never used to update local
  records.
