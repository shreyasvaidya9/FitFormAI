# CLAUDE.md — FitFormAI Project Conventions

This file is the source of truth for AI-assisted development on FitFormAI. Read it before generating code in this repo.

## Project structure (single repo, no monorepo)
fitformai/
├── app/                    # Expo Router screens
├── components/             # UI components (NativeWind)
│   └── ui/                 # Design system primitives
├── hooks/                  # Custom React hooks
├── lib/                    # Pure TypeScript logic (Vitest-tested)
├── convex/                 # Convex backend (lives in same repo)
│   ├── schema.ts
│   ├── _generated/         # auto-generated, gitignored
│   └── ...
├── assets/models/          # MoveNet TFLite models
├── e2e/                    # Maestro flows
├── design/                 # Design tokens and identity docs
├── scripts/                # Deploy advisor, smoke tests
├── package.json            # ONE package.json for the whole repo
├── tailwind.config.js
└── app.json

**Do not create a monorepo structure (no `apps/`, no `packages/`, no per-folder `package.json`).** Convex is designed to live alongside the app code in `/convex`. If a future need for a monorepo arises, it will be planned explicitly — do not preemptively introduce one.

---

## VisionCamera v5 conventions (non-negotiable)

- Use `useFrameOutput` from `react-native-vision-camera-worklets`. **Never use `useFrameProcessor`** — that is the legacy v4 API.
- Camera prop is `outputs={[frameOutput]}`, not `frameProcessor={...}`.
- **Every `onFrame` worklet body must call `frame.dispose()` on every code path before returning.** Forgetting this leaks native frame buffers and crashes the app within ~60 seconds. This includes early-return paths (e.g., when model state is not `'loaded'`).
- Worklet bodies must be thin. Any logic longer than ~5 lines goes in `lib/` as a pure function so it can be unit-tested. Worklets call into `lib/`; they don't contain logic.
- For cross-thread communication, use Reanimated v4's `runOnJS` and `useSharedValue`. Do **not** use the legacy `Worklets.createRunOnJS` API.

## react-native-fast-tflite v3 (Nitro) conventions

- Use `useTensorflowModel(require('@/assets/models/movenet_thunder.tflite'))` to load the model.
- The hook returns `{ state, model }`. Always check `state === 'loaded'` before calling `model.runSync([frame])`.
- MoveNet output shape is `[1, 1, 17, 3]`, ordered `[y, x, confidence]` per keypoint. Decode in a pure function in `lib/poseDecoder.ts`.

## Reanimated v4 + worklets v0.8.1

- `babel-preset-expo` already registers the worklets plugin. Do not add a manual entry to `babel.config.js`.
- All worklet functions must include the `'worklet';` directive on the first line.
- `useDerivedValue` is preferred for transforming shared values that drive UI; avoid recomputing on the JS thread.

---

## Styling: NativeWind only

- All component styling uses NativeWind (`className="..."` props with Tailwind utilities).
- Inline `style={{...}}` is reserved for: dynamic values that can't be expressed as Tailwind classes, animated values from Reanimated, and Skia-specific props.
- Custom design tokens live in `tailwind.config.js` under `theme.extend`. Mirror them in `lib/design/tokens.ts` for non-Tailwind consumers (Skia, native modals).
- No CSS-in-JS libraries. No StyleSheet.create unless animating with Reanimated.

---

## Convex backend conventions

- Schema lives in `convex/schema.ts`. Backend functions in `convex/<domain>.ts` (e.g., `convex/sessions.ts`, `convex/users.ts`).
- **Schema changes are additive only.** New fields must be optional (`v.optional(...)`). Never:
  - Delete a field used by any shipped app version
  - Rename a field (add a new field, dual-write, deprecate the old after old app usage drops below ~1%)
  - Change a field's type
  - Add a required field to an existing table
- **Functions are versioned, not mutated.** When changing behaviour, create `getThingV2` alongside `getThing`. Deprecate `getThing` after old app usage drops below ~1%, then delete.
- Every Convex mutation that writes user data must verify auth via `ctx.auth.getUserIdentity()` and reject if null.
- Free-tier limits (squat + pushup only, 7-day history, 20 reps/session) are enforced server-side, not client-side. The client also surfaces them for UX, but the server is the source of truth.

---

## Testing conventions

- **Vitest** for `lib/` — pure TypeScript, no React, no native dependencies. Coverage threshold: 80%.
- **Jest + @testing-library/react-native** for `components/` and `hooks/`. Coverage threshold: 60%.
- **`npx convex test`** for every Convex query and mutation. Cover auth scenarios and free-tier enforcement.
- **Maestro** for E2E flows in `e2e/`. Run on CI for every PR.
- **Worklet logic is not unit-tested directly.** Keep worklets thin and test the pure functions they call. This is enforced by the "worklet bodies > 5 lines" rule above.
- All CI gates must pass before a deploy: typecheck, lint, Vitest, Jest, Convex tests, Maestro flows.

## Performance budgets

- Time to first camera frame: < 1 second
- Model load time: < 3 seconds
- Sustained pose-detection FPS: ≥ 20 on a physical device
- Memory growth over a 60-second session: < 10 MB

These are asserted in CI tests. Regressions block merges.

---

## Deployment conventions

- Three environments: `dev`, `preview`, `production`. Configured per-profile in `eas.json` with separate Convex URLs and Clerk keys.
- Native builds: `eas build`. Mobile submissions: `eas submit`. JS-only updates: `eas update`.
- Convex deploys: `npx convex dev` for dev (auto), `npx convex deploy --prod` for production (manual).
- Before any production deploy, run `npm run deploy:advise` (the deploy advisor script). It classifies the change and recommends update path.
- Force-update gating uses the `appConfig` table in Convex + the `VersionGate` component wrapping the root layout. Per-platform rows: `ios`, `android`, `ios-beta`, `android-beta`. The gate fails open after a 5-second network timeout.
- Never set `minRequiredVersion` to a version that is not yet downloadable in the relevant store. The advisor enforces this with an interactive verification prompt.

---

## Business model context (informs feature gating)

- **Free tier:** squat + pushup only, 7-day history, 20 reps/session
- **Pro tier (~₹299/mo):** full exercise library (squat, deadlift, push-up, OHP, lunge), unlimited history, advanced analytics
- Monetisation: RevenueCat for mobile IAP. Stripe + Stripe Tax only if a web payment flow is added (none planned for MVP).
- All paywall logic checks Convex `users.plan` field, populated via RevenueCat webhooks. Client never trusts client-side plan state.

---

## When in doubt

- Prefer pure functions in `lib/` over inline logic.
- Prefer additive Convex changes over breaking ones.
- Prefer EAS Update over EAS Build when both are options.
- Prefer Maestro E2E coverage over manual testing for critical flows.
- Ask before adding a new dependency. The locked stack above is intentional.
