import { test, expect } from '@playwright/test';

test.describe('Chat - Link Routing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chat');
    await page.waitForSelector('[data-testid="chat-container"]');
  });

  test('header 영역을 클릭하면 /home으로 이동한다', async ({ page }) => {
    const header = page.locator('[data-testid="chat-header"]');
    
    await expect(header).toBeVisible();
    
    await header.click();
    
    await page.waitForURL('/home');
    
    expect(page.url()).toContain('/home');
  });

  test('header 영역에 pointer 커서가 적용된다', async ({ page }) => {
    const header = page.locator('[data-testid="chat-header"]');
    
    const cursor = await header.evaluate((el) => {
      return window.getComputedStyle(el).cursor;
    });
    
    expect(cursor).toBe('pointer');
  });
});
