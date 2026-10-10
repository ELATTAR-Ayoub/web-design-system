"use client";

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
