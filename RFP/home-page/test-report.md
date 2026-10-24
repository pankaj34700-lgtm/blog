# Test Run Report — Home Page

| Field | Value |
| --- | --- |
| Feature | BlogX home page |
| Requirement | [requirement.md](./requirement.md) |
| Test cases | [test-cases.md](./test-cases.md) |
| Date | 2026-10-24 |
| Branch | feature/home-page |
| Result | **Pass** (23 unit, 6 runtime e2e, 1 manual) |

## Environment

| Item | Value |
| --- | --- |
| OS | Windows |
| Node | 24.20.0 |
| Browser | Chrome, headed via `playwright-cli` |
| App URL | http://127.0.0.1:5173 |
| Firebase project | blog-4b891 (initialized, never called) |

## Automated suites

| Command | Result | Notes |
| --- | --- | --- |
| `npm run test` | 23 passed / 7 files | Vitest + React Testing Library, jsdom |
| `npm run lint` | clean | includes the dummy-import guard (TC-140) |
| `npm run typecheck` | clean | `tsc --noEmit` |
| `npm run build` | built | 269.88 kB JS / 4.38 kB CSS |

### Unit and component cases

| Cases | Area | Result |
| --- | --- | --- |
| TC-101, TC-102, TC-103 | Header brand, Sign up link, tab order | pass |
| TC-110, TC-111, TC-113 | Repository filtering, ordering, limit, uniqueness | pass |
| TC-112, TC-114, TC-115, TC-116 | Ten cards, card content, images, date format | pass |
| TC-117, TC-118, TC-119 | Empty, loading, error with Retry | pass |
| TC-120, TC-121, TC-122 | Console cleanliness, landmarks, heading order | pass |
| TC-123, TC-124 | `/signup` placeholder, unknown route | pass |
| TC-140 | Direct `data/blogs` import fails lint | pass |
| TC-141, TC-142, TC-143 | Firebase app init, missing env key, env docs | pass |

## Runtime e2e (playwright-cli, headed)

Session: `blogx-runtime` — opened with `open --headed`, recorded with
`tracing-start` and `video-start … --cursor`, closed after `go-back` to the home
page.

| Case | Action | Observed | Verdict |
| --- | --- | --- | --- |
| TC-130 | Load `/` | `BlogX`, `/signup` link, 10 articles, first title “Why I Still Reach for Plain CSS” | pass |
| TC-131 | `resize 375 812` | 1 column, no horizontal scroll | pass |
| TC-132 | `resize 768 900` | 2 columns | pass |
| TC-133 | `resize 1440 900` | 3 columns | pass |
| TC-134 | Click “Sign up” | URL `/signup`, `h1` “Sign up” | pass |
| TC-135 | Read `console` | 3 messages, 0 errors, 0 warnings | pass |
| TC-144 | Read resource timings | zero `googleapis` / `firebaseio` requests | pass |

## Manual verification (playwright-cli, headed)

Session: `blogx-focus` — opened headed, two `Tab` presses, then computed styles
read from the focused element.

| Case | Action | Observed | Verdict |
| --- | --- | --- | --- |
| TC-104 | `Tab`, `Tab` | focus order `BlogX` → `Sign up`; focused link shows `outline: solid 2.4px rgb(31, 111, 235)`, offset `2.4px` | pass |

## Evidence

Recorded under `test-results/e2e/home-page/` (gitignored):

| File | Proves |
| --- | --- |
| `home-page.webm` | Full headed walkthrough with cursor |
| `TC-131-home-375.png` | One-column mobile layout, no horizontal scroll |
| `TC-132-home-768.png` | Two-column tablet layout |
| `TC-133-home-1440.png` | Three-column desktop layout |
| `TC-134-signup.png` | Sign-up placeholder after navigation |
| `TC-104-focus-signup.png` | Visible focus ring on the focused Sign up link |

Trace and network log: `.playwright-cli/traces/trace-1792804565008.trace` and
`.network`, with the `resources/` directory beside them.

## Not covered

- **Excerpt truncation**: CSS line clamping only; judged visually in the three
  viewport screenshots.
- **Firestore and Storage**: no reads, writes, rules, or indexes this phase.

## Reproduction

```powershell
npm run dev
# in another terminal
playwright-cli -s=home-page open --headed http://127.0.0.1:5173
playwright-cli -s=home-page tracing-start
playwright-cli -s=home-page video-start test-results/e2e/home-page/home-page.webm --cursor
playwright-cli -s=home-page eval "() => document.querySelectorAll('article').length"
playwright-cli -s=home-page resize 375 812
playwright-cli -s=home-page screenshot --filename=test-results/e2e/home-page/TC-131-home-375.png
playwright-cli -s=home-page console
playwright-cli -s=home-page tracing-stop
playwright-cli -s=home-page video-stop
Start-Sleep -Seconds 2
playwright-cli -s=home-page close
```

## Notes

- The first recorded run at this commit produced a 0-byte video when
  `video-stop` and `close` were called back to back. Re-recording with a short
  pause after `video-stop` produced a valid 184 KB file. Keep the pause in the
  runtime procedure.
- No Playwright spec files exist by design; e2e is executed at runtime in headed
  mode and recorded.
