import { Page } from '@playwright/test';
import { HomePage } from 'ui/pages/home.page';
import { logStep } from 'utils/reporter.utils';

export class HomeUIService {
  homePage: HomePage;
  constructor(private page: Page) {
    this.homePage = new HomePage(page);
  }

  @logStep('Open Sales Portal on Home Page')
  async openAsLoggedInUser() {
    await this.homePage.openPortal();
    await this.homePage.waitForOpened();
  }
}
