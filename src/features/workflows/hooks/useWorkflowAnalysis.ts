import { Node, Edge } from 'reactflow';

export function useWorkflowAnalysis() {
  const analyzeWorkflowStructure = (nodes: Node[], edges: Edge[]) => {
    // Build dependency graph
    const dependencies: { [key: string]: string[] } = {};
    const parallelBranches: string[][] = [];
    let hasParallel = false;

    // Initialize dependencies
    nodes.forEach(node => {
      dependencies[node.id] = [];
    });

    // Build dependency graph
    edges.forEach(edge => {
      if (!dependencies[edge.target]) {
        dependencies[edge.target] = [];
      }
      dependencies[edge.target].push(edge.source);

      // Check for parallel branches
      if (edge.sourceHandle?.startsWith('output-')) {
        hasParallel = true;
        const branchIndex = parseInt(edge.sourceHandle.split('-')[1]);
        if (!parallelBranches[branchIndex]) {
          parallelBranches[branchIndex] = [];
        }
        parallelBranches[branchIndex].push(edge.target);
      }
    });

    return {
      dependencies,
      parallelBranches,
      hasParallel
    };
  };

  return {
    analyzeWorkflowStructure
  };
}