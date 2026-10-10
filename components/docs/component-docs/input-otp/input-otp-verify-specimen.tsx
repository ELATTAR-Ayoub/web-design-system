"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { Icon } from "@/components/ui/icon";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";

const VALID_CODE = "408291";

type Status = "entering" | "checking" | "verified" | "rejected";

export function VerifyCodeSpecimen() {
  const [status, setStatus] = useState<Status>("entering");
  const [key, setKey] = useState(0);

  async function handleComplete(value: string) {
    setStatus("checking");
    await new Promise((r) => setTimeout(r, 700));
    setStatus(value === VALID_CODE ? "verified" : "rejected");
  }

  function reset() {
    setStatus("entering");
    setKey((k) => k + 1);
  }

  return (
    <div className="w-full max-w-sm space-y-4 text-center">
      <p className="type-small text-muted-foreground">
        Enter the code sent to your email. Try <span className="type-code">408291</span>.
      </p>
      <InputOTP
        key={key}
        maxLength={6}
        onComplete={handleComplete}
        disabled={status === "checking" || status === "verified"}
        aria-label="Verification code"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <div className="min-h-6" role="status">
        {status === "checking" && (
          <p className="type-small flex items-center justify-center gap-2 text-muted-foreground">
            <Spinner className="size-4" aria-hidden />
            Checking
          </p>
        )}
        {status === "verified" && (
          <p className="type-small flex items-center justify-center gap-2 text-success-ink">
            <Icon icon={CheckCircle2} size="sm" tone="success" />
            Email verified
          </p>
        )}
        {status === "rejected" && (
          <p className="type-small flex items-center justify-center gap-2 text-destructive-ink">
            <Icon icon={XCircle} size="sm" tone="error" />
            That code doesn&rsquo;t match.{" "}
            <button type="button" onClick={reset} className="underline underline-offset-4">
              Try again
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
