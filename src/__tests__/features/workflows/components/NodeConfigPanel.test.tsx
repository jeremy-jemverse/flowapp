import { render, screen, fireEvent, act } from '@testing-library/react';
import { NodeConfigPanel } from '@/features/workflows/components/NodeConfigPanel';
import { Node } from 'reactflow';
import { WorkflowNode, NodeData, BaseNodeConfig } from '@/features/workflows/types/workflow';
import { vi } from 'vitest';

// Mock the workflow cache
jest.mock('@/features/workflows/utils/workflowCache', () => ({
  workflowCache: {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    clear: vi.fn()
  }
}));

// Mock child components
jest.mock('@/features/workflows/components/nodes/database/postgres/PostgresNodeConfig', () => ({
  PostgresNodeConfig: ({ config, onChange }: any) => (
    <div data-testid="postgres-config">
      <input
        data-testid="host-input"
        value={config.host || ''}
        onChange={(e) => onChange({ ...config, host: e.target.value })}
      />
      <input
        data-testid="port-input"
        type="number"
        value={config.port || ''}
        onChange={(e) => onChange({ ...config, port: Number(e.target.value) })}
      />
      <textarea
        data-testid="description-input"
        value={config.description || ''}
        onChange={(e) => onChange({ ...config, description: e.target.value })}
      />
    </div>
  )
}));

jest.mock('@/features/workflows/components/nodes/integrations/sendgrid/SendGridNodeConfig', () => ({
  SendGridNodeConfig: () => <div data-testid="sendgrid-config">SendGrid Config</div>
}));

