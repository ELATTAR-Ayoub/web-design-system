"use client";

/**
 * Live companion for the `avatar` Preview — see traps.md #29. "Invite" adds
 * a real Avatar to the group (up to four visible), then rolls into
 * AvatarGroupCount once the row is full — the same overflow pattern the
 * static specimen documents, now actually exercised by the reader.
 */

import { useState } from "react";
import { UserPlusIcon } from "lucide-react";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Row } from "@/components/ds/kit";

const INVITE_POOL = ["RK", "LS", "NB", "JD", "AO", "HP"];
const VISIBLE_MAX = 4;

export function InviteAvatarShowcase() {
  const [invited, setInvited] = useState<string[]>(["VW", "EM", "TC"]);
  const [overflow, setOverflow] = useState(248);

  function invite() {
    const next = INVITE_POOL[invited.length % INVITE_POOL.length];
    if (invited.length < VISIBLE_MAX) {
      setInvited((prev) => [...prev, next]);
    } else {
      setOverflow((n) => n + 1);
    }
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <Row align="end">
        <Avatar size="lg">
          <AvatarFallback>VW</AvatarFallback>
          <AvatarBadge className="bg-value" />
        </Avatar>
        <AvatarGroup>
          {invited.map((initials) => (
            <Avatar key={initials} size="sm" className="anim-enter">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount>+{overflow}</AvatarGroupCount>
        </AvatarGroup>
      </Row>
      <Button variant="outline" onClick={invite}>
        <Icon icon={UserPlusIcon} size="sm" tone="inherit" />
        Invite
      </Button>
    </div>
  );
}
