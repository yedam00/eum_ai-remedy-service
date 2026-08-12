import { test, expect } from '@playwright/test';

test.describe('ChatEntry - Link Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chat-entry');
    await page.waitForSelector('[data-testid="chat-entry-container"]');
  });

  test('voicePress 버튼을 클릭하면 VoiceModal이 화면에 나타난다', async ({ page }) => {
    const voiceButton = page.locator('[data-testid="voice-press-button"]');
    
    await expect(voiceButton).toBeVisible();
    
    await voiceButton.click();
    
    const modal = page.locator('[data-testid="voice-modal"]');
    await expect(modal).toBeVisible({ timeout: 500 });
  });

  test('모달이 열린 상태에서 닫기 버튼을 클릭하면 모달이 닫힌다', async ({ page }) => {
    const voiceButton = page.locator('[data-testid="voice-press-button"]');
    await voiceButton.click();
    
    const modal = page.locator('[data-testid="voice-modal"]');
    await expect(modal).toBeVisible({ timeout: 500 });
    
    const closeButton = page.locator('button[aria-label="닫기"]');
    await closeButton.click();
    
    await expect(modal).not.toBeVisible({ timeout: 500 });
  });

  test('voicePress 버튼에 pointer 커서가 적용된다', async ({ page }) => {
    const voiceButton = page.locator('[data-testid="voice-press-button"]');
    
    const cursor = await voiceButton.evaluate((el) => {
      return window.getComputedStyle(el).cursor;
    });
    
    expect(cursor).toBe('pointer');
  });
});
