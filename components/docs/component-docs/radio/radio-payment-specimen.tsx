"use client";

/**
 * The live Preview specimen for the `radio` documentation page.
 *
 * `components/docs/component-docs/radio/page.tsx` is a plain data module
 * rendered by a SERVER component — it cannot hold the `useState` a real
 * choice needs (trap 29). This companion is that scene: pick a withdrawal
 * method and the summary line beneath it — fee and arrival time — actually
 * changes, using nothing but `RadioGroup`'s own `onValueChange`.
 */

import { useState } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { cn } from "@/lib/utils";

type Method = {
  value: string;
  title: string;
  desc: string;
  fee: string;
  arrival: string;
};

const METHODS: Method[] = [
  { value: "usdc", title: "USDC", desc: "Network fee applies.", fee: "$1.20", arrival: "Minutes" },
  { value: "bank", title: "Bank transfer", desc: "Standard ACH.", fee: "$0.00", arrival: "1–3 business days" },
  { value: "card", title: "Card refund", desc: "Back to the original card.", fee: "$0.00", arrival: "5–10 business days" },
];

export function PaymentMethodSpecimen() {
  const [value, setValue] = useState("usdc");
  const chosen = METHODS.find((m) => m.value === value)!;

  return (
    <div className="w-full max-w-sm space-y-4">
      <RadioGroup value={value} onValueChange={setValue} className="gap-3">
        {METHODS.map((m) => (
          <Label
            key={m.value}
            htmlFor={`pm-${m.value}`}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors duration-fast hover:border-input",
              "has-[[data-state=checked]]:border-action/50 has-[[data-state=checked]]:bg-action/12",
            )}
          >
            <RadioGroupItem value={m.value} id={`pm-${m.value}`} className="mt-0.5" />
            <span className="min-w-0 flex-1">
              <span className="type-h4 block text-foreground">{m.title}</span>
              <span className="type-small mt-1 block text-muted-foreground">{m.desc}</span>
            </span>
          </Label>
        ))}
      </RadioGroup>

      <div className="rounded-lg border border-border bg-muted p-4">
        <p className="type-small text-muted-foreground">
          Fee <span className="type-number-sm text-foreground">{chosen.fee}</span> · Arrives{" "}
          <span className="text-foreground">{chosen.arrival}</span>
        </p>
      </div>
    </div>
  );
}
