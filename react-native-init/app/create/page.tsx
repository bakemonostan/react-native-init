import { WizardShell } from "@/features/wizard/components/WizardShell";
import { SITE_KEYWORDS, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";

const createDescription =
  "Step through Expo template options — basics, navigation, theme, state, API, backend, auth — then copy a ready .env snippet or download a ZIP when configured.";

export const metadata: Metadata = {
  title: "Create your app",
  description: createDescription,
  keywords: [...SITE_KEYWORDS, "env generator", "zip download"],
  openGraph: {
    title: `Create your app — ${SITE_NAME}`,
    description: createDescription,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `Create your app — ${SITE_NAME}`,
    description: createDescription,
  },
};

export default function CreatePage() {
  return <WizardShell />;
}
