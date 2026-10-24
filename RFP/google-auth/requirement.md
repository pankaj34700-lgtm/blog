# Google Sign-In

| Field | Value |
| --- | --- |
| Status | Draft — awaiting approval |
| Owner | BlogX Dev |
| Approved by | — |
| Date | 2026-10-24 |
| Branch | feature/google-auth |
| Stack | React + Firebase (Hosting, Auth) + Firestore + Storage |
| Firebase project | blog-4b891 |

## Problem

The header still points at a placeholder `/signup` page, and the app has no real
accounts. Readers cannot identify themselves, so nothing can be personalized and
no future authoring or comment feature can be built.

## Goal

Sign in and sign up with a Google account through Firebase Authentication. The
header reflects the real session everywhere, the session survives reloads, and a
minimal profile document is ready for future features.

## Users and use cases

- **New reader**: clicks Sign in → Continue with Google → returns to the home page
  signed in.
- **Returning reader**: opens the site already signed in, sees their name and
  avatar, and can sign out.

## Scope

### In scope

- Firebase Auth with the Google provider only, using the existing web app config.
- `AuthProvider` + `useAuth()` as the single source of auth state.
- Header signed-out state: `Sign in` linking to `/signin` (replaces `Sign up`).
- Header signed-in state: avatar, display name, and `Sign out`.
- Header resolving state: skeleton placeholder, never a signed-out flash.
- `/signin` page with one “Continue with Google” action.
- `/signup` redirects to `/signin` so existing links keep working.
- Popup sign-in with redirect fallback when the popup is blocked.
- `users/{uid}` profile upsert on sign-in (create on first, update `lastLoginAt`).
- `firestore.rules` for `users/{uid}` with emulator rules tests.
- Unit/component tests with a mocked auth layer, plus a real headed Google check
  on the deployed site.

### Out of scope

- Email/password, magic links, phone auth, and password reset.
- Account deletion, account settings, and profile editing.
- Roles, admin claims, and protected content (nothing requires auth yet).
- Commenting, authoring, or avatar uploads (Google's `photoURL` is used as-is).
- Anonymous auth and linking multiple providers.

## Firestore data model

| Collection / path | Fields (type) | Document ID | Notes |
| --- | --- | --- | --- |
| `users/{uid}` | `displayName: string`, `email: string`, `photoURL: string \| null`, `provider: "google"`, `createdAt: timestamp`, `lastLoginAt: timestamp` | Firebase Auth UID | one document per account; `createdAt` set once, `lastLoginAt` on every sign-in |

### Queries and indexes

| Query | Fields and order | Index required |
| --- | --- | --- |
| Own profile by document path | `users/{uid}` | none |

### Access rules

| Collection | Read | Create | Update | Delete | Notes |
| --- | --- | --- | --- | --- | --- |
| `users/{uid}` | owner only | owner only, `uid` must match, required fields present | owner only, `createdAt` immutable, `uid`/`email` unchanged | deny | no cross-user reads; no client deletes |

### File uploads (Storage)

None. The avatar is Google's `photoURL`, loaded directly from Google's CDN.

## Deployment

| Item | Value |
| --- | --- |
| Project | blog-4b891 (single environment, live) |
| Targets | hosting, firestore:rules |
| Prerequisite | Google provider enabled in Authentication → Sign-in method |
| Authorized domains | `blog-4b891.web.app`, `blog-4b891.firebaseapp.com`, `localhost` |
| Migration or backfill | none; profiles are created lazily on first sign-in |
| Rollback | revert the feature commits and redeploy hosting; rules revert with the same deploy |

## Acceptance criteria

- [ ] **AC-1** — Signed out, the header shows `Sign in` linking to `/signin` and no `Sign up`.
- [ ] **AC-2** — `/signin` shows a single “Continue with Google” action.
- [ ] **AC-3** — Activating it starts Firebase Google sign-in; a blocked popup falls back to redirect.
- [ ] **AC-4** — Success returns to `/` and the header shows avatar, display name, and `Sign out`.
- [ ] **AC-5** — A reload keeps the signed-in header without a signed-out flash.
- [ ] **AC-6** — Sign out clears the session and restores the signed-out header.
- [ ] **AC-7** — `/signup` redirects to `/signin`.
- [ ] **AC-8** — First sign-in creates `users/{uid}`; later sign-ins update `lastLoginAt`;
  a profile write failure never blocks the signed-in UI.
- [ ] **AC-9** — Cancelled popup stays signed out with no error; blocked or failed
  sign-in shows an accessible alert with a retry path.
- [ ] **AC-10** — Rules allow owner-only read/create/update of `users/{uid}`, deny
  other users and deletes, and keep `createdAt` immutable, verified by emulator tests.
- [ ] **AC-11** — Auth state comes only from `useAuth()`; components never import
  `firebase/auth` directly, enforced by lint.
- [ ] **AC-12** — No console errors; the signed-out home page makes no Firestore or
  Storage requests.

## Enhancements considered

| Proposal | Decision | Reason |
| --- | --- | --- |
| One `AuthProvider` + `useAuth()` instead of per-component listeners | Adopted | single subscription, testable, no duplicate state |
| Lazy `users/{uid}` profile document | Adopted | future authoring needs it; no backfill required |
| Popup with redirect fallback | Adopted | popups are blocked on some mobile browsers |
| Header skeleton while auth resolves | Adopted | prevents the signed-out flash on reload |
| `/signup` → `/signin` redirect | Adopted | old links and the current header keep working |
| Email/password alongside Google | Deferred | not requested; expands validation and recovery work |
| Admin roles or custom claims | Deferred | no protected content yet |
| Avatar upload to Storage | Deferred | Google photo URL is sufficient for now |
| Auth emulator for automated sign-in | Deferred | the real Google popup needs a human; mocked context + headed manual check covers it |

## Assumptions

- The Google provider is enabled in the Firebase console with a support email.
- `blog-4b891.web.app` and `localhost` are authorized domains (Firebase default).
- Popups work on the desktop browsers we test; the fallback covers the rest.
- Profile writes are best-effort: auth state is authoritative, Firestore is secondary.

## Open questions

- Should any route become protected in a later feature? Not needed now.
- Do we want a user menu (profile, settings) instead of a bare Sign out button later?

## Risks and rollback

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Popup blocked or third-party cookies block the flow | User cannot sign in | redirect fallback plus an accessible error |
| Profile write fails after sign-in | Missing `users` document | sign-in still succeeds; retry on next sign-in; no blocking UI |
| Rules too permissive | Cross-user data exposure | owner-only rules with emulator allow/deny tests before deploy |
| Header flash on reload | Looks like a logout | resolving skeleton until `onAuthStateChanged` settles |
| Provider not enabled in console | Sign-in fails on the live site | verify the provider before deploy; stop and report if it is off |

Rollback: revert the feature commits, redeploy hosting and Firestore rules; no data
migration is involved because profiles are additive.
