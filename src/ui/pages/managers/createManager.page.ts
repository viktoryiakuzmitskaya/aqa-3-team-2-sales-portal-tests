import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { ROUTES } from 'config/ui-config';
import { logStep } from 'utils/reporter.utils';

export interface ICreateManagerData {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export class CreateManagerPage extends BasePage {
  // Уникальный элемент для ожидания загрузки страницы
  readonly pageTitle = this.page.locator('h2.page-title-text');
  readonly backLink = this.page.locator('a.back-link');

  // Form elements (точно соответствуют реальной HTML)
  readonly form = this.page.locator('#add-new-manager-form');
  readonly usernameInput = this.page.locator('#inputUsername');
  readonly firstNameInput = this.page.locator('#inputFirstName');
  readonly lastNameInput = this.page.locator('#inputLastName');
  readonly passwordInput = this.page.locator('#inputPassword');
  readonly confirmPasswordInput = this.page.locator('#inputConfirmPassword');

  // Validation error elements (точно соответствуют реальной HTML)
  readonly usernameError = this.page.locator('#error-inputUsername');
  readonly firstNameError = this.page.locator('#error-inputFirstName');
  readonly lastNameError = this.page.locator('#error-inputLastName');
  readonly passwordError = this.page.locator('#error-inputPassword');
  readonly confirmPasswordError = this.page.locator('#error-inputConfirmPassword');

  // Buttons (точно соответствуют реальной HTML)
  readonly saveButton = this.page.locator('#save-new-manager');
  readonly clearAllButton = this.page.locator('#clear-inputs');

  constructor(page: Page) {
    super(page);
  }

  @logStep('Open Create Manager page')
  async open() {
    await this.page.goto(ROUTES.MANAGER_ADD);
    await this.waitForPageLoad();
  }

  @logStep('Wait for page to load')
  async waitForPageLoad() {
    // Ждем появления заголовка страницы
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText('Add New Manager');
    // Ждем появления формы
    await expect(this.form).toBeVisible();
  }

  @logStep('Fill username field: {username}')
  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  @logStep('Fill first name field: {firstName}')
  async fillFirstName(firstName: string) {
    await this.firstNameInput.fill(firstName);
  }

  @logStep('Fill last name field: {lastName}')
  async fillLastName(lastName: string) {
    await this.lastNameInput.fill(lastName);
  }

  @logStep('Fill password field')
  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  @logStep('Fill confirm password field')
  async fillConfirmPassword(confirmPassword: string) {
    await this.confirmPasswordInput.fill(confirmPassword);
  }

  @logStep('Click Save New Manager button')
  async clickSaveButton() {
    await this.saveButton.click();
  }

  @logStep('Click Clear All button')
  async clickClearAllButton() {
    await this.clearAllButton.click();
  }

  @logStep('Click back link')
  async clickBackLink() {
    await this.backLink.click();
  }

  @logStep('Fill complete manager form')
  async fillManagerForm(managerData: ICreateManagerData) {
    await this.fillUsername(managerData.username);
    await this.fillFirstName(managerData.firstName);
    await this.fillLastName(managerData.lastName);
    await this.fillPassword(managerData.password);
    await this.fillConfirmPassword(managerData.confirmPassword);
  }

  @logStep('Create manager with data')
  async createManager(managerData: ICreateManagerData) {
    await this.fillManagerForm(managerData);
    await this.clickSaveButton();
  }

  // Validation methods
  @logStep('Check field validation state: {fieldName}')
  async checkFieldValidationState(fieldName: string, expectedState: 'valid' | 'invalid') {
    const field = this.getFieldByName(fieldName);

    if (expectedState === 'valid') {
      await expect(field).toHaveClass(/is-valid/);
    } else {
      await expect(field).toHaveClass(/is-invalid/);
    }
  }

  @logStep('Check field validation color: {fieldName}')
  async checkFieldValidationColor(fieldName: string, expectedColor: 'green' | 'red') {
    const field = this.getFieldByName(fieldName);

    if (expectedColor === 'green') {
      // Для зеленого состояния: только is-valid, без is-invalid
      await expect(field).toHaveClass(/is-valid/);
      await expect(field).not.toHaveClass(/is-invalid/);
    } else {
      // Для красного состояния: должен быть is-invalid (может быть с is-valid одновременно)
      await expect(field).toHaveClass(/is-invalid/);
      // НЕ проверяем отсутствие is-valid для красного состояния
      // так как JavaScript может добавить: "form-control is-valid is-invalid"
    }
  }

