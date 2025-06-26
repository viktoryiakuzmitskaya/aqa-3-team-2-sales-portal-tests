import { SalesPortalPage } from 'ui/pages/salesPortal.page';

export abstract class Tab extends SalesPortalPage {
  title = this.page.locator('h4.ms-3');

  uniqueElement = this.title;

  async getTabTitle(): Promise<string> {
    return (await this.title.textContent()) || '';
  }
}
