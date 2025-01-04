import { test, expect } from '@playwright/test';

test.describe('Node Configuration Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the workflows page
    await page.goto('/');
    
    // Create a new workflow for each test
    await page.getByTestId('new-workflow-button').click();
    await page.getByTestId('workflow-name-input').fill('Node Configuration Test');
    await page.getByTestId('workflow-description-input').fill('Testing complete node configuration flow');
    await page.getByTestId('save-workflow-button').click();
  });

  test('should configure a SendGrid node with all fields and validate schema', async ({ page }) => {
    // Step 1: Add node to canvas
    await page.getByTestId('add-node-button').click();
    await page.getByTestId('node-type-sendgrid').click();
    
    // Verify node is added to canvas
    const node = page.getByTestId('node-sendgrid');
    await expect(node).toBeVisible();
    
    // Step 2: Open node configuration
    await node.click();
    
    // Step 3: Configure all fields
    // API Configuration
    await page.getByTestId('sendgrid-api-key-input').fill('SG.test_api_key');
    await expect(page.getByTestId('api-key-validation-success')).toBeVisible();
    
    // Email Template Configuration
    await page.getByTestId('template-id-input').fill('d-template123');
    await page.getByTestId('template-name-input').fill('Welcome Email');
    
    // Sender Configuration
    await page.getByTestId('from-email-input').fill('test@example.com');
    await page.getByTestId('from-name-input').fill('Test Sender');
    
    // Recipient Configuration
    await page.getByTestId('to-email-input').fill('{{user.email}}');
    await page.getByTestId('to-name-input').fill('{{user.name}}');
    
    // Dynamic Variables
    await page.getByTestId('add-variable-button').click();
    await page.getByTestId('variable-key-input').fill('firstName');
    await page.getByTestId('variable-value-input').fill('{{user.firstName}}');
    await page.getByTestId('save-variable-button').click();
    
    // Add another variable
    await page.getByTestId('add-variable-button').click();
    await page.getByTestId('variable-key-input').fill('companyName');
    await page.getByTestId('variable-value-input').fill('{{company.name}}');
    await page.getByTestId('save-variable-button').click();
    
    // Step 4: Validate Schema
    await page.getByTestId('validate-schema-button').click();
    await expect(page.getByTestId('schema-validation-success')).toBeVisible();
    
    // Verify required fields are marked as valid
    await expect(page.getByTestId('api-key-field-status')).toHaveAttribute('data-valid', 'true');
    await expect(page.getByTestId('template-id-field-status')).toHaveAttribute('data-valid', 'true');
    await expect(page.getByTestId('from-email-field-status')).toHaveAttribute('data-valid', 'true');
    await expect(page.getByTestId('to-email-field-status')).toHaveAttribute('data-valid', 'true');
    
    // Step 5: Save Configuration
    await page.getByTestId('save-node-config-button').click();
    
    // Step 6: Verify Save Success
    await expect(page.getByTestId('save-success-message')).toBeVisible();
    
    // Step 7: Verify Node Cache Update
    await page.getByTestId('show-debug-panel').click();
    const nodeCache = page.getByTestId('node-cache-panel');
    await expect(nodeCache).toContainText('SG.test_api_key');
    await expect(nodeCache).toContainText('d-template123');
    
    // Step 8: Verify Node Visual Status
    await expect(node).toHaveClass(/configured/);
    await expect(page.getByTestId('node-status-badge')).toHaveText('Configured');
    
    // Step 9: Test Configuration Persistence
    // Reload the page
    await page.reload();
    
    // Reopen node configuration
    await node.click();
    
    // Verify all fields retained their values
    await expect(page.getByTestId('sendgrid-api-key-input')).toHaveValue('SG.test_api_key');
    await expect(page.getByTestId('template-id-input')).toHaveValue('d-template123');
    await expect(page.getByTestId('from-email-input')).toHaveValue('test@example.com');
    await expect(page.getByTestId('to-email-input')).toHaveValue('{{user.email}}');
  });

  test('should handle invalid configurations appropriately', async ({ page }) => {
    // Add node to canvas
    await page.getByTestId('add-node-button').click();
    await page.getByTestId('node-type-sendgrid').click();
    await page.getByTestId('node-sendgrid').click();
    
    // Try to save without required fields
    await page.getByTestId('save-node-config-button').click();
    
    // Verify error messages
    await expect(page.getByTestId('api-key-error')).toBeVisible();
    await expect(page.getByTestId('template-id-error')).toBeVisible();
    await expect(page.getByTestId('from-email-error')).toBeVisible();
    await expect(page.getByTestId('to-email-error')).toBeVisible();
    
    // Fill invalid email
    await page.getByTestId('from-email-input').fill('invalid-email');
    await page.getByTestId('save-node-config-button').click();
    await expect(page.getByTestId('from-email-error')).toContainText('Invalid email format');
    
    // Fill invalid API key format
    await page.getByTestId('sendgrid-api-key-input').fill('invalid-key');
    await page.getByTestId('save-node-config-button').click();
    await expect(page.getByTestId('api-key-error')).toContainText('Invalid API key format');
  });

  test('should validate dynamic variable syntax', async ({ page }) => {
    // Add and open node
    await page.getByTestId('add-node-button').click();
    await page.getByTestId('node-type-sendgrid').click();
    await page.getByTestId('node-sendgrid').click();
    
    // Add variable with invalid syntax
    await page.getByTestId('add-variable-button').click();
    await page.getByTestId('variable-key-input').fill('firstName');
    await page.getByTestId('variable-value-input').fill('{{invalid.syntax}}');
    await page.getByTestId('save-variable-button').click();
    
    // Verify syntax error
    await expect(page.getByTestId('variable-syntax-error')).toBeVisible();
    await expect(page.getByTestId('variable-syntax-error')).toContainText('Invalid variable syntax');
    
    // Fix syntax and verify
    await page.getByTestId('variable-value-input').fill('{{user.firstName}}');
    await page.getByTestId('save-variable-button').click();
    await expect(page.getByTestId('variable-syntax-error')).not.toBeVisible();
  });
});
