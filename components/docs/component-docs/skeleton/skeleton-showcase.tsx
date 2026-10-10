"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Row } from "@/components/ds/kit";

export function SkeletonShowcase() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="w-full max-w-72 space-y-4">
      <div
        aria-busy={!loaded}
        className="rounded-lg border border-border bg-card p-4"
      >
        {loaded ? (
          <div className="anim-enter">
            <div className="mb-4 h-32 w-full rounded-md border border-value/30 bg-value/12" />
            <p className="type-small text-muted-foreground">Eclipse Vault · #044</p>
            <p className="type-h4 mt-1 text-foreground">Voidwing Ascendant</p>
            <Badge variant="premium" className="mt-4">
              Legendary
            </Badge>
          </div>
        ) : (
          <div className="anim-enter">
            <Skeleton className="mb-4 h-32 w-full rounded-md" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-2.5 h-4 w-40" />
          </div>
        )}
      </div>
      <Row className="justify-center gap-3">
        <Button variant="outline" size="sm" onClick={() => setLoaded(true)}>
          Load
        </Button>
        <Button variant="outline" size="sm" onClick={() => setLoaded(false)}>
          Reset
        </Button>
      </Row>
    </div>
  );
}
