import { SalesPortalPage } from '../salesPortal.page';

export class RequestedProductsPage extends SalesPortalPage {
  readonly title = this.page.locator('.modal-title').filter({ hasText: 'Customer Details' });
  uniqueElement = this.title;
  readonly editProductsPencil = this.page.locator('#edit-products-pencil');
  readonly requestedProductsContainer = this.page.locator('#products-section');
  readonly productsSection = this.page.locator('#products-section');
  readonly accordionButton = this.page.locator('#heading0 > button');
  readonly receivButton = this.page.locator('#start-receiving-products');
  readonly cancelButton = this.page.locator('#cancel-receiving');
  readonly saveButton = this.page.locator('#save-received-products');
  readonly checkboxAll = this.page.locator('#selectAll');

  async clickOnEditProducts() {
    await this.editProductsPencil.click();
  }
  async expandAccordionSection(sectionName: string, index: number = 0): Promise<void> {
    // Находим все кнопки аккордеона с указанным названием
    const accordionButtons = this.page.locator('.accordion-button', { hasText: sectionName });

    // Выбираем конкретную кнопку по индексу
    const accordionButton = accordionButtons.nth(index);

    // Проверяем текущее состояние
    const isExpanded = (await accordionButton.getAttribute('aria-expanded')) === 'true';

    // Если секция не раскрыта - кликаем
    if (!isExpanded) {
      await accordionButton.click();
      // Ждем анимацию раскрытия конкретного аккордеона
      await this.page
        .locator(`#collapse${index}.accordion-collapse.collapse.show`)
        .waitFor({ state: 'visible' });
    }
  }

  async collapseAccordionSection(sectionName: string, index: number = 0): Promise<void> {
    const accordionButtons = this.page.locator('.accordion-button', { hasText: sectionName });
    const accordionButton = accordionButtons.nth(index);
    const isExpanded = (await accordionButton.getAttribute('aria-expanded')) === 'true';

    if (isExpanded) {
      await accordionButton.click();
      // Ждем когда конкретная секция скроется
      await this.page
        .locator('#collapse${index}.accordion-collapse.collapse')
        .waitFor({ state: 'hidden' });
    }
  }

  // Универсальный метод для переключения состояния
  async toggleAccordionSection(sectionName: string, index: number = 0): Promise<void> {
    const accordionButton = this.page
      .locator('.accordion-button', { hasText: sectionName })
      .nth(index);
    await accordionButton.click();
    await this.page.waitForTimeout(300);
  }
  async clickOnReceive() {
    await this.receivButton.click();
  }
  async clickOnCancel() {
    await this.cancelButton.click();
  }
  async clickOnSave() {
    await this.saveButton.click();
  }

  async checkboxOnAll() {
    await this.checkboxAll.check();
  }

  readonly checkbox = (name: string) =>
    this.requestedProductsContainer.locator(`input[value="${name}"]`);

  async checkByIndex(...value: string[]) {
    for (const v of value) {
      await this.checkbox(v).check();
    }
  }
}
