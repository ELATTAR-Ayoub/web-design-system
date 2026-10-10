"use client";

import { cn } from "@/lib/utils";
import { PLOT } from "./data";

type ChartTone = "chart-1" | "chart-2" | "chart-3" | "chart-4" | "chart-5";
export type ConversionStage = { label: string; value: number; tone: ChartTone };
const TONES: Record<ChartTone, string> = { "chart-1": "bg-chart-1", "chart-2": "bg-chart-2", "chart-3": "bg-chart-3", "chart-4": "bg-chart-4", "chart-5": "bg-chart-5" };
const SAMPLE: ConversionStage[] = [{ label: "Signed up", value: 9_420, tone: "chart-1" }, { label: "Created a project", value: 6_180, tone: "chart-2" }, { label: "Invited a teammate", value: 3_940, tone: "chart-3" }, { label: "Activated", value: 3_190, tone: "chart-4" }];
const percentage = (value: number, total: number) => total > 0 ? `${((value / total) * 100).toFixed(1)}%` : "0.0%";
const STRIP_UNITS = 96;
const unitCount = (value: number, total: number) => total > 0 ? Math.max(1, Math.round((value / total) * STRIP_UNITS)) : 1;

export function ConversionFunnelChart({ title = "Conversions", total = 24_815, stages = SAMPLE }: { title?: string; total?: number; stages?: ConversionStage[] }) {
  const conversion = percentage(stages.at(-1)?.value ?? 0, total);
  const stageTotal = stages.reduce((sum, stage) => sum + stage.value, 0);
  return <figure data-slot="conversion-funnel-chart" className={cn(PLOT, "flex flex-col")} aria-label={`${title}: ${total.toLocaleString()}, ${conversion} overall conversion`}>
    <figcaption><p className="type-badge text-muted-foreground">{title}</p><p className="type-number-lg mt-1 text-foreground">{total.toLocaleString()}</p><p className="type-small mt-1 text-value">{conversion} overall conversion</p></figcaption>
    <div className="mt-3 flex h-12 shrink-0 gap-0.5" aria-hidden="true">{stages.map((stage) => <div key={stage.label} className="flex min-w-0 gap-0.5" style={{ flexGrow: stage.value, flexBasis: 0 }}>{Array.from({ length: unitCount(stage.value, stageTotal) }, (_, index) => <span key={index} className={cn("min-w-0 flex-1 rounded-sm", TONES[stage.tone])} />)}</div>)}</div>
    <div className="mt-2 flex shrink-0 gap-0.5" aria-hidden="true">{stages.map((stage) => <p key={stage.label} className="type-number-sm min-w-0 text-muted-foreground" style={{ flexGrow: stage.value, flexBasis: 0 }}>{percentage(stage.value, total)}</p>)}</div>
    <div className="mt-3 divide-y divide-border border-y border-border">{stages.map((stage) => <div key={stage.label} className="flex items-center gap-2"><span className={cn("size-2.5 shrink-0 rounded-sm", TONES[stage.tone])} aria-hidden="true" /><span className="type-small min-w-0 flex-1 truncate text-muted-foreground">{stage.label}</span><span className="type-number-sm text-foreground">{stage.value.toLocaleString()}</span></div>)}</div>
  </figure>;
}
