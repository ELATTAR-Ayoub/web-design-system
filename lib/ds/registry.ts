import commandsJson from "@/public/r/commands.json";
import indexJson from "@/public/r/index.json";

export type RegistryCommands = Record<string, string>;

export type RegistryItem = {
  name: string;
  type: string;
  title: string;
  description: string;
  endpoint: string;
  addCommand: string;
};

export type RegistryIndex = {
  name: string;
  homepage: string;
  registryUrl: string;
  items: RegistryItem[];
};

export function readRegistryCommands(): RegistryCommands {
  return (commandsJson as RegistryCommands) ?? {};
}

export function readRegistryIndex(): RegistryIndex | null {
  return (indexJson as RegistryIndex) ?? null;
}

export function commandFor(name: string): string {
  const commands = readRegistryCommands();
  return commands[name] ?? `npx shadcn@latest add ${name}`;
}
