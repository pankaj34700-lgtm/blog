---
name: RFP Feature Workflow
description: Use for any new feature, change request, or non-trivial bug fix in this React app deployed on Firebase project blog-4b891, with Firestore for data and Firebase Storage for client-side uploads. Runs the five-phase workflow - clarify and enhance the requirement, design test cases, get explicit user approval, branch and record the RFP docs, then implement autonomously until every approved test case passes. Covers Firestore and Storage rules, indexes, and Firebase deployment.
---

# RFP Feature Workflow

The user's personal delivery process. Follow the phases in order. Do not compress
or skip a phase unless the user explicitly says to.

## Hard rules

1. **No production code before Phase 3 approval.** Discussion, file reading, and
   read-only commands are fine; edits to source files are not.
2. **No branch and no `RFP/` folder before Phase 3 approval.**
3. **Only a clear affirmative counts as approval.** "ok", "go", "yes", "approved"
   are approval. Silence, "looks good" about one detail, or a new question is not.
4. **Never make a test pass by weakening it.** No deleting, skipping, `todo`,
   loosening assertions, or hard-coding expected output. If a test is wrong,
   get approval to change it and record why.
5. **Autonomy starts after the Phase 4 docs commit**, not before.
6. **Stay in scope.** Anything outside the approved requirement is a follow-up,
   not a silent addition.
7. **Fixed stack: React client, Firebase platform.** Firestore holds data,
   Firebase Storage holds files, and React is the only client framework. Do not
   add another database, storage service, backend, or UI framework without
   explicit approval.
8. **Test against the Firebase Emulator Suite, never against a live project.**
   No test, seed script, or experiment may read or write production data.
9. **Deploy once the feature is done.** When the definition of done passes,
   deploy the built app to Firebase project `blog-4b891` as the final step.
   Never deploy mid-feature, never to another project, and never widen the
   target list without saying so.
10. **No secrets in the repo.** Firebase config is read from project files or
    environment variables; service account keys, tokens, and `.env` files stay
    untracked.

## Stack conventions

- **Client:** React only, using the Firebase Web SDK. No Next.js, server
  rendering layer, extra state library, or component framework unless the user
  approves it in Phase 1.
- **Data:** Firestore (Native mode). Model collections and documents, keep reads
  denormalized where the queries demand it, and add composite indexes for every
  multi-field query the feature needs.
- **Files:** Firebase Storage, uploaded directly from the React client with
  `uploadBytes` / `uploadBytesResumable` and displayed via `getDownloadURL`.
  Never proxy uploads through a server, and never ask for a service account key
  in the browser.
- **No server code:** no Cloud Functions, Express server, or API routes. All
  authorization lives in `firestore.rules` and `storage.rules`; any logic that
  cannot be enforced there is a Phase 1 risk to raise, not an excuse to add a
  backend.
- **Deployment:** Firebase Hosting for the React build, plus Firestore rules and
  indexes and Storage rules, via
  `firebase deploy --only hosting,firestore:rules,firestore:indexes,storage`.
- **Project:** single Firebase project `blog-4b891`. Activate it with
  `firebase use blog-4b891` and verify the active project before any deploy.
  There is no separate staging project, so deploys reach the live app.
- **Emulators:** auth, firestore, storage, and hosting emulators for local
  development and tests.

## Phase 1 — Ask / Discuss / Enhance

Goal: turn a rough idea into an approved-quality requirement.

- Read the repository first (structure, stack, test tooling, existing `RFP/`
  folders) so questions are informed rather than generic.
- Ask focused questions, grouped and numbered, at most about five per round.
  Cover: problem and goal, target users, in-scope and out-of-scope, edge cases,
  data and state, error handling, UX, performance, security, compatibility,
  migration, and how success will be measured.
- For every feature, also settle the Firebase specifics before moving on:
  - **Data model:** collection and document paths, field names and types,
    document IDs, subcollections, denormalization, timestamps, and soft deletes.
  - **Queries and indexes:** exact query shapes, sort order, pagination, and the
    composite indexes they require.
  - **Access rules:** who may read, create, update, and delete each document,
    which fields are immutable, and how ownership or roles are represented
    (custom claims, an `admins` collection, or user documents).
  - **Files:** what users upload, Storage paths and naming, allowed content
    types and size limits, metadata to persist in Firestore, whether files are
    public or owner-only, and what happens to the file when its document is
    deleted.
  - **Deployment surface:** what ships (`hosting`, `firestore:rules`,
    `firestore:indexes`, `storage`), and whether a data migration, backfill, or
    Storage cleanup is needed.
- Propose enhancements actively: a simpler alternative, a smaller first slice,
  risks, and anything the user has not considered. Explain the trade-off in one
  or two lines each.
