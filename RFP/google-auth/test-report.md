# Test Run Report — Google Sign-In

| Field | Value |
| --- | --- |
| Feature | Google sign-in |
| Requirement | [requirement.md](./requirement.md) |
| Test cases | [test-cases.md](./test-cases.md) |
| Date | 2026-10-24 |
| Branch | feature/google-auth |
| Result | **Partial** — 43 automated pass, rules tests not run, live sign-in blocked |

## Automated suites

| Command | Result |
| --- | --- |
| `npm run test` | 43 passed / 11 files |
| `npm run lint` | clean |
| `npm run typecheck` | clean |
| `npm run build` | 374.85 kB initial + 416.97 kB lazy profile chunk |

Covered and passing: TC-201–TC-217 (header states, resolver skeleton, adapter fallbacks, sign-in page, profile payloads, lint guard).

## Rules tests — not run

TC-220–TC-226 are written against the Firestore emulator but were **not
executed**: the emulator requires Java and no JDK is installed. The user chose to
skip local rules tests, so the rules are deployed but unproven by automated
tests. `npm run test:rules` is ready for a machine with Java.

## Runtime, signed out (playwright-cli, headed)

| Case | Observed | Verdict |
| --- | --- | --- |
| TC-230 | header `Sign in` → `/signin`; `/signup` redirects to `/signin`; console 0 errors | pass |
| TC-144 equivalent | no Firestore or Storage requests while signed out | pass |

Evidence: `test-results/e2e/google-auth/google-auth.webm`,
`TC-230-signin-page.png`, trace `trace-1792808242593.trace`.

## Live Google sign-in — blocked

TC-231–TC-234 were not completed. The OAuth popup reaches
`accounts.google.com` with the real client ID, but finishing it needs a human
Google account and none was provided in the session. A persistent profile
(`tinnitus`) is open and ready for that check; it is still signed out.

## Deployment

| Item | Value |
| --- | --- |
| Project | blog-4b891 |
| Live URL | https://blog-4b891.web.app |
| Targets | `hosting`, `firestore:rules` |
| Web app | BlogX Web, `1:144579156939:web:28e94313ef02981e61f44e` (created during this feature) |
| Firestore database | created (default) by the rules deploy |

### Incident: fake config shipped once

The first deploy embedded the fake `.env.local` values, so OAuth failed with an
invalid API key. Cause: no web app existed in the project and the local env file
held placeholders. Fix: created the web app, wrote the real SDK config into the
gitignored `.env.local`, rebuilt, redeployed. OAuth now reaches Google with
`client_id=144579156939-…`.

## Gaps

- TC-220–226 unexecuted (no JDK).
- TC-231–234 unexecuted (needs a human Google sign-in).
- `users/{uid}` document existence is therefore unverified in the live project.
