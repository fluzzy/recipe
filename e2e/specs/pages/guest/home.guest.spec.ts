import { test, expect } from '@playwright/test';

test.describe('[pages][guest] 홈 페이지', () => {
  test('검색 인풋과 헤더 요소가 보인다', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('search-input')).toBeVisible();
    // locator-justification: 공용 헤더 로고/버튼 접근성 확인
    await expect(page.getByRole('link', { name: 'RecipeHub' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Signin' })).toBeVisible();
  });
});
