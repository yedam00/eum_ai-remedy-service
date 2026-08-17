import { test, expect, type Page } from "@playwright/test";
import path from "path";

const PAGE_TEST_ID = "test-chatinput2-page";
const CHAT_INPUT_TEST_ID = "chatinput";
const USER_BUBBLE_TEST_ID = "user-speech-bubble";
const IMAGE_PATH = path.join(
  __dirname,
  "../../../../../public/images/level1.png"
);

const CHECKLIST_SELECTED_LABEL = "가슴이 답답하거나 통증이 있다";

const chatInput = (page: Page) =>
  page.locator(`[data-testid="${CHAT_INPUT_TEST_ID}"]`);

const messageInput = (page: Page) =>
  chatInput(page).locator('input[type="text"]');

const userBubbles = (page: Page) =>
  page.locator(`[data-testid="${USER_BUBBLE_TEST_ID}"]`);

const lastUserBubble = (page: Page) => userBubbles(page).last();

const waitForUiType = async (page: Page, uitype: string) => {
  await expect(chatInput(page)).toHaveAttribute("data-uitype", uitype);
};

const submitOptionTrio = async (page: Page, label = "예") => {
  await page.getByRole("button", { name: label, exact: true }).click();
  await waitForUiType(page, "vertical-select");
};

const submitVerticalSelect = async (page: Page, label = "분") => {
  await page.getByRole("button", { name: label, exact: true }).click();
  await waitForUiType(page, "medicine-search");
};

const submitMedicineSearch = async (page: Page) => {
  await page.getByRole("button", { name: "다음", exact: true }).click();
  await waitForUiType(page, "pain-scale");
};

const submitPainScale = async (page: Page) => {
  await chatInput(page).locator('img[alt="조금 아프다 1~2"]').click();
  await waitForUiType(page, "checkbox-list");
};

const submitCheckboxList = async (page: Page) => {
  await page.getByRole("checkbox", { name: CHECKLIST_SELECTED_LABEL }).click();
  await page.getByRole("button", { name: "다음", exact: true }).click();
  await waitForUiType(page, "file-upload");
};

