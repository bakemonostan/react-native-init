"use client";

import { ToggleRow } from "../ToggleRow";
import { ScaffoldConfig } from "../../types";

interface Props {
  config: ScaffoldConfig;
  onChange: (patch: Partial<ScaffoldConfig>) => void;
}

export function ExtrasStep({ config, onChange }: Props) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Extras</h2>
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          These switches write <code className="rounded bg-muted px-1 font-mono text-xs">EXPO_PUBLIC_*</code> lines into
          your <strong className="text-foreground">.env</strong> (Copy snippet or Download ZIP). The Expo app still
          contains the same source files — turning a module <strong className="text-foreground">off</strong> means
          runtime behavior is disabled via env, not that folders are deleted from the ZIP. Open{" "}
          <code className="rounded bg-muted px-1 font-mono text-xs">RN_INIT_README.txt</code> inside a generated zip for
          a short recap.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Template modules
        </p>
        <div className="space-y-3">
          <ToggleRow
            label="Toast"
            description="EXPO_PUBLIC_ENABLE_TOAST — root ToastComponent + useToast() no-ops when off."
            checked={config.useToast}
            onToggle={(val) => onChange({ useToast: val })}
          />
          <ToggleRow
            label="Feature flags (env overrides)"
            description="EXPO_PUBLIC_ENABLE_FEATURE_FLAGS — when off, STATE_MODE + HTTP_CLIENT from .env are ignored (zustand + axios+rq)."
            checked={config.useFeatureFlags}
            onToggle={(val) => onChange({ useFeatureFlags: val })}
          />
          <ToggleRow
            label="i18n"
            description="EXPO_PUBLIC_ENABLE_I18N — when off, copy stays English (device locale not used)."
            checked={config.useI18n}
            onToggle={(val) => onChange({ useI18n: val })}
          />
          <ToggleRow
            label="Debounce hooks"
            description="EXPO_PUBLIC_ENABLE_DEBOUNCE — useDebounce / useDebouncedCallback pass through immediately when off."
            checked={config.useDebounce}
            onToggle={(val) => onChange({ useDebounce: val })}
          />
          <ToggleRow
            label="Media permissions hook"
            description="EXPO_PUBLIC_ENABLE_MEDIA_PERMISSIONS — useMediaPermissions returns a safe denied stub when off (hooks order preserved)."
            checked={config.usePermissions}
            onToggle={(val) => onChange({ usePermissions: val })}
          />
          <ToggleRow
            label="Keyboard hook"
            description="EXPO_PUBLIC_ENABLE_KEYBOARD — useKeyboard does not subscribe when off."
            checked={config.useKeyboard}
            onToggle={(val) => onChange({ useKeyboard: val })}
          />
          <ToggleRow
            label="Deep linking (Android VIEW intent)"
            description="EXPO_PUBLIC_ENABLE_DEEP_LINKING — clears Android intentFilters + skips iOS associatedDomains from env when off."
            checked={config.useDeepLinking}
            onToggle={(val) => onChange({ useDeepLinking: val })}
          />
          <ToggleRow
            label="Push notifications"
            description="EXPO_PUBLIC_PUSH_SETUP — opt-in native registration + token logging in dev."
            checked={config.usePushNotifications}
            onToggle={(val) => onChange({ usePushNotifications: val })}
          />
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-border/60 bg-muted/25 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">Biometric re-auth</span> — not in the current template (see{" "}
        <code className="rounded bg-muted px-1 font-mono text-[11px]">docs/TEMPLATE_GAPS.md</code>). No toggle.
      </div>
    </div>
  );
}
