import type JSZip from "jszip";

const REMOVED_PATHS = [
  "context/I18nContext.tsx",
  "i18n/index.ts",
  "i18n/locales/en.ts",
  "i18n/locales/es.ts",
];

const LAYOUT_STRIPPED = `import { AuthPersistBridge } from "@/components/AuthPersistBridge";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import ToastComponent from "@/components/ui/ToastComponent";
import { featureFlags } from "@/config/featureFlags";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { usePushNotificationsSetup } from "@/hooks/usePushNotificationsSetup";
import { customFontsToLoad } from "@/theme/typography";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as Network from "expo-network";
import { SplashScreen, Stack } from "expo-router";
import { ReactNode, useEffect, useMemo, useRef } from "react";
import {
  AppState,
  AppStateStatus,
  Platform,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      networkMode: "offlineFirst",
      retryOnMount: true,
    },
    mutations: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      networkMode: "offlineFirst",
    },
  },
});

// Set up network state listener
onlineManager.setEventListener((setOnline) => {
  const eventSubscription = Network.addNetworkStateListener((state) => {
    setOnline(!!state.isConnected);
  });
  return eventSubscription.remove;
});

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

/**
 * Syncs React Navigation (tabs, stack, headers) with app light/dark colors.
 * Without this, navigators keep the default light gray/white chrome.
 */
function PushSetup() {
  usePushNotificationsSetup();
  return null;
}

function ThemedNavigationShell({ children }: { children: ReactNode }) {
  const { colors, isDark } = useTheme();
  const navigationTheme = useMemo(
    () => ({
      ...(isDark ? DarkTheme : DefaultTheme),
      dark: isDark,
      colors: {
        ...(isDark ? DarkTheme : DefaultTheme).colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
        notification: colors.error,
      },
    }),
    [colors, isDark],
  );

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: colors.background }}>
      <NavigationThemeProvider value={navigationTheme}>
        {children}
      </NavigationThemeProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(customFontsToLoad);
  const splashHidden = useRef(false);

  const hideSplashScreen = async () => {
    if (!splashHidden.current) {
      splashHidden.current = true;
      await SplashScreen.hideAsync();
    }
  };

  // Hide splash screen when fonts are ready or on error
  useEffect(() => {
    if (fontsLoaded || fontError) {
      hideSplashScreen();
    }
  }, [fontsLoaded, fontError]);

  // Safety timeout - hide splash after 3 seconds regardless
  useEffect(() => {
    const timeout = setTimeout(() => {
      hideSplashScreen();
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  // Set up app state listener for React Query focus management
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

  // Don't render anything until fonts are loaded or timeout
  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <ErrorBoundary catchErrors="always">
    <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <ThemedNavigationShell>
        <BottomSheetModalProvider>
          <PushSetup />
          <AuthPersistBridge />
          <Stack>
            <Stack.Screen
              name="index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(auth)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(app)"
              options={{ headerShown: false }}
            />
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
            />
          </Stack>
        </BottomSheetModalProvider>
      </ThemedNavigationShell>
      {featureFlags.enableToast ? <ToastComponent /> : null}
    </QueryClientProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}
`;

function patchPackageJsonRemoveLocalization(src: string): string {
  return src.replace(
    /^\s*"expo-localization":\s*"[^"]+",\n/m,
    "",
  );
}

function patchAppConfigRemoveI18n(src: string): string {
  return src
    .replace(/\s*'expo-localization',\n/, "\n")
    .replace(
      /\n\s*enableI18n:\s*truthyEnv\(process\.env\.EXPO_PUBLIC_ENABLE_I18N,\s*true\)\s*\n\s*\?\s*"true"\s*\n\s*:\s*"false",\n/,
      "\n",
    );
}

function patchFeatureFlagsRemoveI18n(src: string): string {
  return src
    .replace(/\s*enableI18n\?: string;\n/, "")
    .replace(
      /\n\s*get enableI18n\(\): boolean \{\n\s*return extraBool\("enableI18n", true\);\n\s*\},\n/,
      "\n",
    );
}

