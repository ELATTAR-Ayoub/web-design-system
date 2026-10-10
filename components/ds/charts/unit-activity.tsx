"use client";

import { cn } from "@/lib/utils";
import { PLOT } from "./data";

export type UnitActivityPoint = { label: string; current: number; previous?: number };
export type UnitActivityDay = { label: string; points: UnitActivityPoint[] };

const SAMPLE: UnitActivityDay[] = [
  { label: "Sun", points: [[1,1],[2,2],[5,8],[8,11],[7,10],[4,9]].map(([current, previous], i) => ({ label: `${i * 4}:00`, current, previous })) },
  { label: "Mon", points: [2,6,3,7,4,6].map((current, i) => ({ label: `${i * 4}:00`, current })) },
  { label: "Tue", points: [[4,9],[10,12],[8,11],[5,8],[3,3],[2,2]].map(([current, previous], i) => ({ label: `${i * 4}:00`, current, previous })) },
  { label: "Wed", points: [[4,8],[10,12],[7,10],[3,3],[2,2],[1,1]].map(([current, previous], i) => ({ label: `${i * 4}:00`, current, previous })) },
  { label: "Thu", points: [[2,2],[4,4],[5,5],[6,10],[4,8],[3,3]].map(([current, previous], i) => ({ label: `${i * 4}:00`, current, previous })) },
  { label: "Fri", points: [[4,4],[5,5],[6,6],[7,7],[9,11],[4,4]].map(([current, previous], i) => ({ label: `${i * 4}:00`, current, previous })) },
  { label: "Sat", points: [5,3,2,1,3,2].map((current, i) => ({ label: `${i * 4}:00`, current })) },
];
const LEVELS = Array.from({ length: 12 }, (_, index) => 12 - index);

export function UnitActivityChart({ title = "Active users", value = 24_815, comparison = "5.6k fewer in the last 7 days", data = SAMPLE }: { title?: string; value?: number; comparison?: string; data?: UnitActivityDay[] }) {
  return <figure data-slot="unit-activity-chart" className={cn(PLOT, "flex flex-col")} aria-label={`${title}: ${value.toLocaleString()}. ${comparison}`}>
    <figcaption className="flex items-start justify-between gap-4"><div><p className="type-badge text-muted-foreground">{title}</p><p className="type-number-lg mt-1 text-foreground">{value.toLocaleString()}</p><p className="type-small mt-1 text-muted-foreground">{comparison}</p></div><div className="type-small flex flex-wrap justify-end gap-3 text-muted-foreground" aria-hidden="true"><span className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-muted" />Previous</span><span className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-chart-4" />Current</span></div></figcaption>
    <div className="mt-4 min-h-0 flex-1 overflow-hidden" aria-hidden="true"><div className="flex h-full min-w-xl gap-2">{data.map((day) => <div key={day.label} className="flex min-w-0 flex-1 flex-col"><div className="flex min-h-0 flex-1 items-end justify-center gap-0.5">{day.points.map((point) => <div key={point.label} className="grid h-full flex-1 grid-rows-12 gap-0.5" title={`${day.label} ${point.label}: ${point.current}`}>{LEVELS.map((level) => { const current = level <= point.current; const previous = level <= (point.previous ?? point.current); return <span key={level} className={cn("min-h-0 rounded-sm", current ? "bg-chart-4" : previous ? "bg-muted" : "bg-muted/40")} /> })}</div>)}</div><p className="type-number-sm mt-2 text-center text-muted-foreground">{day.label}</p></div>)}</div></div>
  </figure>;
}