  @logStep('Check field has validation error state: {fieldName}')
  async checkFieldHasValidationError(fieldName: string) {
    const field = this.getFieldByName(fieldName);
    // Проверяем только наличие is-invalid класса
    await expect(field).toHaveClass(/is-invalid/);
  }

  @logStep('Check field has valid state: {fieldName}')
  async checkFieldHasValidState(fieldName: string) {
    const field = this.getFieldByName(fieldName);
    // Проверяем что поле имеет is-valid и НЕ имеет is-invalid
    await expect(field).toHaveClass(/is-valid/);
    await expect(field).not.toHaveClass(/is-invalid/);
  }

  @logStep('Check validation error message: {fieldName}')
  async checkValidationErrorMessage(fieldName: string, expectedMessage: string) {
    const errorElement = this.getErrorElementByFieldName(fieldName);
    const field = this.getFieldByName(fieldName);

    // Проверяем что поле имеет класс is-invalid
    await expect(field).toHaveClass(/is-invalid/);

    // Проверяем что сообщение об ошибке содержит ожидаемый текст
    await expect(errorElement).toContainText(expectedMessage);

    // Проверяем что элемент с ошибкой имеет класс invalid-feedback
    await expect(errorElement).toHaveClass(/invalid-feedback/);
  }

  @logStep('Check validation error is not shown: {fieldName}')
  async checkValidationErrorNotShown(fieldName: string) {
    const errorElement = this.getErrorElementByFieldName(fieldName);
    const field = this.getFieldByName(fieldName);

    // Проверяем что поле НЕ имеет класс is-invalid
    await expect(field).not.toHaveClass(/is-invalid/);

    // Проверяем что сообщение об ошибке пустое или не отображается
    const errorText = await errorElement.textContent();
    expect(errorText?.trim()).toBe('');
  }

  @logStep('Check all fields are cleared')
  async checkAllFieldsCleared() {
    // Проверяем что все поля пустые
    await expect(this.usernameInput).toHaveValue('');
    await expect(this.firstNameInput).toHaveValue('');
    await expect(this.lastNameInput).toHaveValue('');
    await expect(this.passwordInput).toHaveValue('');
    await expect(this.confirmPasswordInput).toHaveValue('');
  }

  @logStep('Check all validation states are reset')
  async checkAllValidationStatesReset() {
    // Проверяем что поля не имеют классов валидации
    await expect(this.usernameInput).not.toHaveClass(/is-valid|is-invalid/);
    await expect(this.firstNameInput).not.toHaveClass(/is-valid|is-invalid/);
    await expect(this.lastNameInput).not.toHaveClass(/is-valid|is-invalid/);
    await expect(this.passwordInput).not.toHaveClass(/is-valid|is-invalid/);
    await expect(this.confirmPasswordInput).not.toHaveClass(/is-valid|is-invalid/);

    // Проверяем что сообщения об ошибках пустые
    await this.checkValidationErrorNotShown('username');
    await this.checkValidationErrorNotShown('firstName');
    await this.checkValidationErrorNotShown('lastName');
    await this.checkValidationErrorNotShown('password');
    await this.checkValidationErrorNotShown('confirmPassword');
  }

  @logStep('Check form validation states')
  async checkFormValidationStates(expectedStates: Record<string, 'valid' | 'invalid'>) {
    for (const [fieldName, expectedState] of Object.entries(expectedStates)) {
      await this.checkFieldValidationState(fieldName, expectedState);
    }
  }

  @logStep('Check save button is disabled')
  async checkSaveButtonDisabled() {
    await expect(this.saveButton).toBeDisabled();
  }

  @logStep('Check save button is enabled')
  async checkSaveButtonEnabled() {
    await expect(this.saveButton).toBeEnabled();
  }

  // Helper methods
  private getFieldByName(fieldName: string): Locator {
    const fieldMap: Record<string, Locator> = {
      username: this.usernameInput,
      firstName: this.firstNameInput,
      lastName: this.lastNameInput,
      password: this.passwordInput,
      confirmPassword: this.confirmPasswordInput,
    };

    const field = fieldMap[fieldName];
    if (!field) {
      throw new Error(`Field '${fieldName}' not found`);
    }
    return field;
  }

  private getErrorElementByFieldName(fieldName: string): Locator {
    const errorMap: Record<string, Locator> = {
      username: this.usernameError,
      firstName: this.firstNameError,
      lastName: this.lastNameError,
      password: this.passwordError,
      confirmPassword: this.confirmPasswordError,
    };

    const errorElement = errorMap[fieldName];
    if (!errorElement) {
      throw new Error(`Error element for field '${fieldName}' not found`);
    }
    return errorElement;
  }
}
