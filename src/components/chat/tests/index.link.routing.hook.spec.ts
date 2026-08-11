import { test, expect } from '@playwright/test';

test.describe('Chat - Link Routing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chat');
    await page.waitForSelector('[data-testid="chat-container"]');
  });

  test('header 뒤로가기 버튼을 클릭하면 /home으로 이동한다', async ({ page }) => {
    const backButton = page.locator('header button[aria-label="뒤로 가기"]');
    
    await expect(backButton).toBeVisible();
    
    await backButton.click();
    
    await page.waitForURL('/home');
    
    expect(page.url()).toContain('/home');
  });

  test('header 뒤로가기 버튼에 pointer 커서가 적용된다', async ({ page }) => {
    const backButton = page.locator('header button[aria-label="뒤로 가기"]');
    
    const cursor = await backButton.evaluate((el) => {
      return window.getComputedStyle(el).cursor;
    });
    
    expect(cursor).toBe('pointer');
  });
});
