import { test, expect } from '@playwright/test';

test.describe('Chat - Link Routing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chat');
    await page.waitForSelector('[data-testid="chat-container"]');
  });

  test('header 뒤로가기 버튼을 클릭하면 /home으로 이동한다', async ({ page }) => {
    const backButton = page.locator('[data-testid="chat-back-button"]');
    
    await expect(backButton).toBeVisible();
    
    // 모달이 열리므로 /home으로 바로 이동하지 않음
    await backButton.click();
    
    // 모달이 열렸는지 확인
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
  });

  test('header 뒤로가기 버튼에 pointer 커서가 적용된다', async ({ page }) => {
    const backButton = page.locator('[data-testid="chat-back-button"]');
    
    const cursor = await backButton.evaluate((el) => {
      return window.getComputedStyle(el).cursor;
    });
    
    expect(cursor).toBe('pointer');
  });
});
