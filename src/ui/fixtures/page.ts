import { Page } from '@playwright/test';
import { HomePage } from 'ui/pages/home.page';

export class Pages {
  public homePage: HomePage;
  constructor(protected page: Page) {
    this.homePage = new HomePage(page);
  }
}
