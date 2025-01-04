import { test, expect } from '@playwright/test';
import { WorkflowNodeData } from '../src/features/workflows/types/workflow';

test.describe('Node Editing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Create a new workflow
    await page.getByTestId('new-workflow-button').click();
    await page.getByTestId('workflow-name-input').fill('Node Editing Test');
    await page.getByTestId('save-workflow-button').click();
  });

  test('should edit node configuration and persist changes', async ({ page }) => {
    // Add a node
    await page.getByTestId('add-node-button').click();
    await page.getByTestId('node-type-sendgrid').click();
    
    // Initial configuration
    await page.getByTestId('node-sendgrid').click();
    await page.getByTestId('node-label-input').fill('Welcome Email');
    await page.getByTestId('node-description-input').fill('Sends welcome email to new users');
    await page.getByTestId('api-key-input').fill('SG.initial_key');
    await page.getByTestId('save-node-config-button').click();
    
    // Verify initial save
    await expect(page.getByTestId('node-label')).toHaveText('Welcome Email');
    await expect(page.getByTestId('save-success-message')).toBeVisible();
    
    // Edit existing configuration
    await page.getByTestId('node-sendgrid').click();
    await page.getByTestId('node-label-input').fill('Updated Welcome Email');
    await page.getByTestId('api-key-input').fill('SG.updated_key');
    await page.getByTestId('save-node-config-button').click();
    
    // Verify updates
    await expect(page.getByTestId('node-label')).toHaveText('Updated Welcome Email');
    await expect(page.getByTestId('save-success-message')).toBeVisible();
    
    // Reload page and verify persistence
    await page.reload();
    await page.getByTestId('node-sendgrid').click();
    await expect(page.getByTestId('node-label-input')).toHaveValue('Updated Welcome Email');
    await expect(page.getByTestId('api-key-input')).toHaveValue('SG.updated_key');
  });

  test('should handle partial updates correctly', async ({ page }) => {
    // Add and configure initial node
    await page.getByTestId('add-node-button').click();
    await page.getByTestId('node-type-sendgrid').click();
    await page.getByTestId('node-sendgrid').click();
    
    // Initial full configuration
    await page.getByTestId('node-label-input').fill('Initial Label');
    await page.getByTestId('node-description-input').fill('Initial Description');
    await page.getByTestId('api-key-input').fill('SG.initial_key');
    await page.getByTestId('template-id-input').fill('template-1');
    await page.getByTestId('save-node-config-button').click();
    
    // Update only the label
    await page.getByTestId('node-sendgrid').click();
    await page.getByTestId('node-label-input').fill('Updated Label');
    await page.getByTestId('save-node-config-button').click();
    
    // Verify other fields retained their values
    await page.getByTestId('node-sendgrid').click();
    await expect(page.getByTestId('node-label-input')).toHaveValue('Updated Label');
    await expect(page.getByTestId('node-description-input')).toHaveValue('Initial Description');
    await expect(page.getByTestId('api-key-input')).toHaveValue('SG.initial_key');
    await expect(page.getByTestId('template-id-input')).toHaveValue('template-1');
  });

  test('should validate required fields during editing', async ({ page }) => {
    // Add node
    await page.getByTestId('add-node-button').click();
    await page.getByTestId('node-type-sendgrid').click();
    await page.getByTestId('node-sendgrid').click();
    
    // Try to save without required fields
    await page.getByTestId('save-node-config-button').click();
    
    // Check validation messages
    await expect(page.getByTestId('api-key-error')).toBeVisible();
    await expect(page.getByTestId('template-id-error')).toBeVisible();
    
    // Fill required fields
    await page.getByTestId('api-key-input').fill('SG.valid_key');
    await page.getByTestId('template-id-input').fill('template-1');
    await page.getByTestId('save-node-config-button').click();
    
    // Verify validation passes
    await expect(page.getByTestId('api-key-error')).not.toBeVisible();
    await expect(page.getByTestId('template-id-error')).not.toBeVisible();
    await expect(page.getByTestId('save-success-message')).toBeVisible();
  });

  test('should track version and modification time during edits', async ({ page }) => {
    // Add and configure node
    await page.getByTestId('add-node-button').click();
    await page.getByTestId('node-type-sendgrid').click();
    await page.getByTestId('node-sendgrid').click();
    
    // Initial configuration
    await page.getByTestId('node-label-input').fill('Version Test');
    await page.getByTestId('api-key-input').fill('SG.test_key');
    await page.getByTestId('save-node-config-button').click();
    
    // Get initial version and time
    await page.getByTestId('show-debug-panel').click();
    const initialVersion = await page.getByTestId('node-version').textContent();
    const initialModTime = await page.getByTestId('node-last-modified').textContent();
    
    // Wait a second to ensure different modification time
    await page.waitForTimeout(1000);
    
    // Make an edit
    await page.getByTestId('node-sendgrid').click();
    await page.getByTestId('node-label-input').fill('Updated Version Test');
    await page.getByTestId('save-node-config-button').click();
    
    // Verify version increment and time update
    await page.getByTestId('show-debug-panel').click();
    const updatedVersion = await page.getByTestId('node-version').textContent();
    const updatedModTime = await page.getByTestId('node-last-modified').textContent();
    
    expect(updatedVersion).not.toBe(initialVersion);
    expect(updatedModTime).not.toBe(initialModTime);
  });
});
