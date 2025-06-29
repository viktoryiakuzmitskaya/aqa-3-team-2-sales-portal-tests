import { Locator } from '@playwright/test';

/**
 * Utility function for selecting dropdown options
 * @param dropdown - Playwright Locator for the select element
 * @param option - Option to select (label or value)
 */
export async function selectDropdownOption(
  dropdown: Locator,
  option: { label?: string; value?: string },
): Promise<void> {
  await dropdown.selectOption(option);
}

/**
 * Utility function to get all options from a dropdown
 * @param dropdown - Playwright Locator for the select element
 * @returns Array of option texts
 */
export async function getDropdownOptions(dropdown: Locator): Promise<string[]> {
  const options = await dropdown.locator('option').all();
  const optionTexts: string[] = [];

  for (const option of options) {
    const text = await option.textContent();
    if (text) optionTexts.push(text);
  }

  return optionTexts;
}
