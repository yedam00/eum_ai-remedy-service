import { test, expect } from '@playwright/test';

test.describe('Home - Link Routing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/home');
    await page.waitForSelector('[data-testid="home-container"]');
  });

  test('문진 시작하기 버튼을 클릭하면 /chat-entry로 이동한다', async ({ page }) => {
    const startButton = page.locator('[data-testid="home-start-button"]');
    
    await expect(startButton).toBeVisible();
    
    await startButton.click();
    
    await page.waitForURL('/chat-entry');
    
    expect(page.url()).toContain('/chat-entry');
  });

  test('문진 시작하기 버튼에 pointer 커서가 적용된다', async ({ page }) => {
    const startButton = page.locator('[data-testid="home-start-button"]');
    
    const cursor = await startButton.evaluate((el) => {
      return window.getComputedStyle(el).cursor;
    });
    
    expect(cursor).toBe('pointer');
  });
});
