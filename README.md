# RN Init Monorepo

This repository contains the full RN Init system:

- `react-native-init`: Next.js web wizard for configuring a starter app and generating `.env` + ZIP output.
- `my-react-native-expo-template`: Expo React Native starter app used as the generation template.

## Repository Structure

```text
rn-init/
├── react-native-init/               # Web wizard (Next.js)
└── my-react-native-expo-template/   # Mobile template (Expo)
```

## How It Works

1. User configures options in the web wizard (`/create`).
2. Wizard builds a matching `.env` snippet.
3. `POST /api/generate` packages the Expo template and injects:
   - generated `.env`
   - `RN_INIT_README.txt`

## Local Development

Run each app separately in its own terminal.

### 1) Web wizard

```bash
cd react-native-init
npm install
npm run dev
```

Wizard URL: `http://localhost:3000/create`

### 2) Expo template

```bash
cd my-react-native-expo-template
npm install
cp .env.example .env
npm start
```

## ZIP Template Source Configuration (Wizard)

The wizard backend needs a template source for ZIP generation.

Use one of:

- Local path: `EXPO_TEMPLATE_PATH`
- Remote archive/repo: `EXPO_TEMPLATE_ARCHIVE_URL`

Optional helpers:

- `EXPO_TEMPLATE_GIT_REF` for GitHub branch (default: `main`)
- `EXPO_TEMPLATE_SUBPATH` when template is inside a monorepo archive

### Current monorepo setup example

```bash
EXPO_TEMPLATE_ARCHIVE_URL=https://github.com/bakemonostan/react-native-init
EXPO_TEMPLATE_GIT_REF=main
EXPO_TEMPLATE_SUBPATH=my-react-native-expo-template
```

## Checks

Web wizard:

```bash
cd react-native-init
npm run lint
npx tsc --noEmit
```

Expo template:

```bash
cd my-react-native-expo-template
npm run lint
npx tsc --noEmit
```

## Documentation

- Wizard flow: `react-native-init/docs/WIZARD_FLOW.md`
- Wizard/template contract: `my-react-native-expo-template/docs/WIZARD_AND_TEMPLATE.md`
- Template auth/nav notes: `my-react-native-expo-template/docs/AUTH_AND_NAVIGATION.md`
