import { faker } from '@faker-js/faker';
import { ICreateManagerData } from 'ui/pages/managers/createManager.page';

export function generateManagerData(customData?: Partial<ICreateManagerData>): ICreateManagerData {
  const username = faker.internet.userName();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const password = faker.internet.password({ length: 12 });

  const defaultData: ICreateManagerData = {
    username,
    firstName,
    lastName,
    password,
    confirmPassword: password,
  };

  return { ...defaultData, ...customData };
}

export function generateValidManagerData(): ICreateManagerData {
  return generateManagerData({
    username: `manager_${faker.string.alphanumeric(6).toLowerCase()}`,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!',
  });
}

export function generateInvalidManagerData(): Record<string, Partial<ICreateManagerData>> {
  return {
    emptyUsername: {
      username: '',
      firstName: 'John',
      lastName: 'Doe',
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!',
    },
    shortUsername: {
      username: 'ab',
      firstName: 'John',
      lastName: 'Doe',
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!',
    },
    emptyFirstName: {
      username: 'validuser',
      firstName: '',
      lastName: 'Doe',
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!',
    },
    emptyLastName: {
      username: 'validuser',
      firstName: 'John',
      lastName: '',
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!',
    },
    emptyPassword: {
      username: 'validuser',
      firstName: 'John',
      lastName: 'Doe',
      password: '',
      confirmPassword: '',
    },
    shortPassword: {
      username: 'validuser',
      firstName: 'John',
      lastName: 'Doe',
      password: '123',
      confirmPassword: '123',
    },
    passwordMismatch: {
      username: 'validuser',
      firstName: 'John',
      lastName: 'Doe',
      password: 'SecurePass123!',
      confirmPassword: 'DifferentPass456!',
    },
    emptyConfirmPassword: {
      username: 'validuser',
      firstName: 'John',
      lastName: 'Doe',
      password: 'SecurePass123!',
      confirmPassword: '',
    },
  };
}

export const MANAGER_VALIDATION_MESSAGES = {
  USERNAME_REQUIRED: 'Username is required',
  USERNAME_TOO_SHORT: 'Username must be at least 3 characters long',
  USERNAME_ALREADY_EXISTS: 'Username already exists',
  FIRST_NAME_REQUIRED: 'First name is required.',
  LAST_NAME_REQUIRED: 'Last name is required.',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
  PASSWORD_WEAK:
    'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required.',
  PASSWORDS_NOT_MATCH: 'Passwords do not match',
};

export const MANAGER_NOTIFICATIONS = {
  CREATED: 'Manager was successfully created',
  UPDATED: 'Manager was successfully updated',
  DELETED: 'Manager was successfully deleted',
  CREATION_FAILED: 'Failed to create manager',
  VALIDATION_FAILED: 'Please fix validation errors',
};
