"use client";

import { useState } from "react";
import { PackageOpen, Sparkles as SparklesIcon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const RarityGlyph = SparklesIcon;

type Pull = { name: string; rarity: string; value: string };

const PULLS: Pull[] = [
  { name: "Voidwing Ascendant", rarity: "Legendary", value: "$248.00" },
  { name: "Emberlash Prime", rarity: "Epic", value: "$64.00" },
  { name: "Tidecaller", rarity: "Rare", value: "$12.00" },
];

export function OpenPackSpecimen() {
  const [status, setStatus] = useState<"idle" | "opening" | "done">("idle");
  const [pull, setPull] = useState<Pull | null>(null);

  async function openPack() {
    setStatus("opening");
    setPull(null);
    await new Promise((r) => setTimeout(r, 1100));
    const result = PULLS[Math.floor(Math.random() * PULLS.length)];
    setPull(result);
    setStatus("done");
    toast.success(`Pulled ${result.name} — ${result.value}`);
  }

  return (
    <div className="w-full max-w-sm space-y-5 text-center">
      <Button
        size="lg"
        variant="premium"
        loading={status === "opening"}
        onClick={openPack}
      >
        {status === "opening" ? (
          "Opening"
        ) : (
          <>
            <Icon icon={PackageOpen} size="sm" tone="inherit" />
            Open Pack
          </>
        )}
      </Button>

      {pull && status === "done" && (
        <div className="rounded-xl border border-border bg-card p-5 text-left">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="type-h4 text-foreground">{pull.name}</p>
              <p className="type-small mt-1 text-muted-foreground">
                Added to your Stash
              </p>
            </div>
            <Badge variant="premium">
              <Icon icon={RarityGlyph} size="xs" tone="inherit" data-icon="inline-start" />
              {pull.rarity}
            </Badge>
          </div>
          <p className="type-number-lg mt-4 text-value-ink">{pull.value}</p>
        </div>
      )}

      {!pull && status === "idle" && (
        <p className="type-small text-muted-foreground">
          Press Open Pack — it loads, then reveals what you pulled.
        </p>
      )}
    </div>
  );
}
