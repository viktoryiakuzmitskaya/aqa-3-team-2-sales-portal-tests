import { test as controllerTest } from './controllers.fixtures';
import { test as serviceTest } from './services.fixtures';
import { test as dataTest } from './data.fixtures';
import { mergeTests } from '@playwright/test';

export const test = mergeTests(controllerTest, serviceTest, dataTest);

export { expect } from '@playwright/test';
