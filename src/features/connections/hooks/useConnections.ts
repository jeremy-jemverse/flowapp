import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { ConnectionDetails } from '../types';

export function useConnections() {
  const {
    items,
    viewMode,
    searchQuery,
    sortBy,
    sortOrder,
    initialized
  } = useSelector((state: RootState) => state.connections);

  const filteredAndSortedItems = useMemo(() => {
    console.log('useConnections: Processing items', { 
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
    const filtered = safeItems.filter((item): item is ConnectionDetails => {
      if (!item?.connection_name) return false;
      return item.connection_name.toLowerCase().includes((searchQuery || '').toLowerCase());
    });

    // Sort items
    return filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (!aValue && aValue !== 0) return 1;
      if (!bValue && bValue !== 0) return -1;

      const comparison = String(aValue).localeCompare(String(bValue));
      return sortOrder === 'asc' ? comparison : -comparison;
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