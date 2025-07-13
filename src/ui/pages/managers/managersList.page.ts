import { expect } from '@playwright/test';
import { SalesPortalPage } from '../salesPortal.page';

export const SEARCH_INPUT_PLACEHOLDER = 'Type a value...';

export class ManagersListPage extends SalesPortalPage {
  // Page elements
  readonly pageTitle = this.page.locator('h2.fw-bold');
  readonly addManagerButton = this.page.locator('a[name="add-button"]');
  readonly searchInput = this.page.locator('#search');
  readonly searchButton = this.page.locator('#search-manager');
  readonly filterButton = this.page.locator('#filter');
  readonly managersTable = this.page.locator('#table-managers');
  readonly tableRows = this.page.locator('#table-managers tbody tr');
  readonly tableHeaders = this.page.locator('#table-managers thead th');
  readonly uniqueElement = this.page.locator('h2.fw-bold');

  // Navigation methods
  async open(): Promise<void> {
    await this.openPage('MANAGERS');
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
    for (const expected of expectedHeaders) {
      expect(headers.some((h) => h.includes(expected))).toBe(true);
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
    await expect(this.searchInput).toHaveAttribute('placeholder', SEARCH_INPUT_PLACEHOLDER);
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

  public async getPageUrl(): Promise<string> {
    return this.page.url();
  }
}
