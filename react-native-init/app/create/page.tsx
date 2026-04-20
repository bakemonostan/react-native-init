import { WizardShell } from "@/features/wizard/components/WizardShell";
import { SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create your app",
  description:
    "Step through Expo template options — basics, navigation, theme, state, API, backend, auth — then copy a ready .env snippet.",
  openGraph: {
    title: `Create your app — ${SITE_NAME}`,
    description:
      "Configure identifiers, theme, state, HTTP stack, and backend targets aligned with the React Native Expo template.",
  },
  twitter: {
    card: "summary",
    title: `Create your app — ${SITE_NAME}`,
    description:
      "Wizard for Expo env + stack choices: copy the generated .env into your template clone.",
  },
};

export default function CreatePage() {
  return <WizardShell />;
}
