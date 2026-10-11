"use client";

import * as React from "react";

import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorShortcut,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import { Button } from "@/components/ui/button";
import { MODELS } from "./model-data";

const providerId = (provider: string) => provider.toLowerCase();

export function ModelSelectorSpecimen({
  defaultOpen = false,
  models = MODELS,
}: {
  defaultOpen?: boolean;
  models?: typeof MODELS;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [id, setId] = React.useState("sonnet");
  const selected = MODELS.find((m) => m.id === id) ?? MODELS[0];
  const providers = Array.from(new Set(models.map((m) => m.provider)));

  return (
    <div className="flex flex-wrap items-center gap-3">
      <ModelSelector onOpenChange={setOpen} open={open}>
        <ModelSelectorTrigger asChild>
          <Button variant="outline">
            <ModelSelectorLogo className="anim-enter" key={selected.provider} provider={providerId(selected.provider)} />
            <ModelSelectorName>{selected.name}</ModelSelectorName>
          </Button>
        </ModelSelectorTrigger>
        <ModelSelectorContent title="Choose a model">
          <ModelSelectorInput placeholder="Search models..." />
          <ModelSelectorList>
            <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
            {providers.map((provider) => (
              <ModelSelectorGroup heading={provider} key={provider}>
                {models
                  .filter((m) => m.provider === provider)
                  .map((m) => (
                    <ModelSelectorItem
                      key={m.id}
                      onSelect={() => {
                        setId(m.id);
                        setOpen(false);
                      }}
                      value={`${m.name} ${m.id}`}
                    >
                      <ModelSelectorLogo provider={providerId(m.provider)} />
                      <ModelSelectorName>{m.name}</ModelSelectorName>
                      <ModelSelectorShortcut>{m.note}</ModelSelectorShortcut>
                    </ModelSelectorItem>
                  ))}
              </ModelSelectorGroup>
            ))}
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
      <p className="type-small text-muted-foreground" aria-live="polite">
        Using {selected.name}.
      </p>
      <div className="flex items-center gap-2">
        <ModelSelectorLogoGroup>
          {providers.map((provider) => (
            <ModelSelectorLogo key={provider} provider={providerId(provider)} />
          ))}
        </ModelSelectorLogoGroup>
        <span className="type-small text-muted-foreground">
          {providers.length} providers
        </span>
      </div>
    </div>
  );
}
