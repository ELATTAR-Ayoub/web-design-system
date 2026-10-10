"use client";

/**
 * Live specimens for the `ai-mic-selector` page. The picker reads the real
 * audio inputs the browser reports (`navigator.mediaDevices`), so what a
 * reader sees depends on their machine; with no device, or with permission
 * refused, the list shows its empty message.
 */

import * as React from "react";
import { MicIcon } from "lucide-react";

import {
  MicSelector,
  MicSelectorContent,
  MicSelectorEmpty,
  MicSelectorInput,
  MicSelectorItem,
  MicSelectorLabel,
  MicSelectorList,
  MicSelectorTrigger,
  MicSelectorValue,
} from "@/components/ai-elements/mic-selector";
import { Icon } from "@/components/ui/icon";

function DeviceList() {
  return (
    <>
      <MicSelectorInput />
      <MicSelectorEmpty />
      <MicSelectorList>
        {(devices) =>
          devices.map((device) => (
            <MicSelectorItem key={device.deviceId} value={device.deviceId}>
              <MicSelectorLabel device={device} />
            </MicSelectorItem>
          ))
        }
      </MicSelectorList>
    </>
  );
}

/** A full-width trigger that names the chosen microphone. */
export function MicSelectorSpecimen() {
  const [value, setValue] = React.useState<string | undefined>();
  return (
    <MicSelector onValueChange={setValue} value={value}>
      <MicSelectorTrigger className="w-72 justify-between">
        <MicSelectorValue />
      </MicSelectorTrigger>
      <MicSelectorContent>
        <DeviceList />
      </MicSelectorContent>
    </MicSelector>
  );
}

/**
 * The workspace composer's shape: a bare chevron beside a mic glyph. The trigger
 * is narrower than the list, which never draws narrower than min-w-64.
 */
export function MicSelectorCompactSpecimen() {
  const [value, setValue] = React.useState<string | undefined>();
  return (
    <div className="flex items-center">
      <Icon icon={MicIcon} size="md" tone="muted" label="Microphone" />
      <MicSelector onValueChange={setValue} value={value}>
        <MicSelectorTrigger aria-label="Choose microphone" className="-ml-1 px-1" size="sm" type="button" variant="ghost" />
        <MicSelectorContent popoverOptions={{ align: "start", side: "bottom" }}>
          <DeviceList />
        </MicSelectorContent>
      </MicSelector>
    </div>
  );
}
