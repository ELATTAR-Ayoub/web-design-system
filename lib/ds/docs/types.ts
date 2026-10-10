export type ComponentDocMeta = {
  readonly name: string;
  readonly description: string;
  readonly dependencies: readonly string[];
  readonly exports: readonly string[];
  readonly sourcePath: string | null;
  readonly showInRail?: boolean;
};
