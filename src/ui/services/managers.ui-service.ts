import { Page } from '@playwright/test';
import { ManagersListPage } from 'ui/pages/managers/managersList.page';
import { CreateManagerPage } from 'ui/pages/managers/createManager.page';
import { logStep } from 'utils/reporter.utils';

export class ManagersUIService {
  readonly managersListPage: ManagersListPage;

  constructor(private page: Page) {
    this.managersListPage = new ManagersListPage(page);
  }

  @logStep('Open Managers List page')
  async openManagersList() {
    await this.managersListPage.open();
  }

  @logStep('Navigate to Add Manager page')
  async navigateToAddManager() {
    await this.managersListPage.clickAddManager();
  }

  @logStep('Open Create Manager page')
  async openCreateManagerPage() {
    // Создаем объект CreateManagerPage и открываем страницу напрямую
    const createManagerPage = new CreateManagerPage(this.page);
    await createManagerPage.open();
    return createManagerPage;
  }

  @logStep('Search for manager')
  async searchManager(searchTerm: string) {
    await this.managersListPage.searchManager(searchTerm);
  }

  @logStep('Verify manager exists in table')
  async verifyManagerInTable(firstName: string, lastName: string) {
    await this.managersListPage.verifyManagerInTable(firstName, lastName);
  }

  @logStep('Navigate to manager details')
  async navigateToManagerDetails(firstName: string, lastName: string) {
    await this.managersListPage.clickManagerDetails(firstName, lastName);
  }

  @logStep('Verify managers list is loaded')
  async verifyManagersListLoaded() {
    await this.managersListPage.verifyPageTitle();
    await this.managersListPage.verifyTableVisible();
  }

  @logStep('Get managers count')
  async getManagersCount(): Promise<number> {
    return await this.managersListPage.getManagersCount();
  }

  @logStep('Verify manager data')
  async verifyManagerData(firstName: string, lastName: string, role: string) {
    await this.managersListPage.verifyManagerData(firstName, lastName, role);
  }

  @logStep('Sort managers by column')
  async sortManagersByColumn(columnName: string) {
    await this.managersListPage.sortManagersByColumn(columnName);
  }

  @logStep('Verify page elements')
  async verifyPageElements() {
    await this.managersListPage.verifyPageTitle();
    await this.managersListPage.verifyAddManagerButtonVisible();
    await this.managersListPage.verifySearchElements();
    await this.managersListPage.verifyTableVisible();
  }
}
