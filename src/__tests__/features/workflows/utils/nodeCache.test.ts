import {
  createNodeCacheEntry,
  updateNodeCacheEntry,
  getNodeFromCache,
  clearWorkflowCache,
  validateNodeCache
} from '@/features/workflows/utils/nodeCache';
import { WorkflowNode } from '@/features/workflows/types';
import { NodeData } from '@/features/workflows/components/nodes/types';

describe('nodeCache utilities', () => {
  const mockWorkflowId = 'test-workflow';
  
  const createMockNode = (id: string): WorkflowNode => ({
    id,
    type: 'test',
    position: { x: 0, y: 0 },
    data: {
      label: `Test Node ${id}`,
      description: 'Test Description',
      icon: 'TestIcon',
      category: 'test',
      inputs: [],
      outputs: [],
      config: {},
      onConfigure: jest.fn()
    }
  });

  beforeEach(() => {
    // Clear cache before each test
    clearWorkflowCache(mockWorkflowId);
  });

  describe('createNodeCacheEntry', () => {
    it('creates a new node cache entry correctly', () => {
      const mockNode = createMockNode('test-1');
      const result = createNodeCacheEntry(mockWorkflowId, mockNode);

      expect(result).toEqual(expect.objectContaining({
        id: mockNode.id,
        type: mockNode.type,
        data: expect.objectContaining({
          label: mockNode.data.label,
          metadata: expect.objectContaining({
            isValid: true,
            version: '1.0.0'
          })
        })
      }));
    });

    it('preserves existing metadata when creating entry', () => {
      const mockNode = createMockNode('test-1');
      const existingCache: Partial<NodeData> = {
        metadata: {
          created: '2024-01-01T00:00:00Z',
          lastModified: '2024-01-01T00:00:00Z',
          version: '1.0.0',
          isValid: true
        }
      };

      const result = createNodeCacheEntry(mockWorkflowId, mockNode, existingCache);
      expect(result.data.metadata?.created).toBe(existingCache.metadata?.created);
    });
  });

  describe('updateNodeCacheEntry', () => {
    it('updates an existing node cache entry', () => {
      const mockNode = createMockNode('test-1');
      createNodeCacheEntry(mockWorkflowId, mockNode);

      const updates = {
        label: 'Updated Label',
        config: { test: 'value' }
      };

      const result = updateNodeCacheEntry(mockWorkflowId, mockNode.id, updates);
      expect(result?.data.label).toBe(updates.label);
      expect(result?.data.config).toEqual(expect.objectContaining(updates.config));
    });

    it('returns null when updating non-existent node', () => {
      const result = updateNodeCacheEntry(mockWorkflowId, 'non-existent', {});
      expect(result).toBeNull();
    });
  });

  describe('getNodeFromCache', () => {
    it('retrieves a cached node correctly', () => {
      const mockNode = createMockNode('test-1');
      createNodeCacheEntry(mockWorkflowId, mockNode);

      const result = getNodeFromCache(mockWorkflowId, mockNode.id);
      expect(result).toEqual(expect.objectContaining({
        id: mockNode.id,
        type: mockNode.type
      }));
    });

    it('returns null for non-existent node', () => {
      const result = getNodeFromCache(mockWorkflowId, 'non-existent');
      expect(result).toBeNull();
    });
  });

  describe('validateNodeCache', () => {
    it('validates node data correctly', () => {
      const validData: NodeData = {
        label: 'Test Node',
        description: 'Test Description',
        icon: 'TestIcon',
        category: 'test',
        inputs: [],
        outputs: [],
        config: {},
        metadata: {
          created: '2024-01-01T00:00:00Z',
          lastModified: '2024-01-01T00:00:00Z',
          version: '1.0.0',
          isValid: true
        }
      };

      const result = validateNodeCache(validData);
      expect(result.metadata?.isValid).toBeTruthy();
      expect(result.metadata?.errors).toHaveLength(0);
    });

    it('detects invalid node data', () => {
      const invalidData: NodeData = {
        label: '', // Invalid: empty label
        description: 'Test Description',
        icon: 'TestIcon',
        category: 'test',
        inputs: [{ id: 'required-input', required: true }], // Missing required input
        outputs: [],
        config: {},
        metadata: {
          created: '2024-01-01T00:00:00Z',
          lastModified: '2024-01-01T00:00:00Z',
          version: '1.0.0',
          isValid: true
        }
      };

      const result = validateNodeCache(invalidData);
      expect(result.metadata?.isValid).toBeFalsy();
      expect(result.metadata?.errors).toContain('Node label is required');
      expect(result.metadata?.errors).toContain('Required input required-input is missing');
    });
  });
});
