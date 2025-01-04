export function updateNodeData(nodes: any[], nodeId: string, data: any) {
  return nodes.map((node) => {
    if (node.id === nodeId) {
      return {
        ...node,
        data: {
          ...node.data,
          ...data,
          // Preserve the onConfigure callback
          onConfigure: node.data.onConfigure
        }
      };
    }
    return node;
  });
}