"use client";

import * as React from "react";

import {
  EnvironmentVariable,
  EnvironmentVariableCopyButton,
  EnvironmentVariableGroup,
  EnvironmentVariableName,
  EnvironmentVariableRequired,
  EnvironmentVariableValue,
  EnvironmentVariables,
  EnvironmentVariablesContent,
  EnvironmentVariablesHeader,
  EnvironmentVariablesTitle,
  EnvironmentVariablesToggle,
} from "@/components/ai-elements/environment-variables";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

/**
 * Live specimens for the `ai-environment-variables` documentation page. The
 * values are fake placeholders, never a real key.
 */

const VARIABLES = [
  { name: "DATABASE_URL", required: true, value: "postgres://demo:demo@localhost:5432/app" },
  { name: "LOG_LEVEL", required: false, value: "info" },
];

function Rows() {
  return (
    <EnvironmentVariablesContent>
      {VARIABLES.map((variable) => (
        <EnvironmentVariable key={variable.name} name={variable.name} value={variable.value}>
          <EnvironmentVariableGroup>
            <EnvironmentVariableName />
            {variable.required ? <EnvironmentVariableRequired /> : null}
          </EnvironmentVariableGroup>
          <EnvironmentVariableGroup>
            <EnvironmentVariableValue />
            <EnvironmentVariableCopyButton aria-label={`Copy ${variable.name}`} copyFormat="export" />
          </EnvironmentVariableGroup>
        </EnvironmentVariable>
      ))}
    </EnvironmentVariablesContent>
  );
}

/** The Preview: the same composition the workspace draws, with the visibility switch live. */
export function EnvironmentVariablesPreview() {
  const [shown, setShown] = React.useState(false);

  return (
    <Panel label="EnvironmentVariables" note={shown ? "values shown" : "values masked"}>
      <EnvironmentVariables onShowValuesChange={setShown}>
        <EnvironmentVariablesHeader>
          <EnvironmentVariablesTitle />
          <EnvironmentVariablesToggle />
        </EnvironmentVariablesHeader>
        <Rows />
      </EnvironmentVariables>
    </Panel>
  );
}

/** The States grid: masked, revealed, disabled toggle and no variables. */
export function EnvironmentVariablesStateGrid() {
  return (
    <StateGrid cols={2}>
      <StateCell label="rest" note="values masked as bullets">
        <EnvironmentVariables className="w-full">
          <EnvironmentVariablesContent>
            <EnvironmentVariable name="LOG_LEVEL" value="info" />
          </EnvironmentVariablesContent>
        </EnvironmentVariables>
      </StateCell>
      <StateCell label="success" note="defaultShowValues reveals the value">
        <EnvironmentVariables className="w-full" defaultShowValues>
          <EnvironmentVariablesContent>
            <EnvironmentVariable name="LOG_LEVEL" value="info" />
          </EnvironmentVariablesContent>
        </EnvironmentVariables>
      </StateCell>
      <StateCell label="disabled" note="toggle disabled: the mask stays">
        <EnvironmentVariables className="w-full">
          <EnvironmentVariablesHeader>
            <EnvironmentVariablesTitle />
            <EnvironmentVariablesToggle disabled />
          </EnvironmentVariablesHeader>
        </EnvironmentVariables>
      </StateCell>
      <StateCell label="empty" note="header and no rows">
        <EnvironmentVariables className="w-full">
          <EnvironmentVariablesHeader>
            <EnvironmentVariablesTitle />
            <EnvironmentVariablesToggle />
          </EnvironmentVariablesHeader>
          <EnvironmentVariablesContent />
        </EnvironmentVariables>
      </StateCell>
    </StateGrid>
  );
}
