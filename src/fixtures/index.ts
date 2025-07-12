import { test as controllerTest } from './controllers.fixtures';
import { test as serviceTest } from './services.fixtures';
import { test as dataTest } from './data.fixtures';
import { mergeTests } from '@playwright/test';
import { test as pagesTest } from '../ui/fixtures/pages.fixture';
import { test as uiServicesTest } from '../ui/fixtures/ui-services.fixture';
import { test as uiServices } from '../ui/fixtures/ui-services.fixture';
import { test as pages } from '../ui/fixtures/pages.fixture';

export const test = mergeTests(
  controllerTest,
  serviceTest,
  dataTest,
  pagesTest,
  uiServicesTest,
  uiServices,
  pages,
);

export { expect } from '@playwright/test';
