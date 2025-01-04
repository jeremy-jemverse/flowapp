import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { WorkflowData } from '../types';

export function useWorkflows() {
  const {
    items,
    viewMode,
    searchQuery,
    sortBy,
    sortOrder,
    initialized
  } = useSelector((state: RootState) => state.workflows);

  const filteredAndSortedItems = useMemo(() => {
    console.log('useWorkflows: Processing items', { 
      itemsCount: items?.length,
      searchQuery,
      sortBy,
      sortOrder,
      initialized
    });

    if (!initialized) {
      return [];
    }

    // Ensure items is an array
    const safeItems = Array.isArray(items) ? items : [];
    
    // Filter items
    const filtered = safeItems.filter((item): item is WorkflowData => {
      if (!item?.name) return false;
      const searchLower = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.metadata.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
      );
    });

    // Sort items
    return filtered.sort((a, b) => {
      // Ensure sortBy is a valid string key
      if (typeof sortBy !== 'string' || !Object.keys(a).includes(sortBy)) {
        return 0; // No sorting if sortBy is invalid
      }

      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];

      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;

      // Handle different types appropriately
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle string comparisons
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Default case: convert to strings and compare
      const aStr = String(aValue);
      const bStr = String(bValue);
      return sortOrder === 'asc' 
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [items, searchQuery, sortBy, sortOrder, initialized]);

  return {
    items: filteredAndSortedItems,
    viewMode,
    searchQuery,
    sortBy,
    sortOrder,
    isEmpty: !filteredAndSortedItems?.length
  };
}