import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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

const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

const variables = [
  { name: "DATABASE_URL", required: true, value: "postgres://localhost/db" },
  { name: "DEBUG", required: false, value: "false" },
];

// Trimmed from ae-src/packages/examples/src/environment-variables.tsx
const card = (defaultShowValues = false) => (
  <EnvironmentVariables defaultShowValues={defaultShowValues}>
    <EnvironmentVariablesHeader>
      <EnvironmentVariablesTitle />
      <EnvironmentVariablesToggle />
    </EnvironmentVariablesHeader>
    <EnvironmentVariablesContent>
      {variables.map((variable) => (
        <EnvironmentVariable
          key={variable.name}
          name={variable.name}
          value={variable.value}
        >
          <EnvironmentVariableGroup>
            <EnvironmentVariableName />
            {variable.required && <EnvironmentVariableRequired />}
          </EnvironmentVariableGroup>
          <EnvironmentVariableGroup>
            <EnvironmentVariableValue />
            <EnvironmentVariableCopyButton copyFormat="export" />
          </EnvironmentVariableGroup>
        </EnvironmentVariable>
      ))}
    </EnvironmentVariablesContent>
  </EnvironmentVariables>
);

describe("EnvironmentVariables", () => {
  it("renders the card surface, the title role and identifier-styled names", () => {
    const { container } = render(card());
    expect((container.firstElementChild as HTMLElement).className).toMatch(
      /\bbg-card\b/
    );
    expect(screen.getByText("Environment Variables").className).toMatch(
      /\btype-h4\b/
    );
    expect(screen.getByText("DATABASE_URL").className).toMatch(
      /\btype-identifier\b/
    );
  });

  it("masks every value by default, and the toggle reveals all of them at once", async () => {
    const user = setup();
    render(card());

    expect(screen.queryByText("postgres://localhost/db")).not.toBeInTheDocument();
    expect(screen.queryByText("false")).not.toBeInTheDocument();

    const toggle = screen.getByRole("switch", { name: /toggle value visibility/i });
    await user.click(toggle);

    expect(screen.getByText("postgres://localhost/db")).toBeInTheDocument();
    expect(screen.getByText("false")).toBeInTheDocument();
  });

  it("shows values immediately when defaultShowValues is true", () => {
    render(card(true));
    expect(screen.getByText("postgres://localhost/db")).toBeInTheDocument();
  });

  it("marks the required variable with a Required badge", () => {
    render(card());
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("copies name=value as an export line for copyFormat=export", async () => {
    const user = setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    const onCopy = vi.fn();

    render(
      <EnvironmentVariable name="API_KEY" value="secret">
        <EnvironmentVariableCopyButton copyFormat="export" onCopy={onCopy} />
      </EnvironmentVariable>
    );

    await user.click(screen.getByRole("button"));
    await waitFor(() => expect(onCopy).toHaveBeenCalled());
    expect(writeText).toHaveBeenCalledWith('export API_KEY="secret"');
  });

  it("reports failure when the Clipboard API is unavailable", async () => {
    const user = setup();
    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
    const onError = vi.fn();

    render(
      <EnvironmentVariable name="API_KEY" value="secret">
        <EnvironmentVariableCopyButton onError={onError} />
      </EnvironmentVariable>
    );

    await user.click(screen.getByRole("button"));
    await waitFor(() => expect(onError).toHaveBeenCalled());
  });
});
