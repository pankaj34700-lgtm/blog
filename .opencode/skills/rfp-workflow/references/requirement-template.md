# <Feature Name>

| Field | Value |
| --- | --- |
| Status | Approved |
| Owner | <name> |
| Approved by | <name> |
| Date | <YYYY-MM-DD> |
| Branch | feature/<kebab-case-name> |
| Stack | React + Firebase (Hosting) + Firestore + Storage |
| Firebase project | blog-4b891 |

## Problem

What is painful or missing today, and why it matters.

## Goal

One or two sentences on the outcome. Success is measurable.

## Users and use cases

- **<persona>**: <what they do and why>

## Scope

### In scope

- <capability>

### Out of scope

- <explicitly excluded, to prevent scope creep>

## Firestore data model

| Collection / path | Fields (type) | Document ID | Notes |
| --- | --- | --- | --- |
| `<collection>/{docId}` | `name: string`, `createdAt: timestamp` | auto ID | <denormalized copy of X> |

### Queries and indexes

| Query | Fields and order | Index required |
| --- | --- | --- |
| <description> | `status asc, createdAt desc` | composite: `status, createdAt` |

### Access rules

| Collection | Read | Create | Update | Delete | Notes |
| --- | --- | --- | --- | --- | --- |
| `<collection>` | <who> | <who + validation> | <who + immutable fields> | <who> | <role source: custom claims, admins doc> |

### File uploads (Storage)

| Path | Uploader | Allowed types | Max size | Public? | Cleanup on delete |
| --- | --- | --- | --- | --- | --- |
| `<path>/{uid}/<file>` | owner | image/png, image/jpeg | 5 MB | no | delete on document delete |

Uploaded from the React client with `uploadBytesResumable`; the download URL is
stored on the Firestore document.

## Deployment

| Item | Value |
| --- | --- |
| Project | blog-4b891 (single environment, live) |
| Targets | hosting, firestore:rules, firestore:indexes, storage |
| Migration or backfill | <none, or the script and how to roll back> |
| Rollback | <revert commit + redeploy, or feature flag> |

## Acceptance criteria

- [ ] **AC-1** — <observable, testable statement>
- [ ] **AC-2** — <observable, testable statement>

## Enhancements considered

| Proposal | Decision | Reason |
| --- | --- | --- |
| <alternative or improvement> | Adopted / Deferred / Rejected | <short reason> |

## Assumptions

- <assumption that, if wrong, changes the plan>

## Open questions

- <question> — <owner> — <needed by>

## Risks and rollback

| Risk | Impact | Mitigation |
| --- | --- | --- |
| <risk> | <impact> | <mitigation> |

Rollback: <how to undo, e.g. revert branch or feature flag>
