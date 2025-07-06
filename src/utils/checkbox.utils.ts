import { Locator } from '@playwright/test';

/**
 * Status filter options type for reusability
 */
export type StatusFilterOption =
  | 'Draft'
  | 'In Process'
  | 'Partially Received'
  | 'Received'
  | 'Canceled';

/**
 * Available status filter options
 */
export const AVAILABLE_STATUS_FILTERS: StatusFilterOption[] = [
  'Draft',
  'In Process',
  'Partially Received',
  'Received',
  'Canceled',
];

/**
 * Utility function to get checkbox by status mapping
 * @param checkboxes - Object mapping status to checkbox locators
 * @param status - Status to get checkbox for
 * @returns Locator for the checkbox or undefined
 */
export function getCheckboxByStatus(
  checkboxes: Record<StatusFilterOption, Locator>,
  status: StatusFilterOption,
): Locator | undefined {
  return checkboxes[status];
}
