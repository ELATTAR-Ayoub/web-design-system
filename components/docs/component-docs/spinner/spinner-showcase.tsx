"use client";

/**
 * The live Preview specimen for the `spinner` documentation page.
 *
 * `components/docs/component-docs/spinner/page.tsx` is a plain data module
 * rendered by a SERVER component (per `references/traps.md` #29) — it cannot
 * hold the request state a real pending action needs. This client companion
 * owns it: pressing "Withdraw $480.00" disables the row's button, shows the
 * real `Spinner` beside "Requesting…" for 1.8s (a genuine unknown-length wait
 * — Progress would be the wrong component here precisely because there is no
 * total to report), then resolves into a success line. Press it again to
 * watch the whole cycle again from rest.
 */

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle2 } from "lucide-react";

type Status = "idle" | "pending" | "done";

export function SpinnerShowcase() {
  const [status, setStatus] = useState<Status>("idle");

  function requestWithdrawal() {
    setStatus("pending");
    setTimeout(() => setStatus("done"), 1800);
  }

  return (
    <div className="w-full max-w-sm rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="type-body text-foreground">Withdraw $480.00</p>
          <p className="type-small text-muted-foreground">To your linked bank account</p>
        </div>
        {status === "idle" && (
          <Button size="sm" onClick={requestWithdrawal}>
            Request
          </Button>
        )}
        {status === "pending" && (
          <span className="inline-flex items-center gap-2">
            <Spinner aria-label="Requesting withdrawal" />
            <span className="type-small text-muted-foreground">Requesting&hellip;</span>
          </span>
        )}
        {status === "done" && (
          <span className="inline-flex items-center gap-2">
            <Icon icon={CheckCircle2} size="sm" tone="success" />
            <span className="type-small text-success-ink">Requested</span>
          </span>
        )}
      </div>
      {status === "done" && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-3"
          onClick={() => setStatus("idle")}
        >
          Start over
        </Button>
      )}
    </div>
  );
}
