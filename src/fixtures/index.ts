import { test as serviceTest } from './services.fixtures';
import { test as controllerTest } from './controllers.fixtures';
import { test as dataTest } from './data.fixtures';
import { test as pagesTest } from './pages.fixtures';
import { mergeTests } from '@playwright/test';

export const test = mergeTests(serviceTest, controllerTest, dataTest, pagesTest);

export { expect } from '@playwright/test';
