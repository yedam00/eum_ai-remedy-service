import { test, expect } from '@playwright/test';

test.describe('ChatEntry - Link Routing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chat-entry');
    await page.waitForSelector('[data-testid="chat-entry-container"]');
  });

  test('헤더 뒤로가기 버튼을 클릭하면 /home으로 이동한다', async ({ page }) => {
    const backButton = page.locator('[data-testid="chat-entry-back-button"]');
    
    await expect(backButton).toBeVisible();
    
    await backButton.click();
    
    await page.waitForURL('**/home');
    
    expect(page.url()).toContain('/home');
  });

  test('헤더 뒤로가기 버튼에 pointer 커서가 적용된다', async ({ page }) => {
    const backButton = page.locator('[data-testid="chat-entry-back-button"]');
    
    const cursor = await backButton.evaluate((el) => {
      return window.getComputedStyle(el).cursor;
    });
    
    expect(cursor).toBe('pointer');
  });
});