test.describe("ChatInput Func Binding", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test-chatinput2");
    await page.waitForSelector(`[data-testid="${PAGE_TEST_ID}"]`);
    await page.waitForSelector(`[data-testid="${CHAT_INPUT_TEST_ID}"]`);
  });

  test("option-trio 렌더 시 messageinput placeholder가 첫 번째 선택지와 일치한다", async ({
    page,
  }) => {
    // Given: option-trio 화면이 로드된 상태
    await waitForUiType(page, "option-trio");

    // When: messageinput placeholder를 확인한다
    // Then: 첫 번째 선택지 "예"와 일치한다
    await expect(messageInput(page)).toHaveAttribute("placeholder", "예");
  });

  test("option-trio 답변 버튼 클릭 시 user SpeechBubble이 노출된다", async ({
    page,
  }) => {
    // Given: option-trio가 렌더된 상태
    // When: "예" 버튼을 클릭한다
    await page.getByRole("button", { name: "예", exact: true }).click();

    // Then: user SpeechBubble에 "예"가 노출된다
    const bubble = lastUserBubble(page);
    await expect(bubble).toBeVisible();
    await expect(bubble).toHaveAttribute("data-variant", "user");
    await expect(bubble).toHaveAttribute("data-has-image", "false");
    await expect(bubble).toContainText("예");
  });

  test("option-trio 제출 후 vertical-select로 전환되고 placeholder가 갱신된다", async ({
    page,
  }) => {
    // Given: option-trio 상태
    // When: 답변을 제출한다
    await submitOptionTrio(page);

    // Then: vertical-select placeholder가 "분"으로 갱신된다
    await expect(messageInput(page)).toHaveAttribute("placeholder", "분");
  });

  test("vertical-select 답변 버튼 클릭 시 user SpeechBubble이 노출된다", async ({
    page,
  }) => {
    // Given: vertical-select까지 전환된 상태
    await submitOptionTrio(page);

    // When: "분" 버튼을 클릭한다
    await page.getByRole("button", { name: "분", exact: true }).click();

    // Then: user SpeechBubble에 "분"이 노출된다
    const bubble = lastUserBubble(page);
    await expect(bubble).toHaveAttribute("data-variant", "user");
    await expect(bubble).toContainText("분");
  });

  test("vertical-select 제출 후 medicine-search로 전환된다", async ({
    page,
  }) => {
    // Given: option-trio 상태
    // When: vertical-select까지 제출한다
    await submitOptionTrio(page);
    await submitVerticalSelect(page);

    // Then: medicine-search로 전환되어 messageinput이 없다
    await expect(messageInput(page)).toHaveCount(0);
  });

  test("medicine-search 다음 버튼 클릭 시 선택된 약물이 user SpeechBubble로 바인딩된다", async ({
    page,
  }) => {
    // Given: medicine-search까지 전환된 상태
    await submitOptionTrio(page);
    await submitVerticalSelect(page);

    // When: 다음 버튼을 클릭한다
    await page.getByRole("button", { name: "다음", exact: true }).click();

    // Then: 선택된 약물이 user SpeechBubble에 바인딩된다
    const bubble = lastUserBubble(page);
    await expect(bubble).toHaveAttribute("data-variant", "user");
    await expect(bubble).toContainText("당뇨약");
  });

  test("medicine-search 제출 후 pain-scale placeholder가 첫 번째 선택지와 일치한다", async ({
    page,
  }) => {
    // Given: medicine-search까지 전환된 상태
    // When: 다음 단계로 제출한다
    await submitOptionTrio(page);
    await submitVerticalSelect(page);
    await submitMedicineSearch(page);

    // Then: pain-scale placeholder가 첫 번째 선택지와 일치한다
    await expect(messageInput(page)).toHaveAttribute(
      "placeholder",
      "조금 아프다"
    );
  });

  test("pain-scale 이미지 선택 시 user SpeechBubble이 노출된다", async ({
    page,
  }) => {
    // Given: pain-scale까지 전환된 상태
    await submitOptionTrio(page);
    await submitVerticalSelect(page);
    await submitMedicineSearch(page);

    // When: 통증 척도 이미지를 선택한다
    await chatInput(page).locator('img[alt="조금 아프다 1~2"]').click();

    // Then: user SpeechBubble에 통증 텍스트가 노출된다
    const bubble = lastUserBubble(page);
    await expect(bubble).toHaveAttribute("data-variant", "user");
    await expect(bubble).toContainText("조금 아프다");
  });

  test("pain-scale 제출 후 checkbox-list placeholder가 첫 번째 선택지와 일치한다", async ({
    page,
  }) => {
    // Given: pain-scale까지 전환된 상태
    // When: 다음 단계로 제출한다
    await submitOptionTrio(page);
    await submitVerticalSelect(page);
    await submitMedicineSearch(page);
    await submitPainScale(page);

    // Then: checkbox-list placeholder가 첫 번째 선택지와 일치한다
    await expect(messageInput(page)).toHaveAttribute(
      "placeholder",
      "어지럽거나 속이 메스껍고, 토할 것 같다"
    );
  });

  test("checkbox-list 다음 버튼 클릭 시 선택된 항목이 user SpeechBubble로 바인딩된다", async ({
    page,
  }) => {
    // Given: checkbox-list까지 전환된 상태
    await submitOptionTrio(page);
    await submitVerticalSelect(page);
    await submitMedicineSearch(page);
    await submitPainScale(page);

    // When: 항목을 선택하고 다음을 클릭한다
    await page.getByRole("checkbox", { name: CHECKLIST_SELECTED_LABEL }).click();
    await page.getByRole("button", { name: "다음", exact: true }).click();

    // Then: 선택 항목이 user SpeechBubble에 바인딩된다
    const bubble = lastUserBubble(page);
    await expect(bubble).toHaveAttribute("data-variant", "user");
    await expect(bubble).toContainText(CHECKLIST_SELECTED_LABEL);
  });

  test("checkbox-list 제출 후 file-upload로 전환된다", async ({ page }) => {
    // Given: checkbox-list까지 전환된 상태
    // When: 다음 단계로 제출한다
    await submitOptionTrio(page);
    await submitVerticalSelect(page);
    await submitMedicineSearch(page);
    await submitPainScale(page);
    await submitCheckboxList(page);

    // Then: file-upload 드롭존이 노출된다
    await expect(page.locator('[data-testid="file-dropzone"]')).toBeVisible();
  });

  test("이미지를 선택해 전송하면 user SpeechBubble이 hasImage 상태로 이미지가 독립 바인딩된다", async ({
    page,
  }) => {
    // Given: file-upload까지 전환된 상태
    await submitOptionTrio(page);
    await submitVerticalSelect(page);
    await submitMedicineSearch(page);
    await submitPainScale(page);
    await submitCheckboxList(page);

    const imagePath2 = path.join(
      __dirname,
      "../../../../../public/images/level2.png"
    );

    // When: 서로 다른 이미지 2장을 선택해 전송한다
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator('[data-testid="file-dropzone"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([IMAGE_PATH, imagePath2]);

    await expect(
      page.locator('[data-testid="multi-upload-filled-container"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="file-preview-item"]')).toHaveCount(
      2
    );

    await page.getByRole("button", { name: "다음", exact: true }).click();

    // Then: hasImage user SpeechBubble에 이미지가 슬롯별로 독립 바인딩된다
    const bubble = page.locator(
      `[data-testid="${USER_BUBBLE_TEST_ID}"][data-variant="user"][data-has-image="true"]`
    );
    await expect(bubble).toBeVisible();
    await expect(bubble).toHaveAttribute("data-image-count", "2");

    const filledSlots = bubble.locator(
      '[data-testid="user-image-slot"][data-filled="true"]'
    );
    await expect(filledSlots).toHaveCount(2);
    await expect(bubble.locator('[data-testid="user-image-slot"]')).toHaveCount(
      2
    );
    await expect(filledSlots.nth(0).locator("img")).toBeVisible();
    await expect(filledSlots.nth(1).locator("img")).toBeVisible();

    const src0 = await filledSlots.nth(0).locator("img").getAttribute("src");
    const src1 = await filledSlots.nth(1).locator("img").getAttribute("src");
    expect(src0).toBeTruthy();
    expect(src1).toBeTruthy();
    expect(src0).not.toBe(src1);
  });

  test("user SpeechBubble은 대화 영역 우측에 정렬된다", async ({ page }) => {
    // Given: option-trio가 로드된 상태
    // When: 답변을 제출해 user SpeechBubble을 추가한다
    await page.getByRole("button", { name: "예", exact: true }).click();

    const area = page.locator('[data-testid="conversation-area"]');
    const bubble = lastUserBubble(page);
    await expect(bubble).toBeVisible();

    // Then: user SpeechBubble이 대화 영역 우측에 붙는다
    const areaBox = await area.boundingBox();
    const bubbleBox = await bubble.boundingBox();
    expect(areaBox).toBeTruthy();
    expect(bubbleBox).toBeTruthy();

    const areaRight = areaBox!.x + areaBox!.width;
    const bubbleRight = bubbleBox!.x + bubbleBox!.width;
    expect(Math.abs(areaRight - bubbleRight)).toBeLessThan(8);
  });
});
