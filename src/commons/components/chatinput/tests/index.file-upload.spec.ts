import { test, expect } from "@playwright/test";
import path from "path";

test.describe("ChatInput File Upload Hook", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test-chatinput");
    await page.waitForSelector('[data-testid="file-dropzone"]', {
      timeout: 500,
    });
  });

  test("fileDropzone 영역 클릭 시 파일 선택 창이 트리거된다", async ({
    page,
  }) => {
    // Given: test-chatinput 페이지가 로드되어 있음
    const fileDropzone = page.locator('[data-testid="file-dropzone"]');
    await expect(fileDropzone).toBeVisible();

    // When: fileDropzone 영역을 클릭
    const fileInputPromise = page.waitForEvent("filechooser");
    await fileDropzone.click();

    // Then: 파일 선택 창이 열림
    const fileChooser = await fileInputPromise;
    expect(fileChooser).toBeTruthy();
  });

  test("파일 선택 완료 시 multi-upload 모드로 변경된다", async ({ page }) => {
    // Given: test-chatinput 페이지가 로드되어 있음
    const fileDropzone = page.locator('[data-testid="file-dropzone"]');
    await expect(fileDropzone).toBeVisible();

    // When: 파일을 선택
    const fileInputPromise = page.waitForEvent("filechooser");
    await fileDropzone.click();
    const fileChooser = await fileInputPromise;
    await fileChooser.setFiles([
      path.join(__dirname, "../../../../../public/images/level1.png"),
    ]);

    // Then: multi-upload 모드로 변경됨
    const multiUploadContainer = page.locator(
      '[data-testid="multi-upload-filled-container"]'
    );
    await expect(multiUploadContainer).toBeVisible({ timeout: 500 });
  });

  test("선택한 파일의 썸네일이 표시된다", async ({ page }) => {
    // Given: test-chatinput 페이지가 로드되어 있음
    const fileDropzone = page.locator('[data-testid="file-dropzone"]');

    // When: 파일을 선택
    const fileInputPromise = page.waitForEvent("filechooser");
    await fileDropzone.click();
    const fileChooser = await fileInputPromise;
    await fileChooser.setFiles([
      path.join(__dirname, "../../../../../public/images/level1.png"),
    ]);

    // Then: 썸네일이 표시됨
    const filePreviewItem = page.locator('[data-testid="file-preview-item"]');
    await expect(filePreviewItem).toHaveCount(1);
  });

  test("파일 1개일 때 placeholder 클릭으로 추가 파일을 선택할 수 있다", async ({
    page,
  }) => {
    // Given: 파일이 1개 업로드된 상태
    const fileDropzone = page.locator('[data-testid="file-dropzone"]');
    const fileInputPromise = page.waitForEvent("filechooser");
    await fileDropzone.click();
    const fileChooser = await fileInputPromise;
    await fileChooser.setFiles([
      path.join(__dirname, "../../../../../public/images/level1.png"),
    ]);

    await page.waitForSelector('[data-testid="multi-upload-filled-container"]', {
      timeout: 500,
    });

    // When: 첫 번째 placeholder 클릭으로 파일 추가
    const placeholder = page
      .locator('[data-testid="file-add-more-placeholder"]')
      .first();
    await expect(placeholder).toBeVisible();

    const fileInputPromise2 = page.waitForEvent("filechooser");
    await placeholder.click();
    const fileChooser2 = await fileInputPromise2;
    await fileChooser2.setFiles([
      path.join(__dirname, "../../../../../public/images/level2.png"),
    ]);

    // Then: 파일이 2개가 됨
    const filePreviewItems = page.locator('[data-testid="file-preview-item"]');
    await expect(filePreviewItems).toHaveCount(2);
  });

  test("최대 6개까지 파일을 첨부할 수 있다", async ({ page }) => {
    // Given: test-chatinput 페이지가 로드되어 있음
    const fileDropzone = page.locator('[data-testid="file-dropzone"]');

    // When: 6개 파일을 선택
    const fileInputPromise = page.waitForEvent("filechooser");
    await fileDropzone.click();
    const fileChooser = await fileInputPromise;
    await fileChooser.setFiles([
      path.join(__dirname, "../../../../../public/images/level1.png"),
      path.join(__dirname, "../../../../../public/images/level2.png"),
      path.join(__dirname, "../../../../../public/images/level3.png"),
      path.join(__dirname, "../../../../../public/images/level4.png"),
      path.join(__dirname, "../../../../../public/images/level5.png"),
      path.join(__dirname, "../../../../../public/images/level1.png"),
    ]);

    // Then: 6개의 썸네일이 표시됨
    const filePreviewItems = page.locator('[data-testid="file-preview-item"]');
    await expect(filePreviewItems).toHaveCount(6);

    // And: placeholder가 표시되지 않음
    const placeholder = page.locator(
      '[data-testid="file-add-more-placeholder"]'
    );
    await expect(placeholder).not.toBeVisible();
  });

  test("개별 파일의 삭제 버튼을 클릭하면 해당 파일이 제거된다", async ({
    page,
  }) => {
    // Given: 파일이 2개 업로드된 상태
    const fileDropzone = page.locator('[data-testid="file-dropzone"]');
    const fileInputPromise = page.waitForEvent("filechooser");
    await fileDropzone.click();
    const fileChooser = await fileInputPromise;
    await fileChooser.setFiles([
      path.join(__dirname, "../../../../../public/images/level1.png"),
      path.join(__dirname, "../../../../../public/images/level2.png"),
    ]);

    await page.waitForSelector('[data-testid="multi-upload-filled-container"]', {
      timeout: 500,
    });

    let filePreviewItems = page.locator('[data-testid="file-preview-item"]');
    await expect(filePreviewItems).toHaveCount(2);

    // When: 첫 번째 파일의 삭제 버튼 클릭
    const firstDeleteButton = page
      .locator('[data-testid="file-delete-button"]')
      .first();
    await firstDeleteButton.click();

    // Then: 파일이 1개로 줄어듦
    filePreviewItems = page.locator('[data-testid="file-preview-item"]');
    await expect(filePreviewItems).toHaveCount(1);
  });

  test("모든 파일 삭제 시 file-upload 상태로 돌아간다", async ({ page }) => {
    // Given: 파일이 1개 업로드된 상태
    const fileDropzone = page.locator('[data-testid="file-dropzone"]');
    const fileInputPromise = page.waitForEvent("filechooser");
    await fileDropzone.click();
    const fileChooser = await fileInputPromise;
    await fileChooser.setFiles([
      path.join(__dirname, "../../../../../public/images/level1.png"),
    ]);

    await page.waitForSelector('[data-testid="multi-upload-filled-container"]', {
      timeout: 500,
    });

    // When: 유일한 파일의 삭제 버튼 클릭
    const deleteButton = page.locator('[data-testid="file-delete-button"]');
    await deleteButton.click();

    // Then: file-upload 상태로 돌아감
    const fileDropzoneAgain = page.locator('[data-testid="file-dropzone"]');
    await expect(fileDropzoneAgain).toBeVisible({ timeout: 500 });

    // And: multi-upload-filled-container가 사라짐
    const multiUploadContainer = page.locator(
      '[data-testid="multi-upload-filled-container"]'
    );
    await expect(multiUploadContainer).not.toBeVisible();
  });
});
