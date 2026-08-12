import { test, expect } from "@playwright/test";

test.describe("Chat Link Modal Hook", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/chat");
    await page.waitForSelector('[data-testid="chat-container"]');
  });

  test("header backButton 클릭 시 모달이 노출된다", async ({ page }) => {
    // Given: chat 페이지가 로드되어 있음
    const backButton = page.locator('[data-testid="chat-back-button"]');
    await expect(backButton).toBeVisible();

    // When: 뒤로 가기 버튼을 클릭
    await backButton.click();

    // Then: 모달이 노출됨
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
  });

  test("모달이 열린 상태에서 overlay를 클릭하면 모달이 닫힌다", async ({
    page,
  }) => {
    // Given: 모달이 열려있음
    const backButton = page.locator('[data-testid="chat-back-button"]');
    await backButton.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // When: overlay를 클릭 (모달 밖 영역)
    const overlay = page.locator('[role="presentation"]');
    await overlay.click({ position: { x: 10, y: 10 } });

    // Then: 모달이 닫힘
    await expect(modal).not.toBeVisible();
  });

  test("모달에 제목과 버튼이 표시된다", async ({ page }) => {
    // Given: chat 페이지가 로드되어 있음
    const backButton = page.locator('[data-testid="chat-back-button"]');

    // When: 뒤로 가기 버튼을 클릭하여 모달 열기
    await backButton.click();

    // Then: 모달에 제목과 버튼들이 표시됨
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // 모달 제목 확인
    const title = modal.locator("text=제목");
    await expect(title).toBeVisible();

    // 버튼 확인
    const primaryButton = modal.locator("button:has-text('계속 작성')");
    const secondaryButton = modal.locator("button:has-text('나가기')");
    await expect(primaryButton).toBeVisible();
    await expect(secondaryButton).toBeVisible();
  });

  test("모달의 '계속 작성' 버튼 클릭 시 모달이 닫힌다", async ({ page }) => {
    // Given: 모달이 열려있음
    const backButton = page.locator('[data-testid="chat-back-button"]');
    await backButton.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // When: '계속 작성' 버튼 클릭
    const primaryButton = modal.locator("button:has-text('계속 작성')");
    await primaryButton.click();

    // Then: 모달이 닫힘
    await expect(modal).not.toBeVisible();
  });
});
