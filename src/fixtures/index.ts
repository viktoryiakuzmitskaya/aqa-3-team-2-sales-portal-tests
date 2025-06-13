import { test as controllers } from 'fixtures/controllers.fixtures';
import { test as services } from 'fixtures/services.fixtures';
import { expect, mergeTests } from '@playwright/test';

const test = mergeTests(services, controllers);

export { expect, test };
