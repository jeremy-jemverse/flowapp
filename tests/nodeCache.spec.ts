import { test, expect } from '@playwright/test';

test.describe('Node Cache Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should update node cache when configuration changes', async ({ page }) => {
    // Create a new workflow first
    await page.click('[data-testid="new-workflow-button"]');
    await page.fill('[data-testid="workflow-name-input"]', 'Cache Test Workflow');
    await page.click('[data-testid="save-workflow-button"]');

    // Add a node
    await page.click('[data-testid="add-node-button"]');
    await page.click('[data-testid="node-type-sendgrid"]');

    // Open node configuration
    await page.click('[data-testid="node-sendgrid"]');

    // Make configuration changes
    await page.fill('[data-testid="node-config-api-key"]', 'test-key');
    await page.click('[data-testid="save-node-config"]');

    // Verify cache update in debug panel
    await page.click('[data-testid="show-debug-panel"]');
    await expect(page.locator('[data-testid="cache-entry-api-key"]')).toHaveText('test-key');
  });

  test('should persist node cache between page reloads', async ({ page }) => {
    // Set up initial state
    await page.click('[data-testid="new-workflow-button"]');
    await page.fill('[data-testid="workflow-name-input"]', 'Persistence Test');
    await page.click('[data-testid="save-workflow-button"]');
    
    // Add and configure a node
    await page.click('[data-testid="add-node-button"]');
    await page.click('[data-testid="node-type-sendgrid"]');
    await page.click('[data-testid="node-sendgrid"]');
    await page.fill('[data-testid="node-config-api-key"]', 'persist-test-key');
    await page.click('[data-testid="save-node-config"]');

    // Reload the page
    await page.reload();

    // Verify the cache persisted
    await page.click('[data-testid="node-sendgrid"]');
    await expect(page.locator('[data-testid="node-config-api-key"]')).toHaveValue('persist-test-key');
  });

  test('should handle invalid cache updates gracefully', async ({ page }) => {
    // Create workflow and node
    await page.click('[data-testid="new-workflow-button"]');
    await page.fill('[data-testid="workflow-name-input"]', 'Error Test');
    await page.click('[data-testid="save-workflow-button"]');
    await page.click('[data-testid="add-node-button"]');
    await page.click('[data-testid="node-type-sendgrid"]');

    // Try to save invalid configuration
    await page.click('[data-testid="node-sendgrid"]');
    await page.fill('[data-testid="node-config-template-id"]', ''); // Empty required field
    await page.click('[data-testid="save-node-config"]');

    // Verify error handling
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="node-status-error"]')).toBeVisible();
  });
});
