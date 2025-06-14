import { test as controllers } from 'fixtures/controllers.fixtures';
import { test as services } from 'fixtures/services.fixtures';
import { test as validToken } from 'fixtures/validToken.fixture';
import { expect, mergeTests } from '@playwright/test';

const test = mergeTests(services, controllers, validToken);

export { expect, test };
