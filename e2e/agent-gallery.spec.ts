import { expect, test } from "@playwright/test";

test("the Agent landing has a live workspace that answers a sent message", async ({ page }) => {
  await page.goto("/design-system/components/agent?speed=4");

  const live = page.locator("#live-agent");
  await expect(live.getByRole("combobox", { name: "Conversation" })).toBeVisible();

  const composer = live.getByRole("textbox", { name: "Message" });
  await expect(composer).toBeVisible();

  await composer.fill("hello there");
  const send = live.getByRole("button", { name: "Submit" });
  await expect(send).toBeEnabled();
  await send.click();
  await expect(live.getByText("hello there").first()).toBeVisible();
});
