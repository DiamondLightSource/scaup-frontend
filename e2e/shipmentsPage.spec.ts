import { test, expect } from '@playwright/test';

test('has existing shipments', async ({ page }) => {
  await page.goto('/proposals/bi23047/sessions/100');

  await expect(page.getByText(/Select Existing Shipment/i)).toBeVisible()
});

test('should create new shipment', async ({ page }) => {
  await page.goto('/proposals/bi23047/sessions/100');

  await page.getByRole('textbox', { name: 'Name' }).fill("70");
  await page.getByRole("button", {name: "Create"}).click();

  await expect(page.getByRole('heading', { name: 'New Sample' })).toBeVisible({timeout: 10000});
});

test('should create new shipment using existing samples', async ({ page }) => {
  await page.goto('proposals/bi23047/sessions/100');

  await page.getByRole('textbox', { name: 'Name' }).fill("80");
  const checkBox = page.getByLabel("Use Existing Samples");
  const boundingBox = (await checkBox.boundingBox())!;

  // Move the cursor to centre of checkbox
  await page.mouse.click(boundingBox.x + 5, boundingBox.y)

  await page.getByRole("button", {name: "Create"}).click();
  
  await expect(page.getByRole('heading', { name: 'Import Existing Samples' })).toBeVisible({timeout: 10000});
});

test('should create new shipment', async ({ page }) => {
  await page.goto('/proposals/bi23047/sessions/100');

  await page.getByRole('textbox', { name: 'Name' }).fill("70");
  await page.getByRole("button", {name: "Create"}).click();

  await expect(page.getByRole('heading', { name: 'New Sample' })).toBeVisible({timeout: 10000});
});

test('should load shipment page when shipment clicked', async ({ page }) => {
  await page.goto('/proposals/bi23047/sessions/100');

  await page.getByText(/Submitted/i).click();

  await expect(page.getByText("Booked")).toBeVisible({timeout: 10000});
});

test('should display error if non-existent shipment is selected', async ({ page }) => {
  await page.goto('/proposals/xx12345/sessions/999');

  await expect(page.getByRole('heading', { name: 'Session Unavailable' })).toBeVisible();
});