# SDD ledger — plan: docs/plans/2026-11-07-design-system-midia.md

Execution: inline.
Ruling: scripts task-start/task-done/sdd-workspace unavailable from the installed skill; use this durable ledger, per-task briefs from the plan and direct test commands — preserves evidence without blocking implementation.
Ruling: new standalone repository on feature branch, isolated from existing files; no main branch changes.
Pre-flight: 1→2→3→5→8–10 share MediaAdapter, snapshots and command results; consistent. 4→5–7 share primitives and labels; consistent. 6 consumes player state; chapter controls integrated in task 6, not forward-imported in task 5. 7 consumes ImageData; define it in task 1 to validate consumers. 11–12 consume only public exports.

Task 1: complete — typecheck RED (missing contracts) → GREEN; npm test 1/1; all package builds and Node import passed. Dependencies locked in package-lock.json.
Task 2: complete — lifecycle tests written before store; initial failure missing module, then 5/5 tests and typecheck passed. Late initialization and late commands cannot overwrite the new source; StrictMode cleanup and SSR exercised.
Task 3: implemented, validation partial — 9/9 unit/integration tests and typecheck passed; ffmpeg fixtures created with provenance. Real playback E2E attempted, BLOCKED: Chromium startup fails at socket() Operation not permitted. Browser download returned invalid archive. Do not mark real playback passed. Ruling: continue implementation and ship runnable browser tests with explicit pending status — unavailable host capabilities cannot be represented as product validation.
Task 4: complete — primitives 4 cases, dialog focus/name/description, slider changes, typing and axe exercised. Description association regression test passed; explicit ID association retained. Core defaults and neutral CSS implemented. Contrast defaults reviewed; browser and assistive technology checks pending.
Task 5: complete — 16/16 tests + typecheck passed. Scoped shortcuts, capability-driven controls and blocked playback feedback covered. Controls are always visible. Ruling: add optional adapterFactory to ready-made players for custom integrations and testing; default remains lazy provider resolution. Streaming/external loaders are added in tasks 8–10.
Task 6: complete — 19/19 tests and typecheck passed. Transcript seeks on explicit action without moving focus; static text for non-seekable sources; HTML-like text escaped; described source restores position/play intent after readiness. VTT fixtures and attachment implemented; actual VTT display awaits browser execution.
Task 7: complete — 22/22 tests + typecheck passed. Image alternatives, error states, keyboard dialog/zoom and removed-opener focus fallback covered. Viewer supports pan buttons and keyboard. Gallery thumbnails suppress nested retry buttons inside their trigger.
Task 8: implemented, validation partial — 24/24 unit/integration tests + typecheck passed. HLS/DASH engines load lazily; live utility RED→GREEN, gap seeks and no-DVR covered. VOD segments and sliding live manifest fixtures included. Real streaming E2E awaits usable browser environment. Native HLS live identification is conservative (moving window) and provider limits will be documented.
Task 9: implemented, validation partial — 27/27 tests + typecheck passed. SDK loading shares a promise and retries after rejected load; iframe host validation, provider controls and aborted/destroyed instance behavior covered with SDK boundary doubles. Real external playback pending. Ruling: add optional live hint to YouTube/Vimeo source descriptors; official iframe APIs do not reliably identify every live stream, so consumers must declare live=true to suppress unsupported custom seek.
Ruling: MPEG-TS fixtures use .mpegts instead of .ts so the TypeScript compiler and Vite do not parse binary video segments as source code.
Task 10: implemented, validation partial — 29/29 tests + typecheck passed. Vimeo initialization and command rejection, restricted embed cleanup and late-event safety covered at SDK boundary. Conservative rate support keeps the provider UI available. Real YouTube/Vimeo readiness/playback/keyboard checks still need an enabled browser and authorized content.
Task 11: complete — compiled catalog, JSX/TSX examples, CSS/public provider exports and independent packed consumers passed with React 18.2.0 + 19.3.1. SSR imports passed without DOM; JSX bundles and strict TSX consumers passed. CSS export resolution was observed failing before adding the export/build output. Actual visual browser QA remains pending.
Task 12: implemented as release candidate, verification partial — 33/33 unit/integration tests and semantic axe compositions passed; typecheck/build passed. Browser E2E and provider suites attempted again, both blocked at Chromium socket creation; remaining browser cases not run. NVDA/VoiceOver/TalkBack and real visual/reproduction checks are explicitly pending.
Integration fixes: speed-command failures and thrown adapter failures are visible in shared snapshot error state; onError no longer repeats at every clock tick (tests RED→GREEN).
Ruling: describedTracks is an optional property so the described version can carry captions for its own narration — otherwise the original captions would omit the added speech.

Final review: independent read-only review of b603870; no critical findings, eight important findings confirmed. Fix pass includes: editable shortcuts, visible standalone viewer fallback, finite metadata normalization, delayed described-source restoration, fullscreen menu portals, sticky fatal YouTube error, buffering pause state, and cross-platform npm CLI invocation.
Final: minor (deferred): text-track attachment is not atomic for a later invalid URL.
Final: minor (deferred): synthetic provider track/quality labels do not all use the label dictionary.
Final: minor (deferred): missing-alt warning also runs in production.

Final: fixed editable shortcut capture — contenteditable descendants regression RED→GREEN.
Final: fixed hidden standalone viewer focus — removed opener regression RED→GREEN.
Final: fixed invalid iframe/control metadata — YouTube/Vimeo/custom adapter regressions RED→GREEN.
Final: fixed delayed description restore and rejected seek — regressions RED→GREEN.
Final: fixed fullscreen portal ownership — menu containment regression RED→GREEN; real fullscreen pending.
Final: fixed YouTube fatal error persistence — polling regression RED→GREEN.
Final: fixed buffering pause — active buffering control regression RED→GREEN.
Final: fixed Windows npm launcher — Node + npm_execpath; distribution/consumer commands tested on available host, Windows execution pending.
Final integration: retry focus and provider speed filtering regressions RED→GREEN.
Final suite: 47 tests, 0 failures; typecheck passed. Known minor items remain documented.

Final: Ruling: preserve the standalone feature branch and deliver a ZIP — no base branch or remote exists, so merge/push is outside this implementation delivery. Cost if changed later: initialize the destination repository or import sources.
Distribution: packaged consumers passed on React 18.2.0 and 19.3.1 after the fix pass. Full package/catalog builds passed. Browser/manual verification remains pending as documented.
