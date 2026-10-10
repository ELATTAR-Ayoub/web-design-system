"use client";

import { useState } from "react";
import { PackageOpenIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

const POOL = [
  { name: "Voidwing Ascendant", value: "$1,240.00", rarity: "Mythic" },
  { name: "Cobalt Sentinel", value: "$86.00", rarity: "Rare" },
  { name: "Nightfall Adept", value: "$24.50", rarity: "Uncommon" },
  { name: "Emberkin Scout", value: "$4,900.00", rarity: "Mythic" },
];

export function PackCardShowcase() {
  const [pull, setPull] = useState<(typeof POOL)[number] | null>(null);

  function open() {
    setPull(POOL[Math.floor(Math.random() * POOL.length)]);
  }

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle asChild>
          <h4>Eclipse Vault</h4>
        </CardTitle>
        <CardDescription>Series I · 6 cards per pack</CardDescription>
        <CardAction>
          <Badge variant={pull ? "success" : "premium"} className="anim-enter">
            {pull ? "Opened" : "Sealed"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        {pull ? (
          <div key={pull.name} className="anim-enter flex items-center justify-between">
            <div>
              <p className="type-small text-muted-foreground">You pulled</p>
              <p className="type-body text-foreground">{pull.name}</p>
              <p className="type-small text-muted-foreground">{pull.rarity}</p>
            </div>
            <span className="type-number-md text-value-ink">{pull.value}</span>
          </div>
        ) : (
          <div className="flex items-baseline justify-between">
            <span className="type-small text-muted-foreground">Contents</span>
            <span className="type-small text-muted-foreground">Hidden until opened</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={open}>
          <Icon icon={PackageOpenIcon} size="sm" tone="inherit" />
          {pull ? "Open another" : "Open pack"}
        </Button>
      </CardFooter>
    </Card>
  );
}
