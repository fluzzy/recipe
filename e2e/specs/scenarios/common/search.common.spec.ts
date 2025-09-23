import { test, expect } from '@playwright/test';
import { SearchQueryKey } from '~/constants/key';
import { PAGE_ROUTES } from '~/constants/route';

test.describe('[scenarios][common] 검색 입력 동작', () => {
  test('input에 값을 입력하고 엔터를 누르면 페이지가 이동한다.', async ({
    page,
  }) => {
    await page.goto('/');

    const value = '삼겹살';
    await page.getByTestId('search-input').fill(value);
    await page.keyboard.press('Enter');

    // URL 이동 및 쿼리 파라미터 검증
    await page.waitForURL('**/search**');
    const url = new URL(page.url());
    expect(url.pathname).toBe(PAGE_ROUTES.SEARCH);
    expect(url.searchParams.get(SearchQueryKey)).toBe(value);
  });
});
