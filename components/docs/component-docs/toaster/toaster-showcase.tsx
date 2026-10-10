"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Row } from "@/components/ds/kit";

function requestWithdrawal() {
  return new Promise<void>((resolve) => setTimeout(resolve, 1600));
}

export function ToasterShowcase() {
  return (
    <Row className="flex-wrap justify-center gap-3">
      <Button
        variant="premium"
        onClick={() =>
          toast.success("Sold 3 cards for $2,481.00", {
            description: "Credited to your available balance.",
          })
        }
      >
        Sell 3 cards
      </Button>
      <Button
        variant="outline"
        onClick={() => toast("Added to favourites")}
      >
        Favourite a card
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning("Only 12 packs left in this print run")}
      >
        Check pack supply
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error("Could not reach the vault", {
            description: "Nothing was charged. Try again in a moment.",
            action: {
              label: "Retry",
              onClick: () => toast.success("Reconnected to the vault"),
            },
          })
        }
      >
        Simulate a failed sale
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.promise(requestWithdrawal(), {
            loading: "Requesting withdrawal…",
            success: "Withdrawal requested",
            error: "Request failed",
          })
        }
      >
        Withdraw $480.00
      </Button>
    </Row>
  );
}
