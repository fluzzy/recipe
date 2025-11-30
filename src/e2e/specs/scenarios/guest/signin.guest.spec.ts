import { test, expect } from '@playwright/test';

test.describe('로그인 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
  });

  test('테스트아이디로 로그인하면 쿠키에 token이 들어간다.', async ({
    page,
    context,
  }) => {
    // 환경 변수 기반 테스트 계정 사용 (E2E_* 권장, Cypress 키는 하위 호환)
    const email =
      process.env.E2E_TEST_EMAIL || process.env.CYPRESS_TEST_EMAIL || '';
    const password =
      process.env.E2E_TEST_PASSWORD || process.env.CYPRESS_TEST_PASSWORD || '';

    if (!email || !password) {
      test.skip(true, 'CYPRESS_TEST_EMAIL/PASSWORD 환경 변수가 필요합니다.');
    }

    // 로그인 수행
    await page.getByTestId('email-input').fill(email);
    await page.getByTestId('password-input').fill(password);
    // locator-justification: 제출 버튼에 testid가 없어 접근성 Role로 선택
    await page.getByRole('button', { name: 'Sign up' }).click();

    // 리다이렉트 확인 후 쿠키 검증
    await page.waitForURL('**/');
    const cookies = await context.cookies();
    // 프로젝트의 세션 쿠키 키는 'auth_session' (Cypress 예시는 next-auth 기본 쿠키였음)
    const session = cookies.find((c) => c.name === 'auth_session');
    expect(session).toBeTruthy();
    expect(session?.value).toBeTruthy();
  });

  test('잘못된 아이디로 로그인하면 toast 메세지가 나타난다.', async ({
    page,
  }) => {
    await page.getByTestId('email-input').fill('test123123123123@test.com');
    await page.getByTestId('password-input').fill('123123123');
    // locator-justification: 제출 버튼에 testid가 없어 접근성 Role로 선택
    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(page.getByTestId('toast')).toBeVisible();
  });
});
