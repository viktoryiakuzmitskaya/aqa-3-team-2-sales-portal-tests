import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { ROUTES } from 'config/ui-config';

export class ManagersListPage extends BasePage {
  // Page elements
  readonly pageTitle: Locator;
  readonly addManagerButton: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly filterButton: Locator;
  readonly managersTable: Locator;
  readonly tableRows: Locator;
  readonly tableHeaders: Locator;

  constructor(page: Page) {
    super(page);

    // Page elements based on actual HTML
    this.pageTitle = page.locator('h2.fw-bold');
    this.addManagerButton = page.locator('a[name="add-button"]');
    this.searchInput = page.locator('#search');
    this.searchButton = page.locator('#search-manager');
    this.filterButton = page.locator('#filter');
    this.managersTable = page.locator('#table-managers');
    this.tableRows = page.locator('#table-managers tbody tr');
    this.tableHeaders = page.locator('#table-managers thead th');
  }

  // Navigation methods
  async open(): Promise<void> {
    await this.page.goto(ROUTES.MANAGERS);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.managersTable).toBeVisible();
  }
  async clickAddManager(): Promise<void> {
    await this.addManagerButton.click();
  }

  async searchManager(searchText: string): Promise<void> {
    await this.searchInput.fill(searchText);
    await this.searchButton.click();
  }

  async fillSearchInput(searchText: string): Promise<void> {
    await this.searchInput.fill(searchText);
  }

  async clickSearchButton(): Promise<void> {
    await this.searchButton.click();
  }

  async waitForSearchButtonEnabled(): Promise<void> {
    await this.searchButton.waitFor({ state: 'visible' });
    await expect(this.searchButton).toBeEnabled();
  }

  async clickFilter(): Promise<void> {
    await this.filterButton.click();
  }

  // Verification methods
  async verifyPageTitle(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Managers List');
  }

  async verifyAddManagerButtonVisible(): Promise<void> {
    await expect(this.addManagerButton).toBeVisible();
    await expect(this.addManagerButton).toHaveText('+ Add Manager');
  }

  async verifySearchElements(): Promise<void> {
    await expect(this.searchInput).toBeVisible();
    await expect(this.searchButton).toBeVisible();
    await expect(this.filterButton).toBeVisible();
  }

  async verifyTableVisible(): Promise<void> {
    await expect(this.managersTable).toBeVisible();
  }

  async verifyTableHeaders(): Promise<void> {
    const expectedHeaders = ['First Name', 'Last Name', 'Roles', 'Created On', 'Actions'];
    const headers = await this.tableHeaders.allTextContents();

    for (let i = 0; i < expectedHeaders.length; i++) {
      expect(headers[i]).toContain(expectedHeaders[i]);
    }
  }

  async getManagersCount(): Promise<number> {
    return await this.tableRows.count();
  }

  async verifyManagerInTable(firstName: string, lastName: string): Promise<void> {
    const managerRow = this.tableRows
      .filter({
        hasText: firstName,
      })
      .filter({
        hasText: lastName,
      });

    await expect(managerRow).toBeVisible();
  }

  async getManagerDetailLink(firstName: string, lastName: string): Promise<string> {
    const managerRow = this.tableRows
      .filter({
        hasText: firstName,
      })
      .filter({
        hasText: lastName,
      });

    const detailLink = managerRow.locator('a[title="Details"]');
    return (await detailLink.getAttribute('href')) || '';
  }

  async clickManagerDetails(firstName: string, lastName: string): Promise<void> {
    const managerRow = this.tableRows
      .filter({
        hasText: firstName,
      })
      .filter({
        hasText: lastName,
      });

    const detailLink = managerRow.locator('a[title="Details"]');
    await detailLink.click();
  }

  async verifySearchButtonDisabled(): Promise<void> {
    await expect(this.searchButton).toBeDisabled();
  }

  async verifySearchButtonEnabled(): Promise<void> {
    await expect(this.searchButton).toBeEnabled();
  }

  async verifyFilterButtonDisabled(): Promise<void> {
    await expect(this.filterButton).toBeDisabled();
  }

  async verifySearchInputPlaceholder(): Promise<void> {
    await expect(this.searchInput).toHaveAttribute('placeholder', 'Type a value...');
  }

  async verifySearchInputMaxLength(): Promise<void> {
    await expect(this.searchInput).toHaveAttribute('maxlength', '40');
  }

  async sortManagersByColumn(columnName: string): Promise<void> {
    const sortButton = this.page.locator('th div[onclick="sortManagers(this)"]', {
      hasText: columnName,
    });
    await sortButton.click();
  }

  async verifyManagersListNotEmpty(): Promise<void> {
    const rowCount = await this.getManagersCount();
    expect(rowCount).toBeGreaterThan(0);
  }

  async verifyManagerData(firstName: string, lastName: string, role: string): Promise<void> {
    const managerRow = this.tableRows
      .filter({
        hasText: firstName,
      })
      .filter({
        hasText: lastName,
      })
      .filter({
        hasText: role,
      });

    await expect(managerRow).toBeVisible();
  }

  /**
   * Получить значения всех ячеек в столбце по индексу (0-based)
   */
  async getColumnValues(colIdx: number): Promise<string[]> {
    const rowCount = await this.tableRows.count();
    const values: string[] = [];
    for (let i = 0; i < rowCount; i++) {
      const cell = this.tableRows.nth(i).locator('td').nth(colIdx);
      values.push((await cell.textContent())?.trim() ?? '');
    }
    return values;
  }
}
