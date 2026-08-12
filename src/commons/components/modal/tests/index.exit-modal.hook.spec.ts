import { test, expect } from "@playwright/test";

test.describe("Modal Exit Modal Hook", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test-exit-modal");
    await page.waitForSelector('[data-testid="test-exit-modal-container"]');
  });

  test("트리거 버튼 클릭 시 모달이 노출된다", async ({ page }) => {
    // Given: test-exit-modal 페이지가 로드되어 있음
    const triggerButton = page.locator('[data-testid="trigger-exit-modal"]');
    await expect(triggerButton).toBeVisible();

    // When: 트리거 버튼을 클릭
    await triggerButton.click();

    // Then: 모달이 노출됨
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
  });

  test("모달이 열린 상태에서 overlay를 클릭하면 모달이 닫힌다", async ({
    page,
  }) => {
    // Given: 모달이 열려있음
    const triggerButton = page.locator('[data-testid="trigger-exit-modal"]');
    await triggerButton.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // When: overlay를 클릭 (모달 외부 영역을 클릭)
    const overlay = page.locator('[role="presentation"]');
    await overlay.click({ position: { x: 5, y: 5 } });

    // Then: 모달이 닫힘
    await expect(modal).not.toBeVisible();
  });

  test("모달에 제목과 버튼이 표시된다", async ({ page }) => {
    // Given: test-exit-modal 페이지가 로드되어 있음
    const triggerButton = page.locator('[data-testid="trigger-exit-modal"]');

    // When: 트리거 버튼을 클릭하여 모달 열기
    await triggerButton.click();

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

  test("'계속 작성' 버튼 클릭 시 페이지가 이동하지 않고 모달만 닫힌다", async ({
    page,
  }) => {
    // Given: 모달이 열려있음
    const triggerButton = page.locator('[data-testid="trigger-exit-modal"]');
    await triggerButton.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // 현재 URL 저장
    const currentUrl = page.url();

    // When: '계속 작성' 버튼 클릭
    const primaryButton = modal.locator("button:has-text('계속 작성')");
    await primaryButton.click();

    // Then: 모달이 닫히고 URL은 변경되지 않음
    await expect(modal).not.toBeVisible();
    expect(page.url()).toBe(currentUrl);
  });

  test("'나가기' 버튼 클릭 시 /home 페이지로 이동한다", async ({ page }) => {
    // Given: 모달이 열려있음
    const triggerButton = page.locator('[data-testid="trigger-exit-modal"]');
    await triggerButton.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // When: '나가기' 버튼 클릭
    const secondaryButton = modal.locator("button:has-text('나가기')");
    await secondaryButton.click();

    // Then: /home 페이지로 이동
    await page.waitForURL("**/home");
    expect(page.url()).toContain("/home");
  });
});
