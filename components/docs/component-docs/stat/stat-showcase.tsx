"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Stat, type StatState } from "@/components/ui/stat";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function RevenueSimulator() {
  const [revenue, setRevenue] = useState(12480);
  const [deltaPct, setDeltaPct] = useState(8.2);
  const [packs, setPacks] = useState(412);
  const [state, setState] = useState<StatState>("ready");
  const salesRef = useRef(0);

  function simulateSale() {
    setState("loading");
    window.setTimeout(() => {
      const sale = 20 + Math.floor(Math.random() * 180);
      salesRef.current += 1;
      setRevenue((r) => r + sale);
      setDeltaPct((d) => Math.min(99.9, d + sale / 400));
      setPacks((p) => p + 1);
      setState("ready");
    }, 550);
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="grid gap-8 sm:grid-cols-2">
        <Stat
          label="Revenue"
          value={money.format(revenue)}
          delta={{ value: `${deltaPct.toFixed(1)}%`, direction: "up" }}
          hint="vs last month"
          state={state}
        />
        <Stat
          label="Packs opened"
          value={String(packs)}
          delta={{ value: "0.0%", direction: "flat" }}
          hint="vs last month"
          state={state}
        />
      </div>
      <Button onClick={simulateSale} disabled={state === "loading"}>
        {state === "loading" ? "Selling…" : "Simulate a sale"}
      </Button>
    </div>
  );
}
