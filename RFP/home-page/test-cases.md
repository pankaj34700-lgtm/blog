# Test Cases — Home Page

| Field | Value |
| --- | --- |
| Status | Approved |
| Requirement | [requirement.md](./requirement.md) |
| Approved by | BlogX Dev |
| Date | 2026-10-24 |

## How to run

No Firebase-backed suite in this phase: nothing reads Firestore or Storage, so
there are no rules or data tests. Firebase is only initialized from env config.

| Suite | Command | Covers |
| --- | --- | --- |
| unit | `npm run test` | TC-101–TC-144 |
| lint | `npm run lint` | TC-140 |
| typecheck | `npm run typecheck` | build correctness |
| e2e | `npm run test:e2e` | TC-130–TC-135 |
| build | `npm run build` | production build |

Playwright uses the locally installed Chrome (`channel: "chrome"`) and starts the
Vite dev server automatically.

## Test cases

### Header

| ID | Type | Given / When / Then | Expected | Automated |
| --- | --- | --- | --- | --- |
| TC-101 | unit | Given the home page renders, when the header is inspected | `BlogX` is visible and links to `/` | yes |
| TC-102 | unit | Given the header, when queried by role link "Sign up" | accessible name is "Sign up", `href` is `/signup` | yes |
| TC-103 | unit | Given the header, when tabbing from the top of the page | focus reaches BlogX, then Sign up, in that order | yes |
| TC-104 | manual | Given the header, when Sign up is focused by keyboard | a visible focus ring appears | no |

### Data and sorting

| ID | Type | Given / When / Then | Expected | Automated |
| --- | --- | --- | --- | --- |
| TC-110 | unit | Given 12 published and 2 draft dummy posts, when `listLatestBlogs(10)` runs | returns 10 items, all published, newest `publishedAt` first | yes |
| TC-111 | unit | Given the repository default data, when called with limit 10 | exactly 10 items, no duplicates by `id` | yes |
| TC-112 | unit | Given the home page renders with default data | exactly 10 `article` elements are in the list | yes |
| TC-113 | unit | Given the newest post, when the first card renders | its title matches the newest post | yes |

### Card content

| ID | Type | Given / When / Then | Expected | Automated |
| --- | --- | --- | --- | --- |
| TC-114 | unit | Given a post, when its card renders | title, excerpt, author, formatted date, and tags are visible | yes |
| TC-115 | unit | Given a post with a cover image, when the card renders | `img` has non-empty alt and `loading="lazy"` | yes |
| TC-116 | unit | Given a post with `publishedAt`, when the card renders | date shows the stable format `Oct 20, 2026` | yes |

### States and resilience

| ID | Type | Given / When / Then | Expected | Automated |
| --- | --- | --- | --- | --- |
| TC-117 | unit | Given the repository resolves `[]` | "No posts yet" message, zero cards | yes |
| TC-118 | unit | Given the repository promise is pending | loading state renders, no cards yet | yes |
| TC-119 | unit | Given the repository rejects, then Retry is clicked | error message with Retry shows, then data renders | yes |
| TC-120 | unit | Given the home page renders | no `console.error` or `console.warn` calls | yes |

### Accessibility and structure

| ID | Type | Given / When / Then | Expected | Automated |
| --- | --- | --- | --- | --- |
| TC-121 | unit | Given the rendered page | one `banner`, one `main`, exactly one `h1`, cards use `h2` | yes |
| TC-122 | unit | Given the rendered page, when headings are inspected | no heading level is skipped | yes |

### Routing

| ID | Type | Given / When / Then | Expected | Automated |
| --- | --- | --- | --- | --- |
| TC-123 | unit | Given `/signup` is opened | placeholder page with `h1` "Sign up" and a link home | yes |
| TC-124 | unit | Given an unknown route like `/nope` | not-found page with a link home, no crash | yes |

### E2E and responsive

| ID | Type | Given / When / Then | Expected | Automated |
| --- | --- | --- | --- | --- |
| TC-130 | e2e | Given the app is served, when `/` loads | header shows BlogX and exactly 10 cards | yes |
| TC-131 | e2e | Given a 375px viewport | one column, no horizontal scroll | yes |
| TC-132 | e2e | Given a 768px viewport | two columns | yes |
| TC-133 | e2e | Given a 1440px viewport | three columns | yes |
| TC-134 | e2e | Given the home page, when Sign up is clicked | URL is `/signup` and the placeholder renders | yes |
| TC-135 | e2e | Given the home page loads | zero console errors and zero failed requests | yes |

### Architecture

| ID | Type | Given / When / Then | Expected | Automated |
| --- | --- | --- | --- | --- |
| TC-140 | unit (lint) | Given any component, when lint runs | importing `src/data/blogs` outside `src/data` fails (`no-restricted-imports`) | yes |

### Firebase configuration

| ID | Type | Given / When / Then | Expected | Automated |
| --- | --- | --- | --- | --- |
| TC-141 | unit | Given all six `VITE_` values, when the config module loads twice | the app is created once, `projectId` is `blog-4b891`, `db` and `storage` are instances | yes |
| TC-142 | unit | Given one required variable is missing, when config loads | throws an error naming that variable, not `undefined` | yes |
| TC-143 | unit | Given `.env.example` and `.gitignore` | all six keys documented, `.env.local` is ignored | yes |
| TC-144 | e2e | Given the home page loads with config wired | zero requests to `firestore.googleapis.com` or `firebasestorage.googleapis.com` | yes |

## Traceability

| Acceptance criterion | Test cases |
| --- | --- |
| AC-1 | TC-101, TC-102, TC-130, TC-134 |
| AC-2 | TC-103, TC-104 |
| AC-3 | TC-110, TC-111, TC-112, TC-130 |
| AC-4 | TC-114, TC-115, TC-116 |
| AC-5 | TC-110, TC-113 |
| AC-6 | TC-131, TC-132, TC-133 |
| AC-7 | TC-117, TC-118, TC-119, TC-120, TC-135 |
| AC-8 | TC-115, TC-121, TC-122 |
| AC-9 | TC-140 |
| AC-10 | TC-141, TC-142, TC-143, TC-144 |

## Coverage notes

- No Firestore/Storage rules tests: the page neither reads nor writes them.
- Excerpt truncation is CSS line clamping, not asserted in jsdom; e2e checks the
  three viewport layouts.
- Column counts are derived from card bounding boxes, so a CSS refactor cannot
  silently satisfy the test without the intended layout.
- Remote placeholder images are not asserted to load; only src/alt/lazy attributes.
- TC-104 (focus ring) stays manual because jsdom does not compute `:focus-visible`.

## Changes after approval

| Date | Case | Change | Reason | Approved by |
| --- | --- | --- | --- | --- |
| 2026-10-24 | TC-141–TC-144 | Added | Firebase config wiring approved during Phase 3 | BlogX Dev |
