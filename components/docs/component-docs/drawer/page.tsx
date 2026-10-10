import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Meta, Row } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "drawer",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "The mobile bottom sheet. Draggable, and the correct container for card actions on a phone where a Dialog would feel oversized.",
      render: (
        <Row>
          {/* NO `defaultOpen`, and `modal={false}` does not rescue it.
              Measured on this page with `<Drawer defaultOpen modal={false}>`:
              the body still computed `pointer-events: none`, because vaul sets
              it on mount and only restores it when the drawer closes — so the
              article could not be scrolled and no other section was reachable.
              Reading vaul's source suggested otherwise; the browser settled
              it. The trigger below opens the real component, which is the
              behaviour this section is for. */}
          {/* A phone-width card row with its actions trigger — the shape a
              drawer is for. The drawer itself opens from the trigger. */}
          <div className="flex w-full max-w-xs items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3">
            <div className="min-w-0">
              <p className="type-body truncate text-foreground">Voidwing Ascendant</p>
              <p className="type-small text-muted-foreground">#044 · Legendary</p>
            </div>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="secondary">Card actions</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Voidwing Ascendant</DrawerTitle>
                <DrawerDescription>
                  Eclipse Vault · #044 · Legendary · Estimated $1,240.00
                </DrawerDescription>
              </DrawerHeader>
              <DrawerBody className="grid gap-2">
                <Button variant="premium">Sell for $1,240.00</Button>
                <Button variant="secondary">Add to Shipment</Button>
                <Button variant="outline">Inspect Card</Button>
              </DrawerBody>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="ghost">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          </div>
        </Row>
      ),
      source: `<Drawer>
  <DrawerTrigger asChild>
    <Button variant="secondary">Card actions</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Voidwing Ascendant</DrawerTitle>
      <DrawerDescription>
        Eclipse Vault · #044 · Legendary · Estimated $1,240.00
      </DrawerDescription>
    </DrawerHeader>
    <DrawerBody className="grid gap-2">
      <Button variant="premium">Sell for $1,240.00</Button>
      <Button variant="secondary">Add to Shipment</Button>
      <Button variant="outline">Inspect Card</Button>
    </DrawerBody>
    <DrawerFooter>
      <DrawerClose asChild>
        <Button variant="ghost">Close</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Put content in DrawerBody, not directly between the header and footer. DrawerContent caps at 80vh, and without DrawerBody's min-h-0 flex-1 overflow-y-auto a tall body is clipped and takes the footer's actions with it.",
      language: "tsx",
      code: `import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export function CardActionsDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary">Card actions</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Voidwing Ascendant</DrawerTitle>
          <DrawerDescription>Eclipse Vault · #044</DrawerDescription>
        </DrawerHeader>
        <DrawerBody className="grid gap-2">
          <Button variant="premium">Sell for $1,240.00</Button>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "Drawer wraps vaul's Drawer.Root directly rather than a Radix primitive — the only overlay in this family that does. Dragging and the direction-aware slide come from vaul, not from anything this repository wrote.",
      blocks: [
        {
          label: "Drawer / DrawerTrigger / DrawerPortal / DrawerClose",
          body: (
            <Meta
              items={[
                {
                  k: "Drawer",
                  v: "Forwards every prop to vaul's DrawerPrimitive.Root — open, onOpenChange, direction (defaults to \"bottom\"), dismissible, snapPoints, and vaul's other drag-tuning props.",
                },
                { k: "DrawerTrigger", v: "vaul DrawerPrimitive.Trigger. Pass asChild to use an existing element as the trigger." },
                { k: "DrawerClose", v: "vaul DrawerPrimitive.Close. asChild lets any element dismiss the drawer on click." },
                { k: "DrawerPortal / DrawerOverlay", v: "Rendered internally by DrawerContent; exported for a consumer composing a non-standard layout." },
              ]}
            />
          ),
        },
        {
          label: "DrawerContent",
          body: (
            <Meta
              items={[
                {
                  k: "(no side/direction prop on the styled wrapper)",
                  v: "This component styles only the bottom direction fully by data attribute selectors (data-[vaul-drawer-direction=…]); pass direction to the underlying Drawer root to change it, and vaul reflects it back onto the content as that data attribute.",
                },
                {
                  k: "...props",
                  v: "Every vaul DrawerPrimitive.Content prop, forwarded directly.",
                },
              ]}
            />
          ),
        },
        {
          label: "DrawerHeader / DrawerBody / DrawerFooter",
          body: (
            <Meta
              items={[
                { k: "DrawerHeader", v: "React.ComponentProps<\"div\">. Centred text on the bottom/top directions, left-aligned on desktop widths." },
                {
                  k: "DrawerBody",
                  v: "React.ComponentProps<\"div\">. min-h-0 flex-1 overflow-y-auto — the only scrolling zone, and a real DOM child rather than the content root itself, because vaul reads scroll position on that child to decide whether a drag should dismiss the drawer or scroll its content.",
                },
                { k: "DrawerFooter", v: "React.ComponentProps<\"div\">. mt-auto flex shrink-0, pinned to the bottom." },
              ]}
            />
          ),
        },
        {
          label: "DrawerTitle / DrawerDescription",
          body: (
            <Meta
              items={[
                { k: "DrawerTitle", v: "vaul DrawerPrimitive.Title. Required for the same aria-labelledby wiring as every other overlay's title, even when visually redundant." },
                { k: "DrawerDescription", v: "vaul DrawerPrimitive.Description. Supplies aria-describedby when present." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description:
        "vaul builds on the same Dialog-primitive accessibility contract Radix Dialog implements — a modal role, a focus trap, and ARIA relationships between trigger, title and description — plus drag-to-dismiss.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Role", v: "role=\"dialog\" with aria-modal=\"true\"." },
                {
                  k: "Accessible name / description",
                  v: "aria-labelledby / aria-describedby, pointed at DrawerTitle and DrawerDescription automatically. DrawerTitle is required even when visually redundant with content already on the drawer.",
                },
                {
                  k: "Focus management",
                  v: "On open, focus moves into the content and is trapped there; it returns to the trigger on close.",
                },
                {
                  k: "Dismissal",
                  v: "Escape, a click on the overlay, and a drag past the dismiss threshold all close the drawer, plus any explicit DrawerClose control.",
                },
                {
                  k: "Drag handle",
                  v: "The small pill at the top of a bottom drawer (hidden on other directions) is decorative — it is not itself a focusable control; drag-to-dismiss is a pointer/touch gesture, with Escape as the keyboard equivalent.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "keyboard",
      title: "Keyboard",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Enter / Space", v: "Activates the trigger, opening the drawer." },
                { k: "Tab / Shift+Tab", v: "Cycles focus among the drawer's own focusable elements only." },
                { k: "Escape", v: "Closes the drawer and returns focus to the trigger — the keyboard equivalent of dragging it shut." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "responsive",
      title: "Responsive",
      description: "The bottom direction — the only one this component's own styles fully cover — is intrinsically mobile-shaped.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "All viewports (bottom direction)", v: "max-h-[80vh], so the drawer never exceeds four fifths of the viewport height regardless of content length — DrawerBody's scroll is what handles the rest." },
                { k: "Left / right directions", v: "data-[vaul-drawer-direction=left/right]:sm:max-w-sm caps width on wider viewports, matching Sheet's own left/right cap." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [
        { body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> },
      ],
    },
  ],
};
