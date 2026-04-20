# How the wizard maps to the Expo template

This web app (**RN Init**) is a **configuration UI** for the mobile repo **`my-react-native-expo-template`** (Expo + native dev client). It does **not** install Xcode or run `pod install` for you.

## What happens today (v1)

1. You walk through steps that mirror **what the template already contains**, not a fantasy fork tree.
2. On **Generate**, you get:
   - **Copy .env** — a snippet with the same variable names the Expo app reads (`app.config.ts`, `docs/AUTH_AND_NAVIGATION.md`, `.env.example`).
   - **ZIP (optional)** — calls `POST /api/generate` when that route exists. Until the backend is implemented, the UI tells you and the env copy still works.

## Opt-in / opt-out (honest model)

| Wizard area | Meaning |
|-------------|---------|
| **Basics** | Zod validation before **Next**; inline errors; **live `.env` preview** (Basics + `WIZARD_NAV` line). Drives `APP_DISPLAY_NAME`, `EXPO_PUBLIC_SLUG`, `EXPO_PUBLIC_SCHEME`, `IOS_BUNDLE_ID`, `ANDROID_PACKAGE` in the final snippet. |
| **Navigation** | Cards explain what **actually exists** in the Expo repo (tabs shell, `(auth)` stack, nested drawer demos). Choice writes `# WIZARD_NAV=…` in the snippet for your fork notes. Same live preview as Basics. |
| **Styling** | Dark mode cards → `THEME_MODE`; primary hex → `# WIZARD_PRIMARY_COLOR` comment. Same card UI as other steps. |
| **State** | **Zustand** vs **None** → `EXPO_PUBLIC_STATE_MODE` (read in template `runtimeModes.stateMode`). |
| **API** | **Axios**, **Axios + RQ**, **Fetch**, **None** → `EXPO_PUBLIC_HTTP_CLIENT` (`runtimeModes.httpClient`; `api/fetchClient.ts` for fetch). |
| **Backend & auth** | **Backend:** `none` \| `supabase` \| `custom` → `EXPO_PUBLIC_BACKEND_PROVIDER`. **Custom** prefills `EXPO_PUBLIC_API_BASE_URL`. **Supabase** adds empty `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` in the snippet (install `@supabase/supabase-js` in the Expo app). **Auth:** `mock` vs `api` ↔ `EXPO_PUBLIC_AUTH_MODE` (see template `services/authBackend.ts`). |
| **Extras → Push** | Toggles **`EXPO_PUBLIC_PUSH_SETUP`** (`1` / `0`) to match the template’s opt-in push hook. |
| **Extras → “In clone” rows** | Documents what exists in the template repo — **not** per-feature toggles. Opt out **after clone** (remove imports/deps). A real stripper / ZIP generator could add toggles later. |
| **Biometrics** | **Not in the template** — shown as unavailable (see template `docs/TEMPLATE_GAPS.md`). |

## What you should do after copying `.env`

1. Place the file at the **root of the Expo repo** as `.env`.
2. Run `npx expo prebuild` when native config changed (plugins, bundle id, etc.).
3. Follow the template README for **first iOS run** (simulator, CocoaPods).

## Repo relationship

- **Wizard (this repo):** Next.js — `npm run dev`, open `/create`.
- **Template:** Expo app — clone separately; wizard only emits config text until ZIP API ships.
