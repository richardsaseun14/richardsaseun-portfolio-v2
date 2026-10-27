import type { Metadata } from "next";
import { PageIntro } from "@/components/primitives";
import { StatusBoard } from "@/components/status/StatusBoard";
import { getStatusReport, REVALIDATE, TIMEOUT_MS } from "@/lib/status";
import { SLOW_MS } from "@/lib/status/classify";

export const metadata: Metadata = {
  title: "Status",
  description: "Live health of the APIs that power this site.",
};

export const revalidate = 60;

export default async function StatusPage() {
  const report = await getStatusReport();

  return (
    <main>
      <PageIntro
        eyebrow="Status"
        eyebrowRight="Checked every minute"
        title="Status"
        intro="Live health of the services and APIs this site runs on."
      />

      <section aria-label="Service status" className="container-x pt-12 pb-20 sm:pt-16 sm:pb-30">
        <StatusBoard report={report} refreshMs={REVALIDATE * 1000} />
        <p className="meta mt-6 text-muted-foreground">
          Response times measured from the server. Over {SLOW_MS / 1000} s counts as degraded; no answer within{" "}
          {TIMEOUT_MS / 1000} s counts as an outage.
        </p>
      </section>
    </main>
  );
}
