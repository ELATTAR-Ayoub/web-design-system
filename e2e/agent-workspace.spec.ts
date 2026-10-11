import { expect, test, type Page } from "@playwright/test";

/**
 * Walks all 7 conversations of the `agent-workspace` catalog page beat by
 * beat, driving the real controls the rebuilt workspace wires to the mock
 * transport (`lib/agent/mock-transport.ts` — `CONVERSATIONS`). Every send,
 * typed or a Suggestion, advances the conversation one beat, and the answer
 * ends with the NEXT beat's prompt as a Suggestion button — so each test
 * presses the starter, then presses whichever Suggestion appears.
 *
 * Selector assumptions (the brief's accessible roles and visible text,
 * reconciled against the rebuilt UI):
 *  - Suggestions are buttons named exactly the beat's prompt.
 *  - The conversation picker is a combobox labelled "Conversation" (Select).
 *  - Buttons: "Run plan", "Approve", "Reject", "Pause", "Resume", "Cancel",
 *    "Undo changes", "Summarise", "Restore", "View as workflow", "Retry".
 *  - The composer is a textbox named "Message".
 *  - High-risk approvals show a text field labelled with "code" and a button
 *    "Verify and approve"; the wrong code is 000000, which shows an alert.
 *  - Queue rows are text inside the region/list labelled "Queue"; each row
 *    has buttons "Send now" and "Remove".
 *  - The history Sidebar's toggle is a button named "Collapse sidebar" /
 *    "Expand sidebar" (SidebarTrigger); rows are buttons named by their
 *    title, each with a "Actions for <title>" menu button.
 *  - The context ring is a button named /Context window, N% used/.
 *  - Everything is scoped to `#preview` (the "State atlas" section repeats
 *    some accessible names with inert, static copies).
 *
 * `?speed=4` shrinks scripted waits but leaves the deliberately long (5s)
 * "Also reindex search" step long enough to press Cancel mid-step.
 */

const BEATS = {
  chat: [
    "Explain how the new pricing model works",
    "Show me a code example",
    "Here's a screenshot and the spec, take a look",
  ],
  tools: [
    "Search the codebase and run the tests",
    "Run the build",
    "Now deploy it",
    "Run the database migration",
    "Make a hero image for the release",
    "Write up the release notes",
    "Put together a quick demo page",
    "Run a quick calculation",
  ],
  planning: ["Plan the Q3 launch", "Actually, undo that"],
  approvals: [
    "Rotate the production API key",
    "Now wire the vendor payment",
    "Also raise the campaign budget, take your time",
    "Reorganize the folders while you're at it",
    "Set up the webhook integration",
  ],
  runControl: ["Migrate the database, this will take a while", "Also reindex search", "Restore the reindex from its checkpoint"],
  recovery: ["Sync my calendar", "Now sync both warehouses", "Rebuild the search index", "Cancel my flight booking"],
  longSession: [
    "Let's keep working on the quarterly report",
    "What model and tools do you have?",
    "Remind me to call the vendor tomorrow",
  ],
} as const;

const preview = (page: Page) => page.locator("#preview");
/** The Conversation — AI Elements renders it as role="log". */
const thread = (page: Page) => preview(page).getByRole("log");

async function gotoWorkspace(page: Page) {
  await page.goto("/design-system/components/agent-workspace?speed=4");
  await expect(page.getByRole("heading", { name: "Preview" })).toBeVisible();
}

/** Picks a conversation from the picker (remounts the workspace fresh). */
async function pick(page: Page, title: string) {
  await preview(page).getByRole("combobox", { name: "Conversation" }).click();
  await page.getByRole("option", { name: title }).click();
}

/** Presses the Suggestion offering this beat's prompt. */
async function beat(page: Page, prompt: string) {
  // Scoped to the thread: the demo history titles each row with a starter.
  const suggestion = thread(page).getByRole("button", { name: prompt, exact: true });
  await expect(suggestion).toBeVisible({ timeout: 15_000 });
  // A sent suggestion leaves the thread. A press that lands while the reply above
  // re-renders can miss, so press until it is gone.
  await expect(async () => {
    if (await suggestion.count()) await suggestion.click({ timeout: 2_000 });
    await expect(suggestion).toHaveCount(0, { timeout: 2_000 });
  }).toPass({ timeout: 15_000 });
}

// A beat can take several seconds of scripted work under a loaded run.
const reply = (page: Page, text: string | RegExp) =>
  expect(preview(page).getByText(text).first()).toBeVisible({ timeout: 15_000 });

