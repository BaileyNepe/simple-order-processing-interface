import { expect, test } from '@playwright/test'

test.describe('Core Order Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
  })

  test('should create and display an order', async ({ page }) => {
    await page.fill('input[name="customer"]', 'Test User')
    await page.selectOption('select[name="product"]', '1')

    await page.click('button[type="submit"]')

    await expect(page.locator('text=Order created successfully')).toBeVisible()
    await expect(page.locator('table tr:first-child td:last-child')).toContainText(
      'Pending'
    )

    await page.waitForTimeout(2000)

    await expect(page.locator('table tr:first-child td:last-child')).toContainText(
      'Processing'
    )

    await page.waitForTimeout(8000)

    await expect(page.locator('table tr:first-child td:last-child')).toContainText(
      'Completed'
    )

    // should focus on the customer name input
    await expect(page.locator('input[name="customer"]')).toBeFocused()
  })
})
