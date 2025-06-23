import { ESortOrder } from 'types/products.types';

export function genericSort<T>(items: T[], sortField: keyof T, sortOrder: ESortOrder): T[] {
  return [...items].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue == null) return sortOrder === ESortOrder.ASC ? -1 : 1;
    if (bValue == null) return sortOrder === ESortOrder.ASC ? 1 : -1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortOrder === ESortOrder.ASC ? comparison : -comparison;
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      const comparison = aValue - bValue;
      return sortOrder === ESortOrder.ASC ? comparison : -comparison;
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      const comparison = aValue.getTime() - bValue.getTime();
      return sortOrder === ESortOrder.ASC ? comparison : -comparison;
    }

    const comparison = String(aValue).localeCompare(String(bValue));
    return sortOrder === ESortOrder.ASC ? comparison : -comparison;
  });
}
