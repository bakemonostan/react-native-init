import { useAuthStore } from "@/store/authStore";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

/**
 * Entry gate: send signed-in users to tabs, others to auth.
 * See `docs/AUTH_AND_NAVIGATION.md` and Expo’s authentication guide.
 */
export default function Index() {
  const { colors } = useTheme();
  const hydrated = useAuthStore((s) => s.hydrated);
  const isLoggedIn = useAuthStore((s) => s.user !== null);

  if (!hydrated) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isLoggedIn) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
