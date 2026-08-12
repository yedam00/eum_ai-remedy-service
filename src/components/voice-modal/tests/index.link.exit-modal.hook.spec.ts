import { test, expect } from "@playwright/test";

test.describe("Voice Modal Exit Modal Hook", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-container"]');
  });

  test("나가기 버튼 클릭 시 모달이 노출된다", async ({ page }) => {
    const exitButton = page.locator('[data-testid="exit-button"]');
    await expect(exitButton).toBeVisible();

    await exitButton.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
  });

  test("모달이 열린 상태에서 overlay를 클릭하면 모달이 닫힌다", async ({
    page,
  }) => {
    const exitButton = page.locator('[data-testid="exit-button"]');
    await exitButton.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    const overlay = page.locator('[role="presentation"]');
    await overlay.click({ position: { x: 10, y: 10 } });

    await expect(modal).not.toBeVisible();
  });

  test("모달에 제목과 버튼이 표시된다", async ({ page }) => {
    const exitButton = page.locator('[data-testid="exit-button"]');
    await exitButton.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    const title = modal.locator("text=제목");
    await expect(title).toBeVisible();

    const primaryButton = modal.locator("button:has-text('계속 작성')");
    const secondaryButton = modal.locator("button:has-text('나가기')");
    await expect(primaryButton).toBeVisible();
    await expect(secondaryButton).toBeVisible();
  });

  test("모달의 '계속 작성' 버튼 클릭 시 모달이 닫힌다", async ({ page }) => {
    const exitButton = page.locator('[data-testid="exit-button"]');
    await exitButton.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    const primaryButton = modal.locator("button:has-text('계속 작성')");
    await primaryButton.click();

    await expect(modal).not.toBeVisible();
  });

  test("모달의 '계속 작성' 버튼 클릭 시 페이지가 이동하지 않는다", async ({
    page,
  }) => {
    const exitButton = page.locator('[data-testid="exit-button"]');
    await exitButton.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    const primaryButton = modal.locator("button:has-text('계속 작성')");
    await primaryButton.click();

    expect(page.url()).toContain("/diaries");
  });

  test("모달의 '나가기' 버튼 클릭 시 홈 페이지(/home)로 이동한다", async ({
    page,
  }) => {
    const exitButton = page.locator('[data-testid="exit-button"]');
    await exitButton.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    const secondaryButton = modal.locator("button:has-text('나가기')");
    await secondaryButton.click();

    await page.waitForURL("**/home");
    expect(page.url()).toContain("/home");
  });
});
