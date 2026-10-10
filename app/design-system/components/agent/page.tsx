import type { Metadata } from "next";
import Link from "next/link";

import { WorkspaceLiveSpecimen } from "@/components/docs/component-docs/agent-workspace/workspace-live-specimen";
import { FamilyLanding } from "@/components/docs/page/family-landing";
import { Button } from "@/components/ui/button";
import { Code, DoDont, DsSection, Note, Panel } from "@/components/ds/kit";
import { docRoute } from "@/lib/ds/docs/catalog";

export const metadata: Metadata = {
  title: "Agent — Elattar's Design System",
  description:
    "A complete AI workspace — history, thread, composer, avatar and voice — pointed at whatever is actually answering.",
};

const SEAMS = [
  {
    seam: "transport",
    type: "AgentTransport",
    what: "What it talks to. The whole reason this is reusable — implement one interface and the workspace points at your agent.",
  },
  {
    seam: "avatar",
    type: "AvatarRenderer",
    what: "What it looks like. A mascot, a video, a photograph — one module satisfying one type. The state machine does not move.",
  },
  {
    seam: "speech",
    type: "SpeechAdapter",
    what: "What it sounds like. Swap the adapter, keep the controls.",
  },
  {
    seam: "toolStates",
    type: "ToolStateMap",
    what: "What its tools mean, so the face can describe them honestly. Supplied rather than guessed — a status line that guesses is a status line that lies.",
  },
] as const;

export default function AgentLanding() {
  return (
    <>
      <FamilyLanding
        family="agent"
        blurb="One complete surface on one transport contract: the AgentWorkspace, built from Vercel AI Elements restyled to this system. Try it, then explore each component in the reference below."
        groups={[
          {
            id: "agent-parts",
            title: "Agent family",
            description: "The workspace itself, the transport contract, and the parts built for it here — the avatar, the effort slider and the spark field.",
            prefix: "agent-",
          },
          {
            id: "ai-elements",
            title: "AI Elements",
            description: "Vercel AI Elements (Apache-2.0), vendored and restyled to the system's tokens — every part the AgentWorkspace is composed from, each documented on its own page.",
            prefix: "ai-",
          },
        ]}
      >
        <div className="mb-16 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={docRoute("agent-workspace")}>Try the Workspace</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href={docRoute("agent-core")}>Documentation</Link>
          </Button>
        </div>

        <DsSection
          id="live-agent"
          title="Live agent"
          description="Ask what is in stock, export your activity, or ask to buy a pack. Open the history drawer to switch conversations. Replies, tool calls and approval gates use the real workspace on an offline scripted transport."
        >
          <Panel label="AgentWorkspace" flush>
            <div className="p-6">
              <WorkspaceLiveSpecimen fullScreenHref={`${docRoute("agent-workspace")}/live`} />
            </div>
          </Panel>
        </DsSection>
      </FamilyLanding>

      <Note tone="action" title="Why this is its own family" className="mb-12">
        Base components are shadcn restyled onto our tokens: vendored, generic,
        and regenerable. The agent workspace is neither vendored nor generic in
        that sense — it is written from scratch, it is large, and it owns a
        state machine. But it knows nothing about any particular product, so it
        is not the thing you delete when you carry this system somewhere new.
        Putting it in <Code>ui/</Code> would have broken the rule that nothing
        there is forked; leaving it beside product code would have marked it
        for deletion. It gets its own family because it is genuinely a third
        kind of thing.
      </Note>

      <DsSection
        id="seams"
        title="Four seams, and nothing else"
        description="The workspace owns the composer, the thread, the face and the voice. It owns no protocol, no persona and no product knowledge. Everything specific arrives as a prop, and the seams do not know about each other — which is what stops this becoming a component that only works in the app it was written for."
      >
        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {SEAMS.map((seam) => (
            <div key={seam.seam} className="px-6 py-5">
              <div className="flex items-baseline gap-3">
                <span className="type-code text-action-ink">{seam.seam}</span>
                <span className="type-small text-muted-foreground">{seam.type}</span>
              </div>
              <p className="type-small mt-2 text-muted-foreground">{seam.what}</p>
            </div>
          ))}
        </div>
      </DsSection>

      <DsSection
        id="rules"
        title="Rules"
        description="The workspace is the one place in this system where the component is answering to something outside the product. That makes honesty the governing constraint."
      >
        <DoDont
          dos={[
            "State what the agent actually did. A paperclip that means we sent the filename must not look like one that means we sent the file.",
            "Hold anything irreversible at an approval card, and describe it in a sentence a human can decide on.",
            "Map every tool onto a state, so the face and the status line say what is happening.",
            "Ship the unhappy path — the failed tool, the declined approval, the empty transcript.",
          ]}
          donts={[
            "Advertise a capability the transport does not have. `capabilities` exists so the workspace renders only what this agent can really do.",
            "Let the agent spend money, send a message or delete something on its own because the tool happened to be available.",
            "Fall back to a generic spinner. A status indicator that cannot be specific is decoration.",
            "Document only the conversation that went well. That is half a component.",
          ]}
        />
      </DsSection>
    </>
  );
}
