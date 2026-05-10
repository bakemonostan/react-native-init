import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/site";

export default function OfflinePage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">You&apos;re offline</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          {SITE_NAME} needs a connection for the wizard and API. Reconnect and try again, or open a page
          you&apos;ve already visited while online.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Back home</Link>
      </Button>
    </main>
  );
}