describe('NodeConfigPanel', () => {
  const mockOnClose = vi.fn();
  const mockOnUpdate = vi.fn();
  const mockWorkflowId = 'test-workflow';

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset workflowCache mock implementation
    const { workflowCache } = require('@/features/workflows/utils/workflowCache');
    workflowCache.get.mockReturnValue(null);
  });

  const createMockNode = (type: string, config = {}): WorkflowNode<NodeData<BaseNodeConfig>> => ({
    id: 'test-node',
    type,
    position: { x: 0, y: 0 },
    data: {
      label: 'Test Node',
      nodeType: type,
      description: 'Test Description',
      icon: 'TestIcon',
      category: 'test',
      inputs: [],
      outputs: [],
      config,
      metadata: {
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0.0',
        isValid: true,
        errors: []
      },
      onConfigure: vi.fn()
    }
  });

  it('initializes with node data when no cache exists', () => {
    const initialConfig = {
      host: 'localhost',
      port: 5432,
      description: 'Initial Config'
    };
    const mockNode = createMockNode('postgres', initialConfig);
    
    render(
      <NodeConfigPanel
        node={mockNode}
        workflowId={mockWorkflowId}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    // Should use values from props when no cache exists
    expect(screen.getByText('Test Node')).toBeInTheDocument();
    expect(screen.getByText('Initial Config')).toBeInTheDocument();
  });

  it('uses cached data when available', () => {
    const initialConfig = { host: 'localhost' };
    const cachedConfig = { 
      host: 'cached-host',
      description: 'Cached Config'
    };
    
    const mockNode = createMockNode('postgres', initialConfig);
    const { workflowCache } = require('@/features/workflows/utils/workflowCache');
    
    // Setup mock cache data
    workflowCache.get.mockReturnValue({
      nodes: {
        'test-node': {
          ...mockNode,
          data: {
            ...mockNode.data,
            label: 'Cached Node',
            config: cachedConfig
          }
        }
      }
    });

    render(
      <NodeConfigPanel
        node={mockNode}
        workflowId={mockWorkflowId}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    // Should use cached values
    expect(screen.getByText('Cached Node')).toBeInTheDocument();
    expect(screen.getByText('Cached Config')).toBeInTheDocument();
  });

  it('updates node data when fields change', async () => {
    const initialConfig = {
      host: 'localhost',
      description: 'Initial Config'
    };
    const mockNode = createMockNode('postgres', initialConfig);
    
    render(
      <NodeConfigPanel
        node={mockNode}
        workflowId={mockWorkflowId}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    // Update description
    const descriptionInput = screen.getByDisplayValue('Initial Config');
    await act(async () => {
      fireEvent.change(descriptionInput, { target: { value: 'Updated Config' } });
    });

    // Verify onUpdate was called with merged config
    expect(mockOnUpdate).toHaveBeenCalledWith(mockNode.id, {
      ...mockNode.data,
      config: {
        ...initialConfig,
        description: 'Updated Config'
      }
    });
  });

  it('renders postgres configuration when node type is postgres', () => {
    const mockNode = createMockNode('postgres');
    render(
      <NodeConfigPanel
        node={mockNode}
        workflowId={mockWorkflowId}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByTestId('postgres-config')).toBeInTheDocument();
  });

  it('renders sendgrid configuration when node type is sendgrid', () => {
    const mockNode = createMockNode('sendgrid');
    render(
      <NodeConfigPanel
        node={mockNode}
        workflowId={mockWorkflowId}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByTestId('sendgrid-config')).toBeInTheDocument();
  });

  it('renders default message for unknown node types', () => {
    const mockNode = createMockNode('unknown');
    render(
      <NodeConfigPanel
        node={mockNode}
        workflowId={mockWorkflowId}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Configuration not available for this node type')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const mockNode = createMockNode('postgres');
    render(
      <NodeConfigPanel
        node={mockNode}
        workflowId={mockWorkflowId}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles node updates correctly', () => {
    const mockNode = createMockNode('postgres');
    render(
      <NodeConfigPanel
        node={mockNode}
        workflowId={mockWorkflowId}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    // Simulate an update from a child component
    const testData = {
      label: 'Updated Label',
      config: { test: 'value' }
    };

    // Find the postgres config component and simulate an update
    const postgresConfig = screen.getByTestId('postgres-config');
    fireEvent.change(postgresConfig, { target: { value: JSON.stringify(testData) } });

    // Verify that onUpdate was called with the correct data
    expect(mockOnUpdate).toHaveBeenCalledWith(mockNode.id, expect.objectContaining({
      label: mockNode.data.label,
      config: expect.objectContaining({
        test: 'value'
      })
    }));
  });

  it('pre-populates fields from node configuration', () => {
    const mockConfig = {
      host: 'localhost',
      port: 5432,
      database: 'testdb',
      description: 'Test Database Config'
    };
    const mockNode = createMockNode('postgres', mockConfig);
    
    render(
      <NodeConfigPanel
        node={mockNode}
        workflowId={mockWorkflowId}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    // Verify config fields are populated
    expect(screen.getByText(mockConfig.description)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockConfig.host)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockConfig.port.toString())).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockConfig.database)).toBeInTheDocument();
  });

  it('updates cache when node config changes', async () => {
    const mockConfig = {
      host: 'localhost',
      description: 'Initial Description'
    };
    const mockNode = createMockNode('postgres', mockConfig);
    
    render(
      <NodeConfigPanel
        node={mockNode}
        workflowId={mockWorkflowId}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    // Update description
    const descriptionInput = screen.getByDisplayValue('Initial Description');
    fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });

    // Verify onUpdate was called with new config
    expect(mockOnUpdate).toHaveBeenCalledWith(mockNode.id, {
      config: {
        ...mockConfig,
        description: 'Updated Description'
      }
    });
  });

  it('preserves existing node data when updating specific fields', () => {
    const mockConfig = {
      host: 'localhost',
      port: 5432,
      database: 'testdb',
      username: 'user',
      password: 'pass'
    };
    const mockNode = createMockNode('postgres', mockConfig);
    
    render(
      <NodeConfigPanel
        node={mockNode}
        workflowId={mockWorkflowId}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    // Update just the host field
    const hostInput = screen.getByDisplayValue('localhost');
    fireEvent.change(hostInput, { target: { value: 'newhost' } });

    // Verify other fields were preserved in the update
    expect(mockOnUpdate).toHaveBeenCalledWith(mockNode.id, {
      config: {
        ...mockConfig,
        host: 'newhost'
      }
    });
  });

  it('handles empty or undefined config gracefully', () => {
    const mockNode = createMockNode('postgres', undefined);
    
    render(
      <NodeConfigPanel
        node={mockNode}
        workflowId={mockWorkflowId}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    // Should not crash and should show default/empty values
    expect(screen.getByTestId('postgres-config')).toBeInTheDocument();
  });
});

describe('NodeConfigPanel Field Population', () => {
  const mockOnClose = vi.fn();
  const mockOnUpdate = vi.fn();
  const mockWorkflowId = 'test-workflow';

  beforeEach(() => {
    vi.clearAllMocks();
    const { workflowCache } = require('@/features/workflows/utils/workflowCache');
    workflowCache.get.mockReturnValue(null);
  });

  it('populates all fields from initial node data', async () => {
    const initialConfig = {
      host: 'test-host',
      port: 5432,
      description: 'Test Description',
      label: 'Test Node'
    };
    
    const mockNode = {
      id: 'test-node',
      type: 'postgres',
      position: { x: 0, y: 0 },
      data: {
        label: initialConfig.label,
        config: initialConfig,
        category: 'database',
        inputs: [],
        outputs: []
      }
    };

    render(
      <NodeConfigPanel
        node={mockNode}
        workflowId={mockWorkflowId}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    // Check if all fields are populated with initial values
    expect(screen.getByDisplayValue(initialConfig.label)).toBeInTheDocument();
    expect(screen.getByDisplayValue(initialConfig.host)).toBeInTheDocument();
    expect(screen.getByDisplayValue(initialConfig.port.toString())).toBeInTheDocument();
    expect(screen.getByDisplayValue(initialConfig.description)).toBeInTheDocument();
  });

  it('prioritizes cached data over initial node data', async () => {
    const initialConfig = {
      host: 'initial-host',
      port: 5432,
      description: 'Initial Description'
    };
    
    const cachedConfig = {
      host: 'cached-host',
      port: 5433,
      description: 'Cached Description'
    };

    const mockNode = {
      id: 'test-node',
      type: 'postgres',
      position: { x: 0, y: 0 },
      data: {
        label: 'Initial Label',
        config: initialConfig,
        category: 'database',
        inputs: [],
        outputs: []
      }
    };

    // Setup cache mock
    const { workflowCache } = require('@/features/workflows/utils/workflowCache');
    workflowCache.get.mockReturnValue({
      nodes: {
        'test-node': {
          ...mockNode,
          data: {
            ...mockNode.data,
            label: 'Cached Label',
            config: cachedConfig
          }
        }
      }
    });

    render(
      <NodeConfigPanel
        node={mockNode}
        workflowId={mockWorkflowId}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    // Should show cached values instead of initial values
    expect(screen.getByDisplayValue('Cached Label')).toBeInTheDocument();
    expect(screen.getByDisplayValue(cachedConfig.host)).toBeInTheDocument();
    expect(screen.getByDisplayValue(cachedConfig.port.toString())).toBeInTheDocument();
    expect(screen.getByDisplayValue(cachedConfig.description)).toBeInTheDocument();
  });

  it('handles field updates and preserves other values', async () => {
    const initialConfig = {
      host: 'test-host',
      port: 5432,
      description: 'Test Description'
    };

    const mockNode = {
      id: 'test-node',
      type: 'postgres',
      position: { x: 0, y: 0 },
      data: {
        label: 'Test Node',
        config: initialConfig,
        category: 'database',
        inputs: [],
        outputs: []
      }
    };

    render(
      <NodeConfigPanel
        node={mockNode}
        workflowId={mockWorkflowId}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    // Update host field
    const hostInput = screen.getByTestId('host-input');
    await act(async () => {
      fireEvent.change(hostInput, { target: { value: 'new-host' } });
    });

    // Check that onUpdate was called with updated host but preserved other values
    expect(mockOnUpdate).toHaveBeenCalledWith(mockNode.id, {
      label: 'Test Node',
      config: {
        ...initialConfig,
        host: 'new-host'
      }
    });

    // Verify other fields retained their values
    expect(screen.getByDisplayValue('5432')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
  });

  it('handles empty or undefined values gracefully', async () => {
    const mockNode = {
      id: 'test-node',
      type: 'postgres',
      position: { x: 0, y: 0 },
      data: {
        category: 'database',
        inputs: [],
        outputs: []
      }
    };

    render(
      <NodeConfigPanel
        node={mockNode}
        workflowId={mockWorkflowId}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    // Should show empty fields without crashing
    expect(screen.getByTestId('postgres-config')).toBeInTheDocument();
    expect(screen.getByTestId('host-input')).toHaveValue('');
    expect(screen.getByTestId('description-input')).toHaveValue('');
  });
});
