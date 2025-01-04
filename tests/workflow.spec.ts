import { test, expect } from '@playwright/test';

test.describe('Workflow Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the workflows page
    await page.goto('/');
  });

  test('should create a new workflow', async ({ page }) => {
    // Click the new workflow button (update selector based on your UI)
    await page.click('[data-testid="new-workflow-button"]');
    
    // Fill in workflow details
    await page.fill('[data-testid="workflow-name-input"]', 'Test Workflow');
    await page.fill('[data-testid="workflow-description-input"]', 'A test workflow created by Playwright');
    
    // Save the workflow
    await page.click('[data-testid="save-workflow-button"]');
    
    // Verify the workflow was created
    await expect(page.locator('text=Test Workflow')).toBeVisible();
  });

  test('should add a node to workflow', async ({ page }) => {
    // Assuming we're on a workflow page
    await page.click('[data-testid="add-node-button"]');
    
    // Select a node type (e.g., SendGrid node)
    await page.click('[data-testid="node-type-sendgrid"]');
    
    // Verify the node was added
    await expect(page.locator('[data-testid="node-sendgrid"]')).toBeVisible();
  });

  test('should update node configuration', async ({ page }) => {
    // Navigate to an existing node
    await page.click('[data-testid="node-sendgrid"]');
    
    // Update configuration
    await page.fill('[data-testid="node-config-api-key"]', 'test-api-key');
    await page.fill('[data-testid="node-config-template-id"]', 'test-template');
    
    // Save configuration
    await page.click('[data-testid="save-node-config"]');
    
    // Verify the configuration was saved
    await expect(page.locator('[data-testid="node-status-configured"]')).toBeVisible();
  });
});
