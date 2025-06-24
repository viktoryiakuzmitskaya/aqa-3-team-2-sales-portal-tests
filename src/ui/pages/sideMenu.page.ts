import { Locator, Page } from '@playwright/test';

export class SideMenuComponent {
  readonly salesPortalButton: Locator;
  readonly userDropdown: Locator;
  readonly signOutButton: Locator;
  constructor(protected page: Page) {
    this.salesPortalButton = this.page.locator('span.fs-4');
    this.userDropdown = this.page.locator('#dropdownUser1');
    this.signOutButton = this.page.locator('#signOut');
  }

  async openUserDropdown() {
    await this.userDropdown.click();
  }

  async clickSignOut() {
    await this.signOutButton.click();
  }
}
