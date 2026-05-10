#!/usr/bin/env node
/**
 * Removes demo-only UI: Components gallery, tab routes, example screens.
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
  "app/(app)/(tabs)",
  "app/(tabs)",
];

const FILES_TO_REMOVE = [
  "components/BottomSheetComponents/HorizontalBottomSheet.tsx",
  "components/BottomSheetComponents/TipsBottomSheetWrapper.tsx",
];

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

async function unlinkSilent(rel) {
  const p = path.join(root, rel);
  try {
    await fs.unlink(p);
    console.log("removed:", rel);
  } catch (e) {
    console.warn("skip:", rel, e.message);
  }
}

async function main() {
  for (const d of DIRS_TO_REMOVE) await rmSilent(d);
  for (const f of FILES_TO_REMOVE) await unlinkSilent(f);

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
