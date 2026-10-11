"use client";

import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { DirectionProvider } from "@/components/ui/direction";
import { Panel, Row } from "@/components/ds/kit";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function DirectionSwitchShowcase() {
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");
  const switchId = useId();

  return (
    <div className="w-full max-w-md space-y-4">
      <Label htmlFor={switchId} className="justify-between gap-4">
        <span className="type-small text-muted-foreground">
          Right to left ({dir})
        </span>
        <Switch
          id={switchId}
          checked={dir === "rtl"}
          onCheckedChange={(checked) => setDir(checked ? "rtl" : "ltr")}
        />
      </Label>
      <div dir={dir}>
        <DirectionProvider direction={dir}>
          <Panel label={`direction="${dir}"`}>
            <Row>
              <Button variant="outline">{dir === "rtl" ? "إلغاء" : "Cancel"}</Button>
              <Button>{dir === "rtl" ? "حفظ" : "Save"}</Button>
            </Row>
          </Panel>
        </DirectionProvider>
      </div>
    </div>
  );
}
