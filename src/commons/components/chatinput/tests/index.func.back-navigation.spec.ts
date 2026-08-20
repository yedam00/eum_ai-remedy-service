import { test, expect, type Page } from "@playwright/test";

const PAGE_TEST_ID = "test-chatinput2-page";
const CHAT_INPUT_TEST_ID = "chatinput";
const USER_BUBBLE_TEST_ID = "user-speech-bubble";
const USER_ICON_SLOT_TEST_ID = "user-icon-slot";
const DROPDOWN_TITLE_TEST_ID = "dropdown-title";
const DROPDOWN_POINT_TEXT_TEST_ID = "dropdown-point-text";
const CHAT_ENTRY_TEST_ID = "chat-entry-container";

const chatInput = (page: Page) =>
  page.locator(`[data-testid="${CHAT_INPUT_TEST_ID}"]`);

const messageInput = (page: Page) =>
  chatInput(page).locator('input[type="text"]');

const userBubbles = (page: Page) =>
  page.locator(`[data-testid="${USER_BUBBLE_TEST_ID}"]`);

const backButtons = (page: Page) =>
  page.locator(`[data-testid="${USER_ICON_SLOT_TEST_ID}"]`);

const waitForUiType = async (page: Page, uitype: string) => {
  await expect(chatInput(page)).toHaveAttribute("data-uitype", uitype);
};

const clickLastBackButton = async (page: Page) => {
  await backButtons(page).last().click();
};

const submitOptionTrio = async (page: Page, label = "예") => {
  await page.getByRole("button", { name: label, exact: true }).click();
  await waitForUiType(page, "vertical-select");
};

const submitVerticalSelect = async (page: Page, label = "분") => {
  await page.getByRole("button", { name: label, exact: true }).click();
  await waitForUiType(page, "medicine-search");
};

test.describe("ChatInput Func Back Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test-chatinput2");
    await page.waitForSelector(`[data-testid="${PAGE_TEST_ID}"]`);
    await page.waitForSelector(`[data-testid="${CHAT_INPUT_TEST_ID}"]`);
  });

  test("사용자 말풍선이 1개일 때 뒤로가기를 누르면 /chat-entry로 이동한다", async ({
    page,
  }) => {
    // Given: option-trio에서 답변을 제출해 사용자 말풍선이 1개인 상태
    await submitOptionTrio(page);
    await expect(userBubbles(page)).toHaveCount(1);

    // When: 말풍선 옆 뒤로가기(userIconSlot)를 클릭한다
    await clickLastBackButton(page);

    // Then: /chat-entry 화면으로 전환된다
    await expect(page).toHaveURL("/chat-entry");
    await page.waitForSelector(`[data-testid="${CHAT_ENTRY_TEST_ID}"]`);
    await expect(
      page.locator(`[data-testid="${CHAT_ENTRY_TEST_ID}"]`)
    ).toBeVisible();
  });

  test("사용자 말풍선이 2개일 때 뒤로가기를 누르면 이전 ChatInput UI가 복원된다", async ({
    page,
  }) => {
    // Given: option-trio → vertical-select까지 제출해 사용자 말풍선이 2개인 상태
    await submitOptionTrio(page);
    await submitVerticalSelect(page);
    await expect(userBubbles(page)).toHaveCount(2);
    await waitForUiType(page, "medicine-search");

    // When: 말풍선 옆 뒤로가기를 클릭한다
    await clickLastBackButton(page);

    // Then: 이전 단계인 vertical-select UI와 placeholder가 복원된다
    await waitForUiType(page, "vertical-select");
    await expect(messageInput(page)).toHaveAttribute("placeholder", "분");
  });

  test("사용자 말풍선이 2개일 때 뒤로가기를 누르면 마지막 답변이 제거되고 이전 선택 값이 남는다", async ({
    page,
  }) => {
    // Given: 두 단계 답변을 제출한 상태
    await submitOptionTrio(page);
    await submitVerticalSelect(page);
    await expect(userBubbles(page)).toHaveCount(2);

    // When: 뒤로가기를 클릭한다
    await clickLastBackButton(page);

    // Then: 사용자 말풍선은 1개이고 첫 답변 텍스트가 유지된다
    await expect(userBubbles(page)).toHaveCount(1);
    await expect(userBubbles(page).last()).toContainText("예");
  });

  test("medicine-search 선택 값을 변경한 뒤 뒤로가면 선택 상태가 복원된다", async ({
    page,
  }) => {
    // Given: medicine-search에서 당뇨약을 해제한 뒤 다음 단계로 진행한 상태
    await submitOptionTrio(page);
    await submitVerticalSelect(page);
    await page.getByRole("button", { name: "목록 펼치기" }).click();
    await expect(page.getByRole("option").first()).toBeVisible();
    await page
      .getByRole("option")
      .filter({ hasText: "당뇨약" })
      .getByRole("checkbox")
      .click();
    await expect(page.locator(`[data-testid="${DROPDOWN_TITLE_TEST_ID}"]`)).toHaveText(
      "고지혈증약"
    );
    await expect(
      page.locator(`[data-testid="${DROPDOWN_POINT_TEXT_TEST_ID}"]`)
    ).toHaveText("+2개 선택됨");

    await page.getByRole("button", { name: "다음", exact: true }).click();
    await waitForUiType(page, "pain-scale");
    await expect(userBubbles(page)).toHaveCount(3);

    // When: 뒤로가기를 클릭한다
    await clickLastBackButton(page);

    // Then: medicine-search UI와 변경했던 선택 값이 복원된다
    await waitForUiType(page, "medicine-search");
    await expect(page.locator(`[data-testid="${DROPDOWN_TITLE_TEST_ID}"]`)).toHaveText(
      "고지혈증약"
    );
    await expect(
      page.locator(`[data-testid="${DROPDOWN_POINT_TEXT_TEST_ID}"]`)
    ).toHaveText("+2개 선택됨");
    await expect(userBubbles(page)).toHaveCount(2);
  });
});
