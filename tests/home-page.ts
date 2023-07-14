import { expect, test } from '@playwright/test';

test('user can click call to action', async ({ page }) => {
	await page.goto('/');
	const callToAction = page.getByTestId('call-to-action');

	expect(await callToAction.isVisible()).toBeTruthy();
});
