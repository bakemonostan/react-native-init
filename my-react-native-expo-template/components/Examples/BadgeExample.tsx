import BadgeComponent from "@/components/ui/BadgeComponent";
import type { SemanticTone } from "@/constants/Colors";
import { Screen } from "@/components/ui/Screen";
import TextComponent from "@/components/ui/TextComponent";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { View } from "react-native";

const TONES: SemanticTone[] = [
  "primary",
  "secondary",
  "muted",
  "accent",
  "destructive",
];

export default function BadgeExample() {
  const { colors } = useTheme();
  return (
    <Screen safeAreaEdges={["bottom"]}>
      <View style={{ gap: 20 }}>
        <TextComponent size="lg" weight="bold">
          Badges (tone = wizard semantic)
        </TextComponent>

        <View style={{ gap: 8 }}>
          <TextComponent size="sm" color={colors.textSecondary}>
            Tones
          </TextComponent>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {TONES.map((tone) => (
              <BadgeComponent
                key={tone}
                tone={tone}
                content={tone.slice(0, 3)}
              />
            ))}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <TextComponent size="sm" color={colors.textSecondary}>
            Custom background (overrides tone)
          </TextComponent>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            <BadgeComponent content="Sale" backgroundColor={colors.success} />
            <BadgeComponent content="New" dot size="small" />
          </View>
        </View>
      </View>
    </Screen>
  );
}