test.describe("the 7 conversations", () => {
  // Each test walks a whole multi-beat conversation; the 30s default is for single steps.
  test.describe.configure({ timeout: 120_000 });
  test.beforeEach(async ({ page }) => {
    await gotoWorkspace(page);
  });

  test("the picker lists all seven", async ({ page }) => {
    await preview(page).getByRole("combobox", { name: "Conversation" }).click();
    for (const title of ["Chat", "Tools", "Planning", "Approvals", "Run control", "Recovery", "Long session"]) {
      await expect(page.getByRole("option", { name: title })).toBeVisible();
    }
  });

  test("1 Chat: sources, code, attachments, edit, regenerate, restore", async ({ page }) => {
    await pick(page, "Chat");
    await beat(page, BEATS.chat[0]);
    await reply(page, /bills per seat/);
    await expect(thread(page).getByText(/Used \d+ sources/).first()).toBeVisible({ timeout: 15_000 });
    await beat(page, BEATS.chat[1]);
    await reply(page, /function price/);
    // Edit your message: branch 1/2 -> 2/2.
    await preview(page).getByRole("button", { name: "Edit message" }).first().click();
    await preview(page).getByRole("textbox", { name: "Edit your message" }).fill("Make it shorter");
    await preview(page).getByRole("button", { name: "Save and resend" }).click();
    await reply(page, "2 of 2");
    // Regenerate branches the answer.
    await preview(page).getByRole("button", { name: "Regenerate" }).last().click();
    await reply(page, /another way to put it/);
    // Attach an image + a PDF, then send the last beat.
    await preview(page).locator('input[type="file"]').setInputFiles([
      { name: "shot.png", mimeType: "image/png", buffer: Buffer.from("png") },
      { name: "spec.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4") },
    ]);
    await beat(page, BEATS.chat[2]);
    await reply(page, /shot\.png/);
    await reply(page, /spec\.pdf/);
    // The checkpoint offers Restore.
    await expect(thread(page).getByRole("button", { name: /^Restore to / }).first()).toBeVisible({ timeout: 15_000 });
  });

  test("2 Tools: search, tests, terminal, retry, crash, image, artifact, previews, sandbox", async ({ page }) => {
    await pick(page, "Tools");
    await beat(page, BEATS.tools[0]);
    // A finished chain of steps collapses; once the answer is in, open it to see the search chips.
    await reply(page, /Found the billing module/);
    // Finished = its actions are showing; only then has the chain closed itself.
    await expect(thread(page).getByRole("button", { name: "Copy reply" }).first()).toBeVisible();
    await thread(page).getByRole("button", { name: /Worked through/ }).first().click();
    await reply(page, /billing\/price\.ts/);
    await reply(page, /3 passed|passed/);
    await beat(page, BEATS.tools[1]);
    await reply(page, /Compiling 42 modules/);
    await beat(page, BEATS.tools[2]);
    await reply(page, /Deployed on the second try/);
    await beat(page, BEATS.tools[3]);
    await reply(page, /migrate\.ts:42/);
    await preview(page).getByRole("button", { name: "Retry" }).last().click();
    await reply(page, /ran cleanly/);
    await beat(page, BEATS.tools[4]);
    await expect(preview(page).getByRole("img").first()).toBeVisible();
    await beat(page, BEATS.tools[5]);
    await reply(page, /Release notes 3\.2\.0/);
    await beat(page, BEATS.tools[6]);
    await reply(page, /Preview is live/);
    await beat(page, BEATS.tools[7]);
    await reply(page, /Overage calculator/);
  });

  test("3 Planning: plan, workflow, run, ask, outputs, undo", async ({ page }) => {
    await pick(page, "Planning");
    await beat(page, BEATS.planning[0]);
    await reply(page, "Draft the launch brief");
    await preview(page).getByRole("button", { name: "View as workflow" }).click();
    await page.keyboard.press("Escape");
    await thread(page).getByRole("button", { name: "Run plan" }).last().click();
    // The low-confidence step asks before going on.
    await preview(page).getByRole("button", { name: "Verify" }).click();
    await reply(page, /CHANGELOG\.md/);
    await reply(page, "a1b2c3d");
    await reply(page, /@app\/release/);
    // Undo changes reverts the commit's effect, inline in the same reply.
    await thread(page).getByRole("button", { name: "Undo changes" }).click();
    await reply(page, "Changes undone");
    // The next beat asks for the same in words, and the agent confirms it.
    await beat(page, BEATS.planning[1]);
    await reply(page, /Reverted the changelog/);
  });

  test("4 Approvals: approve, reject path, code, expiry, stale, secret", async ({ page }) => {
    await pick(page, "Approvals");
    await beat(page, BEATS.approvals[0]);
    await preview(page).getByRole("button", { name: "Approve" }).click();
    await beat(page, BEATS.approvals[1]);
    const code = preview(page).getByLabel("Approval code");
    await code.fill("000000");
    await preview(page).getByRole("button", { name: "Approve", exact: true }).click();
    await expect(preview(page).getByRole("alert")).toBeVisible();
    await code.fill("123456");
    await preview(page).getByRole("button", { name: "Approve", exact: true }).click();
    await reply(page, /payment is wired/);
    await beat(page, BEATS.approvals[2]);
    await reply(page, /expired/);
    await thread(page).getByRole("button", { name: "Run plan" }).last().click();
    await beat(page, BEATS.approvals[3]);
    await thread(page).getByRole("button", { name: "Run plan" }).last().click();
    await beat(page, BEATS.approvals[4]);
    // The secret beat is a reply like any other: the same 15s budget as reply().
    await expect(thread(page).getByText("WEBHOOK_SECRET", { exact: true }).last()).toBeVisible({ timeout: 15_000 });
  });

  test("5 Run control: pause, queue, resume, cancel, restore", async ({ page }) => {
    await pick(page, "Run control");
    await beat(page, BEATS.runControl[0]);
    // Run controls live in the reply while the thread is still easing to the bottom; dispatch the click (see Cancel).
    await thread(page).getByRole("button", { name: "Pause" }).last().dispatchEvent("click");
    await expect(preview(page).getByRole("button", { name: "Resume" })).toBeVisible();
    const composer = preview(page).getByRole("textbox", { name: "Message" });
    await composer.fill("and then this");
    await composer.press("Enter");
    await expect(preview(page).getByText("and then this")).toBeVisible();
    await thread(page).getByRole("button", { name: "Resume" }).last().dispatchEvent("click");
    await reply(page, /Migration finished/);
    await beat(page, BEATS.runControl[1]);
    // Cancel after the backup step's checkpoint exists — cancelling earlier leaves nothing to restore.
    await expect(thread(page).getByRole("button", { name: /^Restore to After the index backup/ })).toBeVisible({ timeout: 15_000 });
    // The thread keeps easing to the bottom while the run updates, so the button never reads
    // as "stable" inside the step's 5s window (a person can press it); dispatch the click.
    await thread(page).getByRole("button", { name: "Cancel" }).last().dispatchEvent("click");
    await reply(page, /Stopped|cancelled/i);
    await beat(page, BEATS.runControl[2]);
    await thread(page).getByRole("button", { name: /^Restore to / }).last().click();
    await reply(page, /Restored to "After the index backup"/);
  });

  test("6 Recovery: reconnect, partial failure, fatal retry, hand off", async ({ page }) => {
    await pick(page, "Recovery");
    await beat(page, BEATS.recovery[0]);
    await reply(page, /Calendar synced/);
    await beat(page, BEATS.recovery[1]);
    await thread(page).getByRole("button", { name: "Retry: Sync warehouse B" }).click();
    await reply(page, "Done");
    await beat(page, BEATS.recovery[2]);
    await preview(page).getByRole("button", { name: "Retry" }).last().click();
    await reply(page, /worked this time/);
    await beat(page, BEATS.recovery[3]);
    await thread(page).getByText("Support team", { exact: true }).click();
    await thread(page).getByLabel("Note for the owner").fill("needs airline access");
    await thread(page).getByRole("button", { name: "Hand off", exact: true }).click();
    await reply(page, /needs airline access/);
  });

  test("7 Long session: summarise, about this agent, dictation reply", async ({ page }) => {
    await pick(page, "Long session");
    await beat(page, BEATS.longSession[0]);
    // Near the limit the composer offers Summarise beside the context meter.
    await preview(page).getByRole("button", { name: "Summarise" }).click();
    await reply(page, /Summary:/);
    await beat(page, BEATS.longSession[1]);
    await beat(page, BEATS.longSession[2]);
    await reply(page, /Reminder set for tomorrow/);
  });

  test("history: open, new chat, archive, delete with confirm and undo", async ({ page }) => {
    const history = preview(page);
    // On a narrow screen the Sidebar is a Sheet behind the trigger.
    const expand = history.getByRole("button", { name: "Expand sidebar" });
    if ((page.viewportSize()?.width ?? 1280) < 768) await expand.click();
    for (const group of ["Today", "Yesterday", "Previous 7 days", "Older"]) {
      await expect(page.locator("[data-slot=sidebar]").getByText(group, { exact: true }).first()).toBeVisible();
    }
    const row = page.locator("[data-sidebar=menu-button]", { hasText: "Sync my calendar" });
    await row.click();
    // On a phone, picking a conversation closes the Sheet (as Claude does); open it again.
    const phone = (page.viewportSize()?.width ?? 1280) < 768;
    if (phone) await expand.click();
    // On a phone the Sidebar is a Sheet outside #preview; the row itself carries the state.
    await expect(row).toHaveAttribute("data-active", "true");
    await page.getByRole("button", { name: "Actions for Sync my calendar" }).click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    const confirm = page.getByRole("alertdialog", { name: "Delete this conversation?" });
    await expect(confirm).toBeVisible();
    await confirm.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText("Conversation deleted")).toBeVisible();
    await page.locator("[data-sonner-toast]").getByRole("button", { name: "Undo" }).first().click();
    // A toast is not "outside" the phone Sheet: answering it leaves the Sheet open.
    await expect(row).toBeVisible();
    await page.getByRole("button", { name: "Actions for Sync my calendar" }).click();
    await page.getByRole("menuitem", { name: "Archive" }).click();
    // The thread may still show the same words as its starter; the row itself is gone from the sidebar.
    await expect(page.locator("[data-sidebar=menu-button]", { hasText: "Sync my calendar" })).toHaveCount(0);
    await page.getByRole("button", { name: "New chat" }).click();
  });
});
