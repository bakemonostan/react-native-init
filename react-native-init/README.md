# RN Init (Web Wizard)

`react-native-init` is a Next.js wizard that helps configure and generate projects based on `my-react-native-expo-template`.

## What It Does

- Guides users through app setup choices (theme, state, API, auth, extras).
- Generates a copy-ready `.env` snippet aligned with the Expo template.
- Can return a downloadable template ZIP from `POST /api/generate`.

## Scripts

```bash
npm install
npm run dev     # Next dev server
npm run build   # Production build
npm run start   # Run built app
npm run lint    # ESLint
npx tsc --noEmit
```

Wizard route:

- [http://localhost:3000/create](http://localhost:3000/create)

## Template Source Configuration

To enable ZIP generation, configure one source:

- `EXPO_TEMPLATE_PATH` for a local folder containing the Expo template.
- Or `EXPO_TEMPLATE_ARCHIVE_URL` for a remote zip/GitHub repo URL.

Optional archive helpers:

- `EXPO_TEMPLATE_GIT_REF` (default: `main`) when `EXPO_TEMPLATE_ARCHIVE_URL` is a GitHub repo URL.
- `EXPO_TEMPLATE_SUBPATH` when the Expo template lives in a subfolder of a monorepo archive (example: `my-react-native-expo-template`).

### Example (monorepo on GitHub)

```bash
EXPO_TEMPLATE_ARCHIVE_URL=https://github.com/bakemonostan/react-native-init
EXPO_TEMPLATE_GIT_REF=main
EXPO_TEMPLATE_SUBPATH=my-react-native-expo-template
```

## Related Docs

- Wizard flow and behavior: `docs/WIZARD_FLOW.md`
- Wizard/template contract: `../my-react-native-expo-template/docs/WIZARD_AND_TEMPLATE.md`
