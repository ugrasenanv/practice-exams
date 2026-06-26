# Test Suite Classification (Critical / Diagnostic / Experimental)

This matrix supports test categorization for the Azure AI Certification Practice Exams (AB-730 and AI-900).

| Category | Suite / Pattern | Purpose | Ship Blocking? | Action Now |
|----------|-----------------|---------|----------------|-----------|
| Critical Functional | `src/__tests__/multiSelectQuestions.test.jsx` | Multi-select rendering & scoring | Yes | Stabilize |
| Critical Functional | `src/__tests__/examModeFiltering.test.jsx` | Exam vs practice filtering correctness | Yes | Stabilize |
| Critical Functional | `src/__tests__/timingSystem.test.jsx` | Per-question timers, storage, countdown | Yes | Refactor with fake timers |
| Critical Functional | `src/__tests__/integration.test.jsx` (subset: flow & persistence) | End-to-end app logic (non-Playwright) | Yes | Possibly split / reduce data |
| Critical Analytics | `src/__tests__/timingAnalytics.test.jsx` | Historical timing analytics UI | Yes | Mostly passing |
| Diagnostic UI Perf | `src/components/help/__tests__/Tooltip.test.jsx` | Tooltip stability & perf metrics | No | Tag @diagnostic |
| Diagnostic UI Perf | `src/components/help/__tests__/HelpSystem.test.jsx` | Help/tour flicker detection | No | Tag @diagnostic |
| Diagnostic Race/Perf | `src/components/help/__tests__/RaceConditions.test.jsx` | Race condition stress harness | No | Tag @diagnostic |
| Diagnostic Lifecycle | `src/components/help/__tests__/ComponentLifecycle.test.jsx` | Mount/unmount, render variance | No | Tag @diagnostic |
| Experimental Perf | Any test asserting render times < fixed ms, listener counts | Broad perf heuristic | No | Relax/skip |
| E2E (Playwright) | `tests/e2e/*.spec.*` | User journey validation | Post-unit | Run after unit green |

## Tagging Convention
Add `/* @diagnostic */` comment at top or include `@diagnostic` in `describe` title. Main test command will exclude them via `--grep -@diagnostic` (Vitest supports invert with `--grepInvert` in newer versions; fallback is pattern includes). If version lacks invert, provide a custom script listing explicit include patterns.

## Execution Strategy
1. Default CI: `npm test -- --grep "^(?!.*@diagnostic).*"` (or skip by describe.skip if invert unsupported).
2. Diagnostic CI (nightly): `npm test -- --grep @diagnostic`.
3. Performance / memory assertions removed from main path; replaced by logged metrics or relaxed thresholds.

## Rationale
Maintains high confidence for user-facing correctness while preventing noisy non-deterministic failures from blocking deploy readiness.

---
Generated: (Auto) – update as suites evolve.
