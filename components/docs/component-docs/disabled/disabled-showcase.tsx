"use client";

/**
 * The live Preview specimen for the `disabled` documentation page.
 *
 * `components/docs/component-docs/disabled/page.tsx` is a plain data module
 * rendered by a SERVER component (per `references/traps.md` #29) — it cannot
 * hold the condition that flips the wrapped control. This client companion
 * owns it: checking "I've added a payment method" enables the real
 * `Checkout` button for real — `Disabled`'s own `disabled` prop and the
 * child's native `disabled` attribute both toggle together, exactly as
 * `disabled.tsx` documents them wired. Leave it unchecked and the reason
 * trigger beside the button stays reachable, on keyboard and on touch.
 */

import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Disabled } from "@/components/ui/disabled";

export function DisabledShowcase() {
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);

  return (
    <div className="flex flex-col items-center gap-5">
      <Disabled
        disabled={!hasPaymentMethod}
        reason="Add a payment method to enable checkout."
      >
        <Button disabled={!hasPaymentMethod}>Checkout</Button>
      </Disabled>
      <label className="flex items-center gap-2.5 type-small text-muted-foreground">
        <Checkbox
          checked={hasPaymentMethod}
          onCheckedChange={(checked) => setHasPaymentMethod(checked === true)}
        />
        Add a payment method
      </label>
    </div>
  );
}
