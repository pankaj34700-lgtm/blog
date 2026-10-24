# BlogX Home Page

| Field | Value |
| --- | --- |
| Status | Approved |
| Owner | BlogX Dev |
| Approved by | BlogX Dev |
| Date | 2026-10-24 |
| Branch | feature/home-page |
| Stack | React + Firebase (Hosting) + Firestore + Storage |
| Firebase project | blog-4b891 |

## Problem

BlogX has no web presence yet. The repository is empty apart from project tooling,
so there is no page that shows the blog's name, no entry point for new readers,
and no path for someone to sign up.

## Goal

Ship a home page that presents BlogX and its ten latest posts, backed by dummy
data that is shaped like the future Firestore collection. Firebase is configured
but not queried. Success: a first-time visitor understands the site and can find
the Sign up action on any screen size.

## Users and use cases

- **New reader**: lands on `/`, sees the BlogX brand, browses the ten latest posts,
  and can choose Sign up.
- **Returning reader**: scans recent posts and opens one later (post detail is out
  of scope for this requirement).

## Scope

### In scope

- Vite + React + TypeScript app with plain CSS.
- Header with the `BlogX` wordmark linking to `/` and a `Sign up` link to `/signup`.- Home page listing exactly ten blog posts from local dummy data, newest first.
- Post card: cover image, title, excerpt, author, publish date, tags.
- Loading, empty, and error-with-retry states.
- Responsive grid: one column on mobile, two at tablet, three on desktop.
- `/signup` placeholder page and a not-found page.
- Firebase Web SDK initialization from `VITE_FIREBASE_*` environment variables for
  project `blog-4b891`, with no Firebase reads or writes.
- Vitest/React Testing Library component tests, runtime e2e verification through
  `playwright-cli` in headed mode (recorded, no spec files), and an ESLint rule
  preventing components from importing the dummy data module directly.

### Out of scope

- Authentication, the real sign-up form, and user accounts.
- Reading or writing Firestore; seeding the live project.
- Post detail pages, search, filtering, pagination, admin authoring.
- Dark mode, tagline/marketing copy beyond the wordmark.
- Deployment; `firebase deploy` is a separate approved step.

## Firestore data model

Not read or written in this phase. Target shape for the follow-up:

| Collection / path | Fields (type) | Document ID | Notes |
| --- | --- | --- | --- |
| `blogs/{postId}` | `title: string`, `slug: string`, `excerpt: string`, `content: string`, `authorName: string`, `authorId: string`, `coverImageUrl: string`, `coverImageAlt: string`, `tags: string[]`, `publishedAt: timestamp`, `status: "published" \| "draft"`, `readMinutes: number` | auto ID | `slug` unique by convention; client type uses ISO `publishedAt` until Firestore is wired |

### Queries and indexes

| Query | Fields and order | Index required |
| --- | --- | --- |
| Latest ten published posts | `where(status == "published")`, `orderBy(publishedAt, "desc")`, `limit(10)` | composite: `status asc, publishedAt desc` |

### Access rules

| Collection | Read | Create | Update | Delete | Notes |
| --- | --- | --- | --- | --- | --- |
| `blogs` | anyone, only when `status == "published"` | deny (no authoring yet) | deny | deny | single `status` field gates visibility; revisit with admin authoring |

### File uploads (Storage)

None in this phase. `storage` is initialized but no uploads occur. Cover images are
remote placeholder URLs. Future uploads will follow `images/{uid}/{fileId}` with
owner-only rules, PNG/JPEG only, 5 MB cap.

## Deployment

| Item | Value |
| --- | --- |
| Project | blog-4b891 (single environment, live) |
| Targets this phase | hosting |
| Targets later | hosting, firestore:rules, firestore:indexes, storage |
| Migration or backfill | none |
| Rollback | revert the feature commit and redeploy hosting |

## Acceptance criteria

- [ ] **AC-1** — Header shows `BlogX` (linking to `/`) and a visible `Sign up` action.
- [ ] **AC-2** — Sign up is keyboard-reachable with a visible focus state.
- [ ] **AC-3** — Home page renders exactly 10 blog cards from the dummy data source.
- [ ] **AC-4** — Each card shows cover image, title, excerpt, author, publish date, tags.
- [ ] **AC-5** — Cards are sorted newest first.
- [ ] **AC-6** — Layout is responsive: 1 column mobile, 2 tablet, 3 desktop, no horizontal scroll.
- [ ] **AC-7** — Empty, loading, and error states render without errors; error offers retry.
- [ ] **AC-8** — Images have meaningful alt text; one `banner`, one `main`, one `h1`, cards use `h2`.
- [ ] **AC-9** — Dummy data sits behind `listLatestBlogs`, and direct imports of the
  dummy module outside `src/data` fail lint.
- [ ] **AC-10** — Firebase initializes from `VITE_FIREBASE_*` for `blog-4b891`,
  fails fast naming any missing variable, and makes no Firebase network requests.

## Enhancements considered

| Proposal | Decision | Reason |
| --- | --- | --- |
| Repository layer (`listLatestBlogs(limit)`) instead of importing dummy arrays in components | Adopted | One-file swap to Firestore; keeps AC-9 testable |
| `react-router-dom` with `/signup` and not-found routes | Adopted | A dead button is worse UX; auth later plugs in without touching the header |
| Loading/empty/error states from day one | Adopted | Firestore latency is inevitable; retestable UI states now |
| Wire Firebase config now but keep dummy data | Adopted | De-risks the eventual swap without touching live data |
| Seeded Firestore or live-project data | Rejected | Out of scope and would touch the live project |
| Tagline / hero marketing copy | Deferred | Not requested; keeps the first slice small |
| Pagination / "load more" | Deferred | Requirement is a fixed ten |
| Dark mode | Deferred | Light theme via CSS variables makes it a later swap |

## Assumptions

- `blog-4b891` is a live Firebase project with a web app registered.
- Placeholder cover images may be remote URLs; tests do not depend on them loading.
- Publish dates are fixed in dummy data, so the rendered date strings are stable.
- Chrome is available, and `playwright-cli` drives it in headed mode for the
  recorded e2e verification.

## Open questions

- When real data lands: who authors posts, and do admins get a separate collection or
  custom claims? Needed before authoring work, not before this page.
- Whether the production build should use Firebase Hosting rewrites for SPA routes
  (needed at deploy time, not now).

## Risks and rollback

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Single live project, no staging | A deploy is user-visible immediately | Deploy remains a separate approved step; hosting-only target |
| Dummy data drifts from the Firestore shape | Rework when real data lands | Same field names and types; repository is the only seam |
| Missing/invalid env config at startup | Blank page | Fail fast with an error naming the missing variable; `.env.example` documents all keys |
| Remote placeholder images fail to load | Broken card visuals | `loading="lazy"`, alt text, and a neutral background on the image frame |
| CSS-only excerpt clamp is not unit-testable | Regression risk | Screenshot-level e2e at three widths |

Rollback: revert the feature commits on `feature/home-page`; no data or rules were
changed, so no migration is needed.
