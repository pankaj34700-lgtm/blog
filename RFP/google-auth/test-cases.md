# Test Cases — Google Sign-In

| Field | Value |
| --- | --- |
| Status | Draft — awaiting approval |
| Requirement | [requirement.md](./requirement.md) |
| Approved by | — |
| Date | 2026-10-24 |

## How to run

| Suite | Command | Covers |
| --- | --- | --- |
| unit / component | `npm run test` | TC-201–TC-216 |
| rules | `npm run test:rules` (Firestore emulator) | TC-220–TC-226 |
| lint | `npm run lint` | TC-217 |
| typecheck / build | `npm run build` | build correctness |

The real Google popup cannot be automated without a human account. It is verified
at runtime with `playwright-cli` in headed mode against the deployed site, with
trace, video, and screenshots under `test-results/e2e/google-auth/`.

## Test cases

### Header and auth resolution

| ID | Type | Given / When / Then | Expected | Automated |
| --- | --- | --- | --- | --- |
| TC-201 | unit | Given no session, when the header renders | `Sign in` link with `/signin`; no `Sign up` | yes |
| TC-202 | unit | Given a signed-in user, when the header renders | avatar with the user's name as alt, display name, `Sign out` button | yes |
| TC-203 | unit | Given auth is still resolving, when the header renders | skeleton status, no `Sign in` and no user name | yes |
| TC-204 | unit | Given auth resolves signed out, when the header renders | no flicker: skeleton is replaced by `Sign in` only | yes |

### Sign-in page and flow

| ID | Type | Given / When / Then | Expected | Automated |
| --- | --- | --- | --- | --- |
| TC-205 | unit | Given `/signin` renders | one `h1` and a `Continue with Google` button | yes |
| TC-206 | unit | Given the button, when activated | `signInWithGoogle` called exactly once | yes |
| TC-207 | unit | Given success, when sign-in resolves | navigates to `/` | yes |
| TC-208 | unit | Given `auth/popup-blocked` | falls back to redirect sign-in, no error shown | yes |
| TC-209 | unit | Given `auth/popup-closed-by-user` | stays on `/signin`, signed out, no alert | yes |
| TC-210 | unit | Given `auth/network-request-failed` | accessible alert with the reason and a retry action | yes |
| TC-211 | unit | Given `/signup` is opened | redirects to `/signin`, history replaced | yes |

### Session lifecycle

| ID | Type | Given / When / Then | Expected | Automated |
| --- | --- | --- | --- | --- |
| TC-212 | unit | Given an existing session, when the provider mounts | `onAuthStateChanged` emits the user; header signed in without a signed-out frame | yes |
| TC-213 | unit | Given a signed-in user, when `Sign out` is clicked | `signOut` called, header returns to signed out | yes |
| TC-214 | unit | Given the user object updates (name or photo), when it emits | header reflects the new values | yes |

### Profile document

| ID | Type | Given / When / Then | Expected | Automated |
| --- | --- | --- | --- | --- |
| TC-215 | unit | Given a first-time sign-in, when the profile sync runs | `setDoc(users/{uid}, {displayName, email, photoURL, provider:"google", createdAt, lastLoginAt}, {merge:true})` | yes |
| TC-216 | unit | Given the profile write rejects, when sign-in succeeds | signed-in header still renders; no alert; failure logged once | yes |

### Architecture

| ID | Type | Given / When / Then | Expected | Automated |
| --- | --- | --- | --- | --- |
| TC-217 | lint | Given any component, when lint runs | importing `firebase/auth` outside `src/lib/auth` fails | yes |

### Firestore rules (`users/{uid}`)

| ID | Type | Given / When / Then | Expected | Automated |
| --- | --- | --- | --- | --- |
| TC-220 | rules | Given the owner, when reading `users/{uid}` | allowed | yes |
| TC-221 | rules | Given another signed-in user, when reading `users/{uid}` | denied | yes |
| TC-222 | rules | Given no auth, when reading `users/{uid}` | denied | yes |
| TC-223 | rules | Given the owner, when creating their doc with valid fields | allowed | yes |
| TC-224 | rules | Given a signed-in user, when creating `users/{otherUid}` | denied | yes |
| TC-225 | rules | Given the owner updating `lastLoginAt` / `displayName` | allowed | yes |
| TC-226 | rules | Given the owner changing `createdAt`, or any client deleting the doc | denied | yes |

### Runtime (playwright-cli, headed)

| ID | Type | Given / When / Then | Expected | Runtime |
| --- | --- | --- | --- | --- |
| TC-230 | e2e | Given the deployed site, when opened signed out | header shows `Sign in`, no console errors | CLI |
| TC-231 | e2e | Given `/signin`, when Continue with Google is used with a real account | Google consent completes, returns to `/` signed in | CLI |
| TC-232 | e2e | Given a signed-in session, when the page reloads | header stays signed in with avatar and name | CLI |
| TC-233 | e2e | Given signed in, when `Sign out` is clicked | header returns to signed out | CLI |
| TC-234 | e2e | Given a signed-in session, when the profile doc is inspected | `users/{uid}` exists with the expected fields | CLI + console |

## Traceability

| Acceptance criterion | Test cases |
| --- | --- |
| AC-1 | TC-201, TC-230 |
| AC-2 | TC-205 |
| AC-3 | TC-206, TC-208, TC-231 |
| AC-4 | TC-202, TC-207 |
| AC-5 | TC-203, TC-204, TC-212, TC-232 |
| AC-6 | TC-213, TC-233 |
| AC-7 | TC-211 |
| AC-8 | TC-215, TC-216, TC-234 |
| AC-9 | TC-209, TC-210 |
| AC-10 | TC-220–TC-226 |
| AC-11 | TC-217 |
| AC-12 | TC-230, TC-231 |

## Coverage notes

- The Google consent dialog is outside our control and needs a real account; it is
  checked headed on the deployed site, not in CI.
- Popup and redirect are exercised through a mocked auth adapter, so the fallback
  logic is tested without a browser popup.
- Profile writes are best-effort by design; TC-216 asserts auth UI is independent.
- Rules tests use the Firestore emulator and never touch `blog-4b891`.
- The test-cases template's sample IDs were renumbered; the file is complete when
  every AC has at least one case.

## Changes after approval

| Date | Case | Change | Reason | Approved by |
| --- | --- | --- | --- | --- |
| | | | | |
