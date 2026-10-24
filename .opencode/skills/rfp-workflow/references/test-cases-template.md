# Test Cases — <Feature Name>

| Field | Value |
| --- | --- |
| Status | Approved |
| Requirement | [requirement.md](./requirement.md) |
| Approved by | <name> |
| Date | <YYYY-MM-DD> |

## How to run

All Firebase-backed suites run against the emulator suite, never a live project.

| Suite | Command | Covers |
| --- | --- | --- |
| unit | `<command>` | TC-1xx |
| rules | `firebase emulators:exec --only firestore,storage "npm run test:rules"` | TC-5xx |
| integration | `firebase emulators:exec --only firestore,auth,storage "npm run test:integration"` | TC-2xx |
| e2e | `firebase emulators:exec --only firestore,auth,storage,hosting "npm run test:e2e"` | TC-3xx |

## Test cases

| ID | Type | Given / When / Then | Expected | Automated |
| --- | --- | --- | --- | --- |
| TC-101 | unit | Given <precondition>, when <action>, then <result> | <observable outcome> | yes |
| TC-201 | integration | Given <precondition>, when <action>, then <result> | <observable outcome> | yes |
| TC-301 | e2e | Given <precondition>, when <action>, then <result> | <observable outcome> | yes |
| TC-401 | manual | Given <precondition>, when <action>, then <result> | <observable outcome> | no |
| TC-501 | rules | Given an unauthenticated client, when it reads `users/{otherId}`, then access is denied | PERMISSION_DENIED | yes |
| TC-502 | rules | Given the owner, when it updates `users/{uid}.displayName`, then the write succeeds | document updated | yes |
| TC-503 | rules | Given any client, when it writes an immutable field, then the write is rejected | PERMISSION_DENIED | yes |
| TC-504 | rules | Given the owner, when it uploads a 6 MB PNG to `images/{uid}/a.png`, then the upload is rejected | storage/unauthorized | yes |
| TC-505 | rules | Given a non-owner, when it uploads to `images/{otherUid}/a.png`, then the upload is rejected | storage/unauthorized | yes |

Types: unit, rules, integration, e2e, manual. Every Firestore collection touched
needs at least one allow and one deny case; every Storage path needs at least one
allowed upload, one wrong-owner deny, and one type or size deny.

## Traceability

| Acceptance criterion | Test cases |
| --- | --- |
| AC-1 | TC-101, TC-201 |
| AC-2 | TC-301 |

## Coverage notes

- <what is intentionally not covered and why>
- <flaky or environment-dependent areas>

## Changes after approval

| Date | Case | Change | Reason | Approved by |
| --- | --- | --- | --- | --- |
| | | | | |