- Restate the requirement in your own words with a numbered acceptance-criteria
  list (`AC-1`, `AC-2`, ...). State assumptions explicitly and mark open
  questions.
- Keep this in chat. Do not create files yet.
- End the turn and wait for the user. Repeat until the requirement is stable.

## Phase 2 — Discuss and create test cases

Goal: agreed, traceable test cases derived from the acceptance criteria.

- Every acceptance criterion must map to at least one test case, and every test
  case must trace back to a criterion. Call out criteria that cannot be tested
  automatically.
- Cover, where relevant: happy path, boundaries and limits, negative and invalid
  input, error and recovery paths, permissions and auth, concurrency or repeat
  runs, data migration, and regression around touched behavior.
- Include the Firebase-specific layers, using the emulator suite:
  - **Rules tests** (`@firebase/rules-unit-testing`): Firestore allow and deny
    per role, ownership checks, immutable-field rejection, unauthenticated
    access; plus Storage allow and deny per path, content type, and size limit,
    per collection and path touched.
  - **Data tests:** document shape, defaults, server timestamps, and query
    results against a seeded emulator.
  - **Upload tests:** the React upload path against the Storage emulator —
    success, rejected type, rejected size, and cleanup after delete.
  - **E2E:** the user flow through the app with auth, Firestore, and Storage
    emulators.
- Present a table with these columns: `ID | Type | Given/When/Then | Expected |
  Automated`. Types: unit, rules, integration, e2e, manual.
- State the concrete run command per suite and detect the real tooling
  (package.json scripts, `firebase.json`, emulator config, CI config). If no
  test infrastructure exists, propose one and get it agreed here — including
  `firebase emulators:exec` as the runner for Firebase-backed tests.
- Do not write implementation code and do not edit tests yet.
- Discuss gaps and revisions with the user; end the turn and wait.

## Phase 3 — Get approval

- Present a short summary: requirement, acceptance criteria, test cases, the
  Firestore collections and Storage paths affected, the rules changes, the
  deployment targets, planned branch name, and planned `RFP/<Feature-Name>/`
  path.
- Ask exactly one explicit question, for example: "Requirement and test cases
  are ready — approve and start implementation? (yes / changes needed)".
- If the user requests changes, return to Phase 1 or 2 and re-ask. Never carry a
  partial approval forward.
- On approval, record the approver and date in the documents you are about to
  create.

## Phase 4 — Branch and record the RFP

- Check `git status` is clean; if not, ask how to handle the existing changes.
- Create the branch from the current default branch, using
  `feature/<kebab-case-name>` unless the repository already has a branch naming
  convention, in which case follow it.
- Create `RFP/<Feature-Name>/` at the repository root, using the name agreed in
  Phase 1 in kebab-case (for example `RFP/user-login/`). If the repository
  already has an `RFP/` layout, match it exactly.
- Write two files, based on the templates beside this skill:
  - `requirement.md` from `references/requirement-template.md`
  - `test-cases.md` from `references/test-cases-template.md`
  Copy the approved content verbatim — no new scope, no reworded criteria. If
  draft files already exist in the workspace, move them into the folder instead
  of rewriting them.
- Commit only these documents:
  `docs(rfp): add <feature-name> requirement and test cases`
- Keep the folder to documentation. Test runs, logs, and screenshots belong in
  the project's normal output locations, not in `RFP/`.

## Phase 5 — Autonomous implementation

From here, work without asking for confirmation on routine decisions. Announce
the start, then loop:

1. Pick the smallest coherent slice that advances the acceptance criteria.
2. Implement it, following the surrounding code style, naming, and patterns.
3. For Firestore work, update `firestore.rules` and the required indexes in the
   same slice as the query or write path that needs them. For uploads, update
   `storage.rules` in the same slice as the upload path. Rules and indexes are
   part of the feature, never a follow-up.
4. Run the relevant test command from `test-cases.md`, then the broader suite
   (lint, typecheck, unit, rules, integration, e2e) if the project has them.
   Firebase-backed tests run through the emulator suite, for example
   `firebase emulators:exec --only firestore,auth,storage "npm test"`.
5. Record which case IDs pass. If something fails, diagnose the cause and fix
   it, then re-run. Do not assume a failure is flaky.
6. Commit each working slice with a conventional message. Keep commits scoped;
   never mix unrelated refactors into the feature.
7. Repeat until every approved test case passes.

Additional rules:

- If you discover the requirement is ambiguous, or a test contradicts it, stop
  and ask — do not invent behavior.
- If blocked by credentials, external services, or destructive operations, stop
  and ask with a concrete proposal.
