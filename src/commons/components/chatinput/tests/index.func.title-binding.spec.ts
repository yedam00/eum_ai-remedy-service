import { test, expect, type Page } from "@playwright/test";

const PAGE_TEST_ID = "test-chatinput2-page";
const CHAT_INPUT_TEST_ID = "chatinput";
const DROPDOWN_TITLE_TEST_ID = "dropdown-title";
const DROPDOWN_POINT_TEXT_TEST_ID = "dropdown-point-text";

const EMPTY_TITLE = "복용 중인 약이 없음";

const chatInput = (page: Page) =>
  page.locator(`[data-testid="${CHAT_INPUT_TEST_ID}"]`);

const dropdownTitle = (page: Page) =>
  page.locator(`[data-testid="${DROPDOWN_TITLE_TEST_ID}"]`);

const dropdownPointText = (page: Page) =>
  page.locator(`[data-testid="${DROPDOWN_POINT_TEXT_TEST_ID}"]`);

const waitForUiType = async (page: Page, uitype: string) => {
  await expect(chatInput(page)).toHaveAttribute("data-uitype", uitype);
};

const goToMedicineSearch = async (page: Page) => {
  await page.getByRole("button", { name: "예", exact: true }).click();
  await waitForUiType(page, "vertical-select");
  await page.getByRole("button", { name: "분", exact: true }).click();
  await waitForUiType(page, "medicine-search");
};

const expandDropdown = async (page: Page) => {
  await page.getByRole("button", { name: "목록 펼치기" }).click();
  await expect(page.getByRole("option").first()).toBeVisible();
};

const toggleMedicine = async (page: Page, label: string) => {
  await page
    .getByRole("option")
    .filter({ hasText: label })
    .getByRole("checkbox")
    .click();
};

test.describe("ChatInput Func Title Binding", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test-chatinput2");
    await page.waitForSelector(`[data-testid="${PAGE_TEST_ID}"]`);
    await page.waitForSelector(`[data-testid="${CHAT_INPUT_TEST_ID}"]`);
  });

  test("medicine-search 초기 타이틀은 선택된 첫 항목이고 뱃지는 나머지 개수다", async ({
    page,
  }) => {
    // Given: option-trio 화면이 로드된 상태
    // When: medicine-search까지 전환한다
    await goToMedicineSearch(page);

    // Then: 선택된 4개 중 첫 항목 "당뇨약"과 +3개 선택됨 뱃지가 노출된다
    await expect(dropdownTitle(page)).toHaveText("당뇨약");
    await expect(dropdownPointText(page)).toHaveText("+3개 선택됨");
  });

  test("당뇨약 해제 시 고지혈증약 +1개 선택됨으로 전환된다", async ({
    page,
  }) => {
    // Given: medicine-search에서 목록이 펼쳐진 상태
    await goToMedicineSearch(page);
    await expandDropdown(page);

    // When: 진통제를 해제한 뒤 대표 항목인 당뇨약을 해제한다
    await toggleMedicine(page, "진통제");
    await expect(dropdownTitle(page)).toHaveText("당뇨약");
    await expect(dropdownPointText(page)).toHaveText("+2개 선택됨");

    await toggleMedicine(page, "당뇨약");

    // Then: 타이틀이 고지혈증약으로 바뀌고 뱃지가 +1개 선택됨이다
    await expect(dropdownTitle(page)).toHaveText("고지혈증약");
    await expect(dropdownPointText(page)).toHaveText("+1개 선택됨");
  });

  test("선택된 항목이 0개이면 기본 안내문이 노출되고 뱃지는 숨겨진다", async ({
    page,
  }) => {
    // Given: medicine-search에서 목록이 펼쳐진 상태
    await goToMedicineSearch(page);
    await expandDropdown(page);

    // When: 선택된 약을 모두 해제한다
    await toggleMedicine(page, "당뇨약");
    await toggleMedicine(page, "고지혈증약");
    await toggleMedicine(page, "고혈압약");
    await toggleMedicine(page, "진통제");

    // Then: 기본 안내문이 노출되고 뱃지는 없다
    await expect(dropdownTitle(page)).toHaveText(EMPTY_TITLE);
    await expect(dropdownPointText(page)).toHaveCount(0);
  });

  test("선택된 항목이 1개이면 해당 항목명이 타이틀이고 뱃지는 숨겨진다", async ({
    page,
  }) => {
    // Given: medicine-search에서 목록이 펼쳐진 상태
    await goToMedicineSearch(page);
    await expandDropdown(page);

    // When: 당뇨약만 남기고 나머지를 해제한다
    await toggleMedicine(page, "고지혈증약");
    await toggleMedicine(page, "고혈압약");
    await toggleMedicine(page, "진통제");

    // Then: 타이틀은 당뇨약이고 뱃지는 숨겨진다
    await expect(dropdownTitle(page)).toHaveText("당뇨약");
    await expect(dropdownPointText(page)).toHaveCount(0);
  });

  test("항목을 다시 선택하면 타이틀과 뱃지가 즉시 반영된다", async ({
    page,
  }) => {
    // Given: 모든 약이 해제된 상태
    await goToMedicineSearch(page);
    await expandDropdown(page);
    await toggleMedicine(page, "당뇨약");
    await toggleMedicine(page, "고지혈증약");
    await toggleMedicine(page, "고혈압약");
    await toggleMedicine(page, "진통제");
    await expect(dropdownTitle(page)).toHaveText(EMPTY_TITLE);

    // When: 고지혈증약과 당뇨약을 다시 선택한다
    await toggleMedicine(page, "고지혈증약");
    await expect(dropdownTitle(page)).toHaveText("고지혈증약");
    await expect(dropdownPointText(page)).toHaveCount(0);

    await toggleMedicine(page, "당뇨약");

    // Then: 배열 첫 선택 항목(당뇨약)이 타이틀이고 뱃지는 +1개 선택됨이다
    await expect(dropdownTitle(page)).toHaveText("당뇨약");
    await expect(dropdownPointText(page)).toHaveText("+1개 선택됨");
  });
});
