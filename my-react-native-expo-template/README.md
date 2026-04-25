# My React Native Expo Template

Production-focused Expo + React Native starter with app architecture already wired.

## Quick Start

```bash
npm install
cp .env.example .env
npm start
```

## Core Stack

- Expo Router (tabs + drawer + stack)
- Zustand state
- TanStack React Query
- Axios/fetch runtime modes
- Token-based theming (light/dark/auto)
- Reusable UI components + examples

## Scripts

```bash
# Dev
npm start                         # Expo dev server
npm run start:staging             # APP_ENV=staging
npm run start:prod                # NODE_ENV=production

# iOS
npm run ios                       # iOS simulator
npm run ios:staging               # iOS (staging env)
npm run ios:prod-env              # iOS (production env vars)

# Android
npm run android                   # Android (debug)
npm run android:debug             # Explicit debug build
npm run android:release           # Release build
npm run android:release:device    # Release on physical device
npm run android:build             # Build/run on connected device
npm run android:staging           # Staging (debug)
npm run android:staging:debug     # Staging (explicit debug)
npm run android:staging:release   # Staging (release)

# Web
npm run web                       # Expo web target

# Code quality
npm run lint                      # Expo ESLint

# Versioning
npm run bump-version              # Bump version in package.json, iOS, Android

# Theming
npm run theme-mode light          # Force light mode
npm run theme-mode dark           # Force dark mode
npm run theme-mode auto           # Follow system (default)
```

## iOS First Run (Important)

This app uses custom native code (`expo run:*`, not Expo Go).

1. Install simulator runtimes in Xcode.
2. Use a simulator that exists on your machine:

```bash
xcrun simctl list devices available
npx expo run:ios --simulator "iPhone 16"
```

3. If destination errors persist, delete local `.expo` cache in the project and retry with explicit `--simulator`.
4. If `ios/` exists and CocoaPods is needed:

```bash
cd ios && pod install && cd ..
```

## Environment

Copy `.env.example` to `.env` and set values such as:

- `EXPO_PUBLIC_API_BASE_URL`
- `EXPO_PUBLIC_API_BASE_URL_STAGING`
- `EXPO_PUBLIC_AUTH_MODE` (`mock` or `api`)
- `EXPO_PUBLIC_STATE_MODE`
- `EXPO_PUBLIC_HTTP_CLIENT`
- `EXPO_PUBLIC_PUSH_SETUP`

`EXPO_PUBLIC_*` keys are bundled into the client.

## Project Layout (High Level)

```text
app/          Expo Router screens
components/   UI, examples, sheets, feature components
api/          HTTP clients and API helpers
config/       Runtime feature flags
context/      Theme and i18n providers
hooks/        Reusable hooks
services/     Auth/session/push services
store/        Zustand stores
theme/        Design tokens
utils/        Shared helpers
docs/         Project-specific docs
```

## Related Docs

- Wizard/template contract: `docs/WIZARD_AND_TEMPLATE.md`
- Auth and navigation details: `docs/AUTH_AND_NAVIGATION.md`
- Deferred tasks: `docs/TEMPLATE_GAPS.md`

## License

MIT
