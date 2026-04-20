import { ChipComponent } from "@/components/ui";
import type { SemanticTone } from "@/constants/Colors";
import { Screen } from "@/components/ui/Screen";
import TextComponent from "@/components/ui/TextComponent";
import { useTheme } from "@/hooks/useTheme";
import React, { useState } from "react";
import { View } from "react-native";

const TONES: SemanticTone[] = [
  "primary",
  "secondary",
  "muted",
  "accent",
  "destructive",
];

export default function ChipExample() {
  const { colors } = useTheme();
  const [selected, setSelected] = useState<string | null>("soft");
  const [tags, setTags] = useState(["React", "Expo", "TypeScript"]);

  return (
    <Screen safeAreaEdges={["bottom"]}>
      <View style={{ gap: 24 }}>
        <TextComponent size="lg" weight="bold">
          Chips
        </TextComponent>

        <View style={{ gap: 8 }}>
          <TextComponent size="sm" color={colors.textSecondary}>
            Shape variants (tone = primary)
          </TextComponent>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {(["soft", "outlined", "filled"] as const).map((v) => (
              <ChipComponent
                key={v}
                label={v}
                variant={v}
                tone="primary"
                selected={selected === v}
                onPress={() => setSelected(v)}
              />
            ))}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <TextComponent size="sm" color={colors.textSecondary}>
            Tones (filled)
          </TextComponent>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {TONES.map((tone) => (
              <ChipComponent
                key={tone}
                label={tone}
                variant="filled"
                tone={tone}
                onPress={() => {}}
              />
            ))}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <TextComponent size="sm" color={colors.textSecondary}>
            With icon
          </TextComponent>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <ChipComponent
              label="Notifications"
              icon={{ name: "notifications-outline", library: "Ionicons" }}
              selected
            />
            <ChipComponent
              label="Starred"
              variant="outlined"
              tone="accent"
              icon={{ name: "star", library: "Ionicons" }}
            />
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <TextComponent size="sm" color={colors.textSecondary}>
            Dismissible
          </TextComponent>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {tags.map((t) => (
              <ChipComponent
                key={t}
                label={t}
                tone="secondary"
                dismissible
                onDismiss={() =>
                  setTags((prev) => prev.filter((x) => x !== t))
                }
              />
            ))}
          </View>
        </View>
      </View>
    </Screen>
  );
}
