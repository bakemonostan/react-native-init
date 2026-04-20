import PressableComponent, {
  type PressableVariant,
} from "@/components/ui/PressableComponent";
import { Screen } from "@/components/ui/Screen";
import TextComponent from "@/components/ui/TextComponent";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { ScrollView, View } from "react-native";

const WIZARD_VARIANTS: PressableVariant[] = [
  "primary",
  "secondary",
  "muted",
  "accent",
  "destructive",
  "ghost",
  "outline",
];

export default function PressableExample() {
  const { colors } = useTheme();

  return (
    <Screen safeAreaEdges={["bottom"]}>
      <ScrollView contentContainerStyle={{ gap: 20, paddingBottom: 32 }}>
        <TextComponent size="lg" weight="bold">
          Pressable (wizard variants)
        </TextComponent>
        <TextComponent size="sm" color={colors.textSecondary}>
          Same order as semantic colors in RN Init: primary → outline.
        </TextComponent>

        <View style={{ gap: 10 }}>
          {WIZARD_VARIANTS.map((v) => (
            <PressableComponent
              key={v}
              variant={v}
              size="base"
              buttonText={v.charAt(0).toUpperCase() + v.slice(1)}
              onPress={() => {}}
            />
          ))}
        </View>

        <TextComponent size="sm" color={colors.textSecondary}>
          Disabled
        </TextComponent>
        <View style={{ gap: 8 }}>
          <PressableComponent
            variant="destructive"
            buttonText="Destructive (disabled)"
            disabled
            onPress={() => {}}
          />
          <PressableComponent
            variant="outline"
            buttonText="Outline (disabled)"
            disabled
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
