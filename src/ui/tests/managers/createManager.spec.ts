import { TAGS } from 'data/tags';
import { expect, test } from '../../../fixtures/index';
import {
  generateValidManagerData,
  MANAGER_VALIDATION_MESSAGES,
} from 'data/managers/generateManager.data';

test.describe('[UI] [Managers] Create Manager Tests', () => {
  test.beforeEach(async ({ signInUIService }) => {
    await signInUIService.signInAsLocalUser();
  });

  test(
    'Should successfully create manager and verify in list',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE] },
    async ({ managersUIService, page }) => {
      const createPage = await managersUIService.openCreateManagerPage();
      const managerData = generateValidManagerData();

      // Заполняем форму валидными данными
      await createPage.fillManagerForm(managerData);

      // Нажимаем кнопку Save
      await createPage.clickSaveButton();

      // Ждем завершения операции (возможно появится уведомление)
      await page.waitForTimeout(2000);

      // Переходим на страницу списка менеджеров для проверки
      await managersUIService.openManagersList();

      // Ищем созданного менеджера в списке
      await managersUIService.verifyManagerInTable(managerData.firstName, managerData.lastName);
    },
  );

  test(
    'Should display all form elements correctly',
    { tag: [TAGS.UI, TAGS.REGRESSION, TAGS.SMOKE] },
    async ({ managersUIService }) => {
      const createPage = await managersUIService.openCreateManagerPage();

      // Проверяем основные элементы страницы одним блоком
      await expect.soft(createPage.pageTitle).toHaveText('Add New Manager');
      await expect.soft(createPage.usernameInput).toBeVisible();
      await expect.soft(createPage.firstNameInput).toBeVisible();
      await expect.soft(createPage.lastNameInput).toBeVisible();
      await expect.soft(createPage.passwordInput).toBeVisible();
      await expect.soft(createPage.confirmPasswordInput).toBeVisible();
      await expect.soft(createPage.saveButton).toBeVisible();
      await expect.soft(createPage.clearAllButton).toBeVisible();
      await expect.soft(createPage.backLink).toBeVisible();
      await expect(createPage.saveButton).toBeDisabled();
    },
  );

  test(
    'Should handle form filling and clearing',
    { tag: [TAGS.UI, TAGS.REGRESSION] },
    async ({ managersUIService }) => {
      const createPage = await managersUIService.openCreateManagerPage();
      const managerData = generateValidManagerData();

      // Заполняем и проверяем
      await createPage.fillManagerForm(managerData);

      // Проверяем заполнение одним блоком
      await expect.soft(createPage.usernameInput).toHaveValue(managerData.username);
      await expect.soft(createPage.firstNameInput).toHaveValue(managerData.firstName);
      await expect.soft(createPage.lastNameInput).toHaveValue(managerData.lastName);
      await expect.soft(createPage.passwordInput).toHaveValue(managerData.password);
      await expect(createPage.confirmPasswordInput).toHaveValue(managerData.confirmPassword);

      // Очищаем и проверяем
      await createPage.clickClearAllButton();
      await createPage.checkAllFieldsCleared();
    },
  );

  test(
    'Should validate fields correctly',
    { tag: [TAGS.UI, TAGS.REGRESSION] },
    async ({ managersUIService }) => {
      const createPage = await managersUIService.openCreateManagerPage();

      // Тестируем валидацию ошибок (заполняем → очищаем → проверяем)
      // First name validation
      await createPage.fillFirstName('Test');
      await createPage.fillFirstName('');
      await createPage.firstNameInput.blur();
      await createPage.checkFieldValidationColor('firstName', 'red');
      await createPage.checkValidationErrorMessage(
        'firstName',
        MANAGER_VALIDATION_MESSAGES.FIRST_NAME_REQUIRED,
      );

      // Last name validation
      await createPage.fillLastName('User');
      await createPage.fillLastName('');
      await createPage.lastNameInput.blur();
      await createPage.checkFieldValidationColor('lastName', 'red');
      await createPage.checkValidationErrorMessage(
        'lastName',
        MANAGER_VALIDATION_MESSAGES.LAST_NAME_REQUIRED,
      );

      // Confirm password validation
      await createPage.fillConfirmPassword('password123');
      await createPage.fillConfirmPassword('');
      await createPage.confirmPasswordInput.blur();
      await createPage.checkFieldValidationColor('confirmPassword', 'red');
      await createPage.checkValidationErrorMessage(
        'confirmPassword',
        MANAGER_VALIDATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED,
      );

      // Тестируем зеленую валидацию
      const validData = generateValidManagerData();
      await createPage.fillUsername(validData.username);
      await createPage.checkFieldValidationColor('username', 'green');

      await createPage.fillFirstName(validData.firstName);
      await createPage.checkFieldValidationColor('firstName', 'green');

      await createPage.fillLastName(validData.lastName);
      await createPage.checkFieldValidationColor('lastName', 'green');

      await createPage.fillPassword(validData.password);
      await createPage.checkFieldValidationColor('password', 'green');

      await createPage.fillConfirmPassword(validData.confirmPassword);
      await createPage.checkFieldValidationColor('confirmPassword', 'green');
    },
  );

  test(
    'Should handle navigation correctly',
    { tag: [TAGS.UI, TAGS.REGRESSION] },
    async ({ managersUIService, page }) => {
      const createPage = await managersUIService.openCreateManagerPage();

      // Проверяем навигацию назад
      await createPage.fillUsername('testuser');
      await createPage.clickBackLink();
      await page.waitForURL('**/managers');
      expect(page.url()).toMatch(/\/managers$/);

      // Проверяем что кнопка Add Manager видна и имеет правильный текст
      await managersUIService.openManagersList();
      await expect(managersUIService.managersListPage.addManagerButton).toBeVisible();
      await expect(managersUIService.managersListPage.addManagerButton).toHaveText('+ Add Manager');

      // Проверяем прямую навигацию
      await managersUIService.openCreateManagerPage();
      expect(page.url()).toMatch(/\/managers\/add$/);
    },
  );

  test(
    'Should handle save button states',
    { tag: [TAGS.UI, TAGS.REGRESSION] },
    async ({ managersUIService, page }) => {
      const createPage = await managersUIService.openCreateManagerPage();

      // Проверяем изначальное состояние
      await createPage.checkSaveButtonDisabled();

      // Частичное заполнение
      await createPage.fillUsername('testuser');
      await createPage.fillFirstName('Test');
      await page.waitForTimeout(500);
      await createPage.checkSaveButtonDisabled();

      // Полное заполнение
      const managerData = generateValidManagerData();
      await createPage.fillManagerForm(managerData);
      await page.waitForTimeout(500);

      // Проверяем что кнопка стала enabled после полного заполнения
      await expect(createPage.saveButton).toBeEnabled();
    },
  );

  test(
    'Should prevent clicking disabled save button with incomplete data',
    { tag: [TAGS.UI, TAGS.REGRESSION] },
    async ({ managersUIService, page }) => {
      const createPage = await managersUIService.openCreateManagerPage();
      const initialUrl = page.url();

      // Проверяем что кнопка изначально disabled
      await expect(createPage.saveButton).toBeDisabled();
      await expect(createPage.saveButton).toHaveAttribute('disabled');

      // Частично заполняем форму
      await createPage.fillUsername('testuser');
      await createPage.fillFirstName('Test');
      await createPage.fillLastName('User');
      await page.waitForTimeout(500);

      // Кнопка все еще должна быть disabled (нет паролей)
      await expect(createPage.saveButton).toBeDisabled();
      await expect(createPage.saveButton).toHaveAttribute('disabled');

      // Пытаемся кликнуть disabled кнопку - ничего не должно происходить
      await createPage.saveButton.click({ force: true });
      await page.waitForTimeout(1000);

      // Проверяем что остались на той же странице (форма не отправилась)
      expect(page.url()).toBe(initialUrl);
      expect(page.url()).toMatch(/\/managers\/add$/);

      // Дополнительно проверяем что форма все еще содержит введенные данные
      await expect(createPage.usernameInput).toHaveValue('testuser');
      await expect(createPage.firstNameInput).toHaveValue('Test');
      await expect(createPage.lastNameInput).toHaveValue('User');

      // Заполняем оставшиеся обязательные поля
      await createPage.fillPassword('password123');
      await createPage.fillConfirmPassword('password123');
      await page.waitForTimeout(500);

      // Теперь кнопка должна стать доступной
      await expect(createPage.saveButton).toBeEnabled();
      await expect(createPage.saveButton).not.toHaveAttribute('disabled');
    },
  );

  test(
    'Should handle multiple form operations',
    { tag: [TAGS.UI, TAGS.REGRESSION] },
    async ({ managersUIService }) => {
      const createPage = await managersUIService.openCreateManagerPage();

      // Цикл: заполнить → очистить → заполнить → очистить
      const dataset1 = generateValidManagerData();
      const dataset2 = generateValidManagerData();

      // Первый цикл
      await createPage.fillManagerForm(dataset1);
      await expect.soft(createPage.usernameInput).toHaveValue(dataset1.username);
      await createPage.clickClearAllButton();
      await createPage.checkAllFieldsCleared();

      // Второй цикл
      await createPage.fillManagerForm(dataset2);
      await expect.soft(createPage.usernameInput).toHaveValue(dataset2.username);
      await createPage.clickClearAllButton();
      await createPage.checkAllFieldsCleared();
    },
  );
});