/** Screen sources with English copy (former \`en\` catalog). */
const STRIPPED_SCREENS: Record<string, string> = {
  "app/(auth)/login.tsx": `import { AuthHeader } from "@/components/auth/AuthHeader";
import { FormField, PressableComponent } from "@/components/ui";
import { Screen } from "@/components/ui/Screen";
import TextComponent from "@/components/ui/TextComponent";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/authStore";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function LoginScreen() {
  const { colors } = useTheme();
  const { error: showError } = useToast();
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const isLoggedIn = useAuthStore((s) => s.user !== null);
  const signIn = useAuthStore((s) => s.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (hydrated && isLoggedIn) {
      router.replace("/(app)/(tabs)");
    }
  }, [hydrated, isLoggedIn, router]);

  const onSubmit = async () => {
    if (!email.trim() || !password || submitting) return;
    setSubmitting(true);
    try {
      const res = await signIn(email.trim(), password);
      if (!res.ok) {
        showError("Sign in failed", res.message);
        return;
      }
      router.replace("/(app)/(tabs)");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen
      header={<AuthHeader title="Sign in" showBack={false} />}
      safeAreaEdges={["top", "bottom"]}
      withDefaultPadding
    >
      <View style={styles.container}>
        <TextComponent size="sm" color={colors.textSecondary} style={{ lineHeight: 20 }}>
          Development mode: any non-empty password works when auth is in mock mode. Set EXPO_PUBLIC_AUTH_MODE=api and implement routes in services/authBackend.ts for a real API.
        </TextComponent>
        <FormField
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <FormField
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <PressableComponent
          buttonText="Sign in"
          onPress={onSubmit}
          loading={submitting}
          disabled={submitting}
        />
        <Link href="/(auth)/forgot-password" asChild>
          <Pressable>
            <TextComponent size="sm" color={colors.primary}>
              Forgot password?
            </TextComponent>
          </Pressable>
        </Link>
        <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
          <TextComponent size="sm" color={colors.textSecondary}>
            No account?
          </TextComponent>
          <Link href="/(auth)/register">
            <TextComponent size="sm" color={colors.primary}>
              Register
            </TextComponent>
          </Link>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingTop: 24,
  },
});
`,
  "app/(auth)/register.tsx": `import { AuthHeader } from "@/components/auth/AuthHeader";
import { FormField, PressableComponent } from "@/components/ui";
import { Screen } from "@/components/ui/Screen";
import TextComponent from "@/components/ui/TextComponent";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/authStore";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function RegisterScreen() {
  const { colors } = useTheme();
  const { error: showError } = useToast();
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!email.trim() || !password || submitting) return;
    setSubmitting(true);
    try {
      const res = await register(email.trim(), password, name.trim());
      if (!res.ok) {
        showError("Registration failed", res.message);
        return;
      }
      router.replace("/(app)/(tabs)");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen
      header={<AuthHeader title="Create account" />}
      safeAreaEdges={["top", "bottom"]}
      withDefaultPadding
    >
      <View style={styles.container}>
        <TextComponent size="sm" color={colors.textSecondary} style={{ lineHeight: 20 }}>
          Creates a local session in mock mode. With EXPO_PUBLIC_AUTH_MODE=api, wire /auth/register on your server.
        </TextComponent>
        <FormField
          label="Name"
          placeholder="Your name"
          value={name}
          onChangeText={setName}
        />
        <FormField
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <FormField
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <PressableComponent
          buttonText="Create account"
          onPress={onSubmit}
          loading={submitting}
          disabled={submitting}
        />
        <Link href="/(auth)/login">
          <TextComponent size="sm" color={colors.primary}>
            Already have an account? Sign in
          </TextComponent>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingTop: 24,
  },
});
`,
  "app/(auth)/forgot-password.tsx": `import { AuthHeader } from "@/components/auth/AuthHeader";
import { FormField, PressableComponent } from "@/components/ui";
import { Screen } from "@/components/ui/Screen";
import TextComponent from "@/components/ui/TextComponent";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import { backendRequestPasswordReset } from "@/services/authBackend";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const { info, error: showError } = useToast();
  const router = useRouter();
  const setPendingOtpEmail = useAuthStore((s) => s.setPendingOtpEmail);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await backendRequestPasswordReset(email.trim());
      if (!res.ok) {
        showError("Request failed", res.message);
        return;
      }
      setPendingOtpEmail(email.trim());
      info("Next step", "Open the verify screen and enter your code.");
      router.push("/(auth)/verify-otp");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen
      header={<AuthHeader title="Forgot password" />}
      safeAreaEdges={["top", "bottom"]}
      withDefaultPadding
    >
      <View style={styles.container}>
        <TextComponent size="sm" color={colors.textSecondary} style={{ lineHeight: 20 }}>
          Enter your account email. In mock mode we only simulate OTP; with api mode we call POST /auth/forgot-password.
        </TextComponent>
        <FormField
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <PressableComponent
          buttonText="Continue"
          onPress={onSubmit}
          loading={submitting}
          disabled={submitting}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingTop: 24,
  },
});
`,
  "app/(auth)/verify-otp.tsx": `import { AuthHeader } from "@/components/auth/AuthHeader";
import { FormField, PressableComponent } from "@/components/ui";
import { Screen } from "@/components/ui/Screen";
import TextComponent from "@/components/ui/TextComponent";
import { featureFlags } from "@/config/featureFlags";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function VerifyOtpScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { error: showError } = useToast();
  const pendingOtpEmail = useAuthStore((s) => s.pendingOtpEmail);
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!pendingOtpEmail) {
      router.replace("/(auth)/forgot-password");
    }
  }, [pendingOtpEmail, router]);

  const onSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await verifyOtp(code);
      if (!res.ok) {
        showError("Verification failed", res.message);
        return;
      }
      router.replace("/(app)/(tabs)");
    } finally {
      setSubmitting(false);
    }
  };

  if (!pendingOtpEmail) {
    return null;
  }

  const blurb =
    featureFlags.authMode === "mock"
      ? "Code sent to " +
        pendingOtpEmail +
        ". In mock mode, any 6+ digit code works."
      : "Code sent to " + pendingOtpEmail + ".";

  return (
    <Screen
      header={<AuthHeader title="Verify code" />}
      safeAreaEdges={["top", "bottom"]}
      withDefaultPadding
    >
      <View style={styles.container}>
        <TextComponent size="sm" color={colors.textSecondary} style={{ lineHeight: 20 }}>
          {blurb}
        </TextComponent>
        <FormField
          label="One-time code"
          placeholder="123456"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
        />
        <PressableComponent
          buttonText="Verify and continue"
          onPress={onSubmit}
          loading={submitting}
          disabled={submitting}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingTop: 24,
  },
});
`,
  "app/(app)/(tabs)/index.tsx": `import { PressableComponent, TextInputComponent } from "@/components/ui";
import { Screen } from "@/components/ui/Screen";
import TextComponent from "@/components/ui/TextComponent";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function TabOneScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { success } = useToast();
  const signOut = useAuthStore((s) => s.signOut);
  const updateDisplayName = useAuthStore((s) => s.updateDisplayName);
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  const onSave = () => {
    updateDisplayName(name);
    success("Saved", "Display name updated for this session.");
  };

  const onSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut();
      router.replace("/(auth)/login");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <Screen
      safeAreaEdges={["top"]}
      withDefaultPadding={false}
      footer={
        <View style={{ gap: 8, padding: 16 }}>
          <PressableComponent buttonText="Save" onPress={onSave} />
          <PressableComponent
            variant="secondary"
            buttonText="Sign out"
            onPress={onSignOut}
            loading={signingOut}
            disabled={signingOut}
          />
        </View>
      }
    >
      <View style={{ gap: 16, padding: 16 }}>
        <TextComponent size="xl" weight="bold" color={colors.text}>
          {user?.name ? "Welcome, " + user.name : "Welcome"}
        </TextComponent>
        <TextComponent size="base" color={colors.text}>
          This is your starting screen. Replace this content with your app&apos;s home view.
        </TextComponent>
        <TextComponent size="sm" color={colors.textSecondary}>
          Use the bottom tab bar (Home · Two · Components · Store · Querying) to explore this template.
        </TextComponent>
        <TextInputComponent
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
        <PressableComponent
          variant="secondary"
          buttonText="Open components gallery"
          onPress={() => router.push("./components")}
        />
      </View>
    </Screen>
  );
}
`,
};

/**
 * When wizard disables i18n: remove context/catalogs, inline English copy, drop expo-localization.
 */
export async function stripI18nFromZip(zip: JSZip): Promise<void> {
  for (const p of REMOVED_PATHS) {
    if (zip.file(p)) zip.remove(p);
  }

  zip.file("app/_layout.tsx", LAYOUT_STRIPPED);

  for (const [rel, body] of Object.entries(STRIPPED_SCREENS)) {
    zip.file(rel, body);
  }

  const pkgPath = "package.json";
  const pkgNode = zip.file(pkgPath);
  if (pkgNode) {
    const pkgText = await pkgNode.async("string");
    zip.file(pkgPath, patchPackageJsonRemoveLocalization(pkgText));
  }

  const cfgPath = "app.config.ts";
  const cfgNode = zip.file(cfgPath);
  if (cfgNode) {
    const cfgText = await cfgNode.async("string");
    zip.file(cfgPath, patchAppConfigRemoveI18n(cfgText));
  }

  const ffPath = "config/featureFlags.ts";
  const ffNode = zip.file(ffPath);
  if (ffNode) {
    const ffText = await ffNode.async("string");
    zip.file(ffPath, patchFeatureFlagsRemoveI18n(ffText));
  }
}