- If the same test fails after five genuine fix attempts, stop and report what
  you tried instead of thrashing.
- If you must change an approved test case, get approval first and note the
  change in `test-cases.md` with the reason.
- Do not push, open a PR, or modify CI unless asked.
- Do not run `firebase deploy`, `firebase functions:delete`,
  `firestore:delete`, or any command that touches a live project. The only
  permitted Firebase commands are emulator, login-status, project-list, and
  read-only inspection.

### E2E verification with playwright-cli (headed, recorded at runtime)

E2E cases are not written as Playwright spec files. Drive them at runtime with
`playwright-cli` in headed mode and record the session so the result is
reviewable. Automated suites stay at the unit and integration level.

1. Start the app in the background and wait until the URL responds.
2. Create `test-results/e2e/<feature>/` (gitignored) for the recordings.
3. `playwright-cli -s=<feature> open --headed <url>` — always headed for e2e, so
   the user can watch and intervene.
4. `playwright-cli -s=<feature> tracing-start`, then
   `playwright-cli -s=<feature> video-start test-results/e2e/<feature>/<feature>.webm --cursor`
5. Walk each e2e case in order: `snapshot`, interact by ref, confirm the result
   with `find` or `eval`. Re-snapshot after navigation.
6. Capture each breakpoint: `resize 375 812` and
   `screenshot --filename=test-results/e2e/<feature>/<case-id>-home-375.png`,
   then 768 and 1440. Name every file with the case ID it proves.
7. Read `console` and record any error or failed request.
8. `tracing-stop`, `video-stop`, pause a moment so the video flushes, then
   `close`. A file that is still 0 bytes means the stop and close raced; record
   it again.
9. Report the evidence paths and a per-case verdict (pass or fail, and what was
   actually on screen) in the final summary.

Evidence stays under `test-results/` and out of version control. Commit it only
when the user explicitly asks for recordings in the RFP folder. If
`playwright-cli` is unavailable, say so and ask before falling back to a
scripted suite — never skip verification silently.

## Phase 6 — Deploy to Firebase (required after done)

Deployment is the last step of a completed feature, not an optional extra. The
only project is `blog-4b891`, so a deploy is immediately live for real users.

1. Confirm the definition of done is met and the working tree is committed.
   Never deploy from a failing suite or an uncommitted build.
2. Make sure `firebase.json` and `.firebaserc` exist for `blog-4b891`, with
   Hosting serving `dist` and an SPA rewrite from `**` to `/index.html`. Add them
   once, then keep them.
3. `npm run build`, then confirm `dist/index.html` exists.
4. Verify the account and project: `firebase login:list` and
   `firebase projects:list`, then `firebase use blog-4b891`. If no account or no
   access, stop and ask the user to run `firebase login`.
5. Deploy the targets this feature actually changed:
   - always `hosting`;
   - add `firestore:rules` and `firestore:indexes` only when the collection or
     query changed;
   - add `storage` only when upload paths or storage rules changed.
   Example: `firebase deploy --only hosting,firestore:rules,firestore:indexes`.
6. Smoke-check the live result: request the hosted URL, confirm a 200 and the
   expected page content, and confirm the deploy output lists the targets you
   intended. For rules or indexes, check that the release reported success.
7. Report the live URL, the deployed commit, the target list, and the smoke-check
   result in the final summary.

Stop and report instead of retrying when: the build fails, authentication is
missing, the project is wrong, a rules deploy is rejected, or the deploy output
mentions an unexpected target. Never run `functions:delete`, `firestore:delete`,
or any command that deletes data. Never retry a failed deploy with a broader
target list.

If the user says not to deploy a particular feature, skip this phase and say so
explicitly in the summary.

## Definition of done

- Every acceptance criterion is covered by at least one passing test.
- Firestore rules are updated for every touched collection and pass their
  allow/deny tests; Storage rules are updated for every touched path and pass
  their allow/deny, type, and size tests; required composite indexes are
  committed.
- The full relevant suite passes on the emulator; paste the command and a short
  result summary.
- `RFP/<Feature-Name>/requirement.md` and `test-cases.md` reflect what was built,
  including the final data model and deployment targets.
- E2E evidence is recorded under `test-results/e2e/<feature>/` (trace, video, and
  one screenshot per breakpoint), and the final summary links to it.
- Commits are scoped and the branch is ready for review.
- The build is deployed to `blog-4b891`, and the live URL returns the expected
  content in a smoke check.
- Final message: what changed, test evidence, branch name, commits, live URL and
  deployed targets, and any follow-ups or known limitations.

## Language and tone

Match the user's language in discussion. Write documents and code comments in
the project's existing documentation language.
