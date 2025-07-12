import { test as serviceTest } from '../../fixtures/services.fixtures';
import { test as controllerTest } from '../../fixtures/controllers.fixtures';
import { test as dataTest } from '../../fixtures/data.fixtures';
import { test as uiServicesTest } from './ui-services.fixture';
import { test as pagesTest } from './pages.fixture';
import { mergeTests } from '@playwright/test';

export const test = mergeTests(serviceTest, controllerTest, dataTest, uiServicesTest, pagesTest);

export { expect } from '@playwright/test';
