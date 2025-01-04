import { renderHook, act } from '@testing-library/react';
import { useWorkflowState } from '@/features/workflows/hooks/useWorkflowState';
import { Node, Edge } from 'reactflow';
import { WorkflowNodeData } from '@/features/workflows/types/workflow';

describe('useWorkflowState', () => {
  const createMockNode = (id: string): Node<WorkflowNodeData> => ({
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

  const createMockEdge = (id: string, source: string, target: string): Edge => ({
    id,
    source,
    target
  });

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useWorkflowState());
    
    expect(result.current.nodes).toEqual([]);
    expect(result.current.edges).toEqual([]);
    expect(result.current.selectedNode).toBeNull();
    expect(result.current.hasUnsavedChanges).toBeFalsy();
  });

  it('handles node changes correctly', () => {
    const { result } = renderHook(() => useWorkflowState());
    const mockNode = createMockNode('test-1');

    act(() => {
      result.current.onNodesChange([{
        type: 'add',
        item: mockNode
      }]);
    });

    expect(result.current.nodes).toContainEqual(mockNode);
    expect(result.current.hasUnsavedChanges).toBeTruthy();
  });

  it('handles edge changes correctly', () => {
    const { result } = renderHook(() => useWorkflowState());
    const mockEdge = createMockEdge('edge-1', 'source-1', 'target-1');

    act(() => {
      result.current.onEdgesChange([{
        type: 'add',
        item: mockEdge
      }]);
    });

    expect(result.current.edges).toContainEqual(mockEdge);
    expect(result.current.hasUnsavedChanges).toBeTruthy();
  });

  it('updates node data correctly', () => {
    const { result } = renderHook(() => useWorkflowState());
    const mockNode = createMockNode('test-1');

    act(() => {
      result.current.onNodesChange([{
        type: 'add',
        item: mockNode
      }]);
    });

    const updatedData = {
      label: 'Updated Node',
      config: { test: 'value' }
    };

    act(() => {
      result.current.updateNodeData('test-1', updatedData);
    });

    const updatedNode = result.current.nodes.find(n => n.id === 'test-1');
    expect(updatedNode?.data.label).toBe('Updated Node');
    expect(updatedNode?.data.config).toEqual(expect.objectContaining({ test: 'value' }));
  });

  it('handles node selection correctly', () => {
    const { result } = renderHook(() => useWorkflowState());
    const mockNode = createMockNode('test-1');

    act(() => {
      result.current.onNodesChange([{
        type: 'add',
        item: mockNode
      }]);
      result.current.setSelectedNode(mockNode);
    });

    expect(result.current.selectedNode).toEqual(mockNode);
  });

  it('clears unsaved changes', () => {
    const { result } = renderHook(() => useWorkflowState());
    const mockNode = createMockNode('test-1');

    act(() => {
      result.current.onNodesChange([{
        type: 'add',
        item: mockNode
      }]);
    });

    expect(result.current.hasUnsavedChanges).toBeTruthy();

    act(() => {
      result.current.clearUnsavedChanges();
    });

    expect(result.current.hasUnsavedChanges).toBeFalsy();
  });

  it('clears node cache correctly', () => {
    const { result } = renderHook(() => useWorkflowState());
    const mockNode = createMockNode('test-1');

    act(() => {
      result.current.onNodesChange([{
        type: 'add',
        item: mockNode
      }]);
    });

    act(() => {
      result.current.clearNodeCache();
    });

    expect(result.current.nodes).toEqual([]);
    expect(result.current.edges).toEqual([]);
    expect(result.current.selectedNode).toBeNull();
  });
});
