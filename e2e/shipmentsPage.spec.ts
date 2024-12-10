import { test, expect } from '@playwright/test';

test('has existing sample collections', async ({ page }) => {
  await page.goto('/proposals/bi23047/sessions/100');

  await expect(page.getByText(/Select Existing Sample Collection/i)).toBeVisible()
});

test('should create new sample collection', async ({ page }) => {
  await page.goto('/proposals/bi23047/sessions/100');

  await page.getByRole('textbox', { name: 'Name' }).fill("70");
  await page.getByRole("button", {name: "Create"}).click();

  await expect(page.getByRole('heading', { name: 'New Sample' })).toBeVisible({timeout: 10000});
});

test('should create new sample collection using existing samples', async ({ page }) => {
  await page.goto('/proposals/bi23047/sessions/100');

  await page.getByRole('textbox', { name: 'Name' }).fill("80");
  const checkBox = page.getByLabel("Use Existing Samples");
  const boundingBox = (await checkBox.boundingBox())!;

  // Move the cursor to centre of checkbox
  await page.mouse.click(boundingBox.x + 5, boundingBox.y)

  await page.getByRole("button", {name: "Create"}).click();
  
  await expect(page.getByRole('heading', { name: 'Import Existing Samples' })).toBeVisible({timeout: 10000});
});

test('should navigate to sample collection page when sample collection card clicked', async ({ page }) => {
  await page.goto('/proposals/bi23047/sessions/100');

  await page.getByRole('textbox', { name: 'Name' }).fill("70");
  await page.getByRole("button", {name: "Create"}).click();

  await expect(page.getByRole('heading', { name: 'New Sample' })).toBeVisible({timeout: 10000});
});

test('should load sample collection page when sample collection clicked', async ({ page }) => {
  await page.goto('/proposals/bi23047/sessions/100');

  await page.getByText(/Submitted/i).click();

  await expect(page.getByText("Booked")).toBeVisible({timeout: 10000});
});

test('should display error if non-existent sample collection is selected', async ({ page }) => {
  await page.goto('/proposals/xx12345/sessions/999');

  await expect(page.getByRole('heading', { name: 'Session Unavailable' })).toBeVisible();
});