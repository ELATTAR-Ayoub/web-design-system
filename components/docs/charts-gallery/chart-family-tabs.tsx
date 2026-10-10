"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Family = { id: string; title: string };

/** Keep only one family of Recharts trees mounted at a time. */
export function ChartFamilyTabs({
  selected,
  families,
}: {
  selected: string;
  families: readonly Family[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div aria-busy={pending}>
      <div className="max-w-full overflow-x-auto pb-2 scrollbar-thin">
        <ToggleGroup
          type="single"
          value={selected}
          onValueChange={(next) => {
            if (!next) return;
            startTransition(() => {
              router.replace(`?family=${encodeURIComponent(next)}`, { scroll: false });
            });
          }}
          aria-label="Chart family"
        >
          {families.map((family) => (
            <ToggleGroupItem key={family.id} value={family.id}>
              {family.title}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <span className="sr-only" role="status">
        {pending ? "Loading chart family" : ""}
      </span>
    </div>
  );
}
