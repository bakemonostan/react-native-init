# SVG icons setup (Expo + typed registry)

This project loads SVGs as **React components** via Metro (**SVGR**), then exposes a typed **`SvgIcon`** helper whose `name` prop matches filenames under `assets/icons/my-icons/` (without `.svg`).

There is **no** icon-font pipeline for custom SVGs (no `.ttf` / glyphmap generation). Vector fonts from **`@expo/vector-icons`** remain available via **`IconComponent`**.

---

## What’s included

| Piece | Role |
|--------|------|
| `react-native-svg` | Renders SVG on iOS, Android, and web |
| `react-native-svg-transformer` (devDependency) | Turns `import x from 'file.svg'` into a React component |
| `metro.config.js` | Uses Expo transformer, removes `svg` from `assetExts`, adds to `sourceExts` |
| `svg.d.ts` | TypeScript declaration for `*.svg` imports |
| `tsconfig.json` | Includes `svg.d.ts` |
| `scripts/generate-svg-registry.mjs` | Scans the SVG folder and writes `icons/svgRegistry.tsx` |
| `npm run icons:gen` | Runs that script |
| `icons/svgRegistry.tsx` | **Generated** — registry map, `SvgIconName` union, `SvgIcon` wrapper |
| `icons/index.ts` | Barrel: `SvgIcon`, `svgIcons`, `SvgIconName`, `SvgIconProps` |

---

## Daily workflow

1. Add or rename `.svg` files in **`assets/icons/my-icons/`**.
2. Regenerate the registry — **automatic on `npm install`** (`postinstall`), or run manually:

   ```bash
   npm run icons:gen
   ```

3. Use icons (filename without extension = `name`):

   ```tsx
   import { SvgIcon } from "@/icons";

   <SvgIcon name="Placeholder" size={24} color="white" />
   ```

4. If Metro was already running and things look stale after changing **`metro.config.js`** or SVG imports, clear cache:

   ```bash
   npx expo start -c
   ```

---

## Tinting (`color` prop)

React Native SVG does **not** override hardcoded `#hex` fills/strokes when you only pass `color`.

- To follow **`color={...}`**, use **`currentColor`** in the SVG for the strokes/fills you want to tint (e.g. `stroke="currentColor"`).
- **Multicolor** artwork keeps fixed colors until you edit the SVG.

`SvgIcon` passes **`color`** to the generated SVG component so **`currentColor`** resolves correctly.

---

## Troubleshooting

| Symptom | Likely cause |
|--------|----------------|
| Render error: element type is **`number`** | SVG still treated as an **asset** — fix **`metro.config.js`**, restart with **`-c`** |
| New SVG not in autocomplete / types | Run **`npm run icons:gen`** |
| **`color`** doesn’t change appearance | Paths still use fixed `#hex` — switch those parts to **`currentColor`** |

---

## Reference links

- [react-native-svg (Expo)](https://docs.expo.dev/versions/latest/sdk/svg/)
- [react-native-svg-transformer](https://github.com/kristerkari/react-native-svg-transformer)
