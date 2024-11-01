import { test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  await page.goto('https://local-oidc-test.diamond.ac.uk:9000');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByLabel('Username:').fill(process.env.PLAYWRIGHT_USERNAME!);
  await page.getByLabel('Password').fill(process.env.PLAYWRIGHT_PASSWORD!);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForURL('https://local-oidc-test.diamond.ac.uk:9000');

  await page.context().storageState({ path: authFile });
});