import { ESortOrder } from './enum.utils';

export function genericSort<T>(items: T[], sortField: keyof T, sortOrder: ESortOrder): T[] {
  return [...items].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortOrder === ESortOrder.ASC ? -1 : 1;
    if (bValue == null) return sortOrder === ESortOrder.ASC ? 1 : -1;

    // Handle different data types
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortOrder === ESortOrder.ASC ? comparison : -comparison;
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      const comparison = aValue - bValue;
      return sortOrder === ESortOrder.ASC ? comparison : -comparison;
    }

    // Handle dates
    if (aValue instanceof Date && bValue instanceof Date) {
      const comparison = aValue.getTime() - bValue.getTime();
      return sortOrder === ESortOrder.ASC ? comparison : -comparison;
    }

    // Fallback to string comparison
    const comparison = String(aValue).localeCompare(String(bValue));
    return sortOrder === ESortOrder.ASC ? comparison : -comparison;
  });
}
