#!/usr/bin/env node
/**
 * Removes demo-only UI: Components gallery, tab routes, example screens,
 * `components/BottomSheetScreens` (demo modal route shell).
 * Keeps `components/BottomSheetComponents` (reusable BottomSheetModal wrappers).
 * Removes `app/Modal.tsx` and unregisters the Modal stack screen in `app/_layout.tsx`.
 * Leaves root Stack layout + authenticated `app/(app)/home.tsx` (title from APP_DISPLAY_NAME via app.config).
 *
 * Usage (from template root): npm run strip-demo
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const HOME_SCREEN = `import TextComponent from "@/components/ui/TextComponent";
import { Screen } from "@/components/ui/Screen";
import Constants from "expo-constants";
import { useTheme } from "@/hooks/useTheme";
import { View } from "react-native";

/**
 * Minimal post-strip home: title comes from expo config name (APP_DISPLAY_NAME / wizard).
 */
export default function HomeScreen() {
  const { colors } = useTheme();
  const appName =
    (Constants.expoConfig?.name as string | undefined) ?? "App";

  return (
    <Screen safeAreaEdges={["top"]}>
      <View style={{ gap: 12, padding: 16 }}>
        <TextComponent variant="h6" color={colors.text}>
          {appName}
        </TextComponent>
        <TextComponent size="sm" color={colors.textSecondary}>
          Starter screen — add routes under app/. Auth screens stay under app/(auth)/.
        </TextComponent>
      </View>
    </Screen>
  );
}
`;

const DIRS_TO_REMOVE = [
  "components/Examples",
  "components/BottomSheetScreens",
  "app/(app)/(tabs)",
  "app/(tabs)",
];

/** Demo route that imported BottomSheetScreens — removed with that folder. */
const FILES_TO_REMOVE = ["app/Modal.tsx"];

const MODAL_STACK_SCREEN_SNIPPET = `
            <Stack.Screen
              name="Modal"
              options={{
                title: "Modal",
                ...Platform.select({
                  ios: {
                    presentation: "formSheet" as const,
                    sheetCornerRadius: 20,
                    sheetElevation: 34,
                    sheetExpandsWhenScrolledToEdge: true,
                    sheetGrabberVisible: true,
                    sheetAllowedDetents: [0.5] as [number],
                    gestureEnabled: false,
                  },
                  default: {
                    presentation: "modal" as const,
                  },
                }),
              }}
            />`;

const FILES_PATCH_REDIRECT = [
  "app/index.tsx",
  "app/(auth)/login.tsx",
  "app/(auth)/register.tsx",
  "app/(auth)/verify-otp.tsx",
];

async function rmSilent(rel) {
  const p = path.join(root, rel);
  try {
    await fs.rm(p, { recursive: true, force: true });
    console.log("removed:", rel);
  } catch (e) {
    console.warn("skip:", rel, e.message);
  }
}

async function patchRootLayoutRemoveModalRoute() {
  const rel = "app/_layout.tsx";
  const p = path.join(root, rel);
  let txt = await fs.readFile(p, "utf8");
  if (!txt.includes('name="Modal"')) {
    console.log("layout: Modal stack screen already removed");
    return;
  }
  if (!txt.includes(MODAL_STACK_SCREEN_SNIPPET)) {
    console.warn(
      "layout: Modal <Stack.Screen> block changed — edit app/_layout.tsx manually to remove the Modal route",
    );
    return;
  }
  txt = txt.replace(MODAL_STACK_SCREEN_SNIPPET, "");
  await fs.writeFile(p, txt, "utf8");
  console.log("patched:", rel, "(removed Modal stack screen)");
}

async function main() {
  for (const d of DIRS_TO_REMOVE) await rmSilent(d);
  for (const f of FILES_TO_REMOVE) await rmSilent(f);
  await patchRootLayoutRemoveModalRoute();

  const homePath = path.join(root, "app/(app)/home.tsx");
  await fs.writeFile(homePath, HOME_SCREEN, "utf8");
  console.log("wrote:", path.relative(root, homePath));

  const fromTabs = "/(app)/(tabs)";
  const toHome = "/(app)/home";

  for (const rel of FILES_PATCH_REDIRECT) {
    const p = path.join(root, rel);
    let txt = await fs.readFile(p, "utf8");
    if (!txt.includes(fromTabs)) {
      console.log("no tabs redirect in:", rel, "(already stripped?)");
      continue;
    }
    txt = txt.split(fromTabs).join(toHome);
    await fs.writeFile(p, txt, "utf8");
    console.log("patched redirects:", rel);
  }

  console.log("");
  console.log("Done. Next: npx tsc --noEmit && npm run lint && npx expo start");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
