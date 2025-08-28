import { expect, test } from '@playwright/test'

test.describe('Core Order Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
  })

  test('should create order and progress through statuses', async ({ page }) => {
    // Fill and submit form
    await page.fill('input[name="customer"]', 'Status Test User')
    await page.selectOption('select[name="product"]', '1')
    await page.click('button[type="submit"]')

    // Wait for order to appear in table
    const orderRow = page.locator('table tbody tr').first()
    await expect(orderRow).toBeVisible({ timeout: 15000 })

    // Verify order data
    await expect(orderRow).toContainText('Status Test User')
    await expect(orderRow).toContainText('Laptop')

    // Check initial status: Pending
    const statusCell = orderRow.locator('td').last()
    await expect(statusCell).toContainText('Pending', { timeout: 5000 })

    // Wait for status to change to Processing (~2 seconds)
    await expect(statusCell).toContainText('Processing', { timeout: 8000 })

    // Wait for status to change to Completed (~8 more seconds)
    await expect(statusCell).toContainText('Completed', { timeout: 15000 })
  })
})
