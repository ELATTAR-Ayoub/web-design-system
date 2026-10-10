"use client";

/**
 * The live Preview specimen for the `toaster` documentation page.
 *
 * `components/docs/component-docs/toaster/page.tsx` is a plain data module
 * rendered by a SERVER component (see the long comment at the top of that
 * file) — it cannot wire an onClick itself. This client companion owns five
 * buttons, one per toast type, each firing the REAL `toast()` from `sonner`
 * against the `<Toaster />` this app's root layout already mounts. Nothing
 * here is a picture of a toast — press a button and the genuine `.cn-toast`
 * markup lands in the bottom-right corner, four seconds on screen, same as a
 * live sale would produce it.
 *
 * The fifth button runs `toast.promise`, which owns its own type transition:
 * it shows loading immediately, then swaps to success once the (fake, 1.6s)
 * withdrawal request resolves — one toast changing shape, not two toasts.
 */

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
