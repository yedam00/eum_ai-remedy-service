import { test, expect } from '@playwright/test';

test.describe('Summary - Link Routing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/summary');
    await page.waitForSelector('[data-testid="summary-container"]', { timeout: 500 });
  });

  test('헤더 뒤로가기 버튼을 클릭하면 /chat으로 이동한다', async ({ page }) => {
    const backButton = page.locator('[data-testid="summary-back-button"]');
    
    await expect(backButton).toBeVisible();
    
    await backButton.click();
    
    await page.waitForURL('/chat');
    
    expect(page.url()).toContain('/chat');
  });

  test('헤더 뒤로가기 버튼에 pointer 커서가 적용된다', async ({ page }) => {
    const backButton = page.locator('[data-testid="summary-back-button"]');
    
    const cursor = await backButton.evaluate((el) => {
      return window.getComputedStyle(el).cursor;
    });
    
    expect(cursor).toBe('pointer');
  });

  test('의료진 모드 종료 버튼을 클릭하면 /home으로 이동한다', async ({ page }) => {
    const exitButton = page.locator('[data-testid="summary-exit-button"]');
    
    await expect(exitButton).toBeVisible();
    
    await exitButton.click();
    
    await page.waitForURL('/home');
    
    expect(page.url()).toContain('/home');
  });

  test('의료진 모드 종료 버튼에 pointer 커서가 적용된다', async ({ page }) => {
    const exitButton = page.locator('[data-testid="summary-exit-button"]');
    
    const cursor = await exitButton.evaluate((el) => {
      return window.getComputedStyle(el).cursor;
    });
    
    expect(cursor).toBe('pointer');
  });
});
