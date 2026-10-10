"use client";

/**
 * The card's right-click menu, fully interactive.
 *
 * `page.tsx` must stay a plain spec module (trap 29). The state this Preview
 * needs — "Track price" (checkbox) and the shipping-speed choice inside the
 * Shipping submenu (radio) — lives here, alongside the rest of the menu so
 * the whole thing reads as one real specimen rather than a static card with
 * a stateful fragment bolted on.
 */

import { useState } from "react";

import { Heart, Share2, Trash2, Truck } from "lucide-react";

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Icon } from "@/components/ui/icon";
import { Kbd } from "@/components/ui/kbd";

export function ContextMenuShowcase() {
  const [trackPrice, setTrackPrice] = useState(false);
  const [shipping, setShipping] = useState("standard");

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="grid h-40 max-w-xs cursor-context-menu place-items-center rounded-lg border border-border bg-card">
          <div className="text-center">
            <p className="type-h4 text-foreground">Voidwing Ascendant</p>
            <p className="type-small mt-2 text-value-ink">Legendary</p>
            <p className="type-small mt-3 text-muted-foreground">Right-click me</p>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-60">
        <ContextMenuItem>
          <Icon icon={Heart} size="sm" tone="subtle" />
          Favourite
          <ContextMenuShortcut>
            <Kbd>F</Kbd>
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuCheckboxItem checked={trackPrice} onCheckedChange={setTrackPrice}>
          Track price
        </ContextMenuCheckboxItem>
        <ContextMenuItem>
          <Icon icon={Share2} size="sm" tone="subtle" />
          Share pull
        </ContextMenuItem>
        <ContextMenuItem disabled disabledReason="Sign in to list this card for trade.">
          List for trade
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Icon icon={Truck} size="sm" tone="subtle" />
            Shipping
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuLabel>Speed</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuRadioGroup value={shipping} onValueChange={setShipping}>
              <ContextMenuRadioItem value="standard">Standard — 5 days</ContextMenuRadioItem>
              <ContextMenuRadioItem value="expedited">Expedited — 2 days</ContextMenuRadioItem>
              <ContextMenuRadioItem value="overnight">Overnight</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <Icon icon={Trash2} size="sm" tone="inherit" />
          Sell for $1,240.00
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
