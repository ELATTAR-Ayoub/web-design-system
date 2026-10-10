import type { ComponentDocMeta } from "@/lib/ds/docs/types";

export const meta: ComponentDocMeta = {
  name: "form",
  description:
    "The react-hook-form wiring layer over the Field primitives, binding id, aria-invalid and aria-describedby to each field so accessible wiring is a property of using it rather than something typed by hand at every call site.",
  dependencies: ["field", "source-foundation", "use-reduced-motion"],
  exports: ["Form", "FormControl", "FormDescription", "FormError", "FormField", "FormLabel", "useFormField", "useFormRecovery"],
  sourcePath: "components/ui/form.tsx",
};
