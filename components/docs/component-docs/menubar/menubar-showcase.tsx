"use client";

/**
 * The admin menubar, fully interactive.
 *
 * `page.tsx` must stay a plain spec module (trap 29). The "View" menu's
 * checkbox group (which panels are visible) and radio group (row density)
 * are real state, so it lives here rather than as a static picture of one.
 */

import { useState } from "react";

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Kbd } from "@/components/ui/kbd";

export function MenubarShowcase() {
  const [auditLog, setAuditLog] = useState(true);
  const [queueDepth, setQueueDepth] = useState(false);
  const [density, setDensity] = useState("comfortable");

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Packs</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New pack
            <MenubarShortcut>
              <Kbd>⌘N</Kbd>
            </MenubarShortcut>
          </MenubarItem>
          <MenubarItem>Import card set</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Publish queue</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Users</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Search users</MenubarItem>
          <MenubarItem>Verification queue</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Panels</MenubarLabel>
          <MenubarCheckboxItem checked={auditLog} onCheckedChange={setAuditLog}>
            Audit log
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={queueDepth} onCheckedChange={setQueueDepth}>
            Queue depth
          </MenubarCheckboxItem>
          <MenubarCheckboxItem disabled disabledReason="Payouts are managed by finance.">
            Payout ledger
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarLabel>Density</MenubarLabel>
          <MenubarRadioGroup value={density} onValueChange={setDensity}>
            <MenubarRadioItem value="comfortable">Comfortable</MenubarRadioItem>
            <MenubarRadioItem value="compact">Compact</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Export</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Download CSV</MenubarItem>
              <MenubarItem>Download JSON</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem variant="destructive">Reset admin layout</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
