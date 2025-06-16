import { ERRORS } from 'data/errorMessages';
import { getCustomerSchemaAll } from 'data/schemas/customers/get.customers.all.schema';
import { STATUS_CODES } from 'data/status.code';
import { TAGS } from 'data/tages';
import { expect, test } from 'fixtures';
import { validateResponse } from 'utils/notifications/validations/responseValidation';
import { validateSchema } from 'utils/notifications/validations/schemaValidation';

test.describe('[API] [Customers] [Get All Customers]', () => {
  const id = '';
  let token = '';
  test.beforeAll(
    'Create customer with smoke data and Controller',
    async ({ signInService, customerService }) => {
      token = await signInService.loginAsLocalUser();
      await customerService.create(token);
    },
  );

  test(
    'Should GET the customer All',
    { tag: [TAGS.SMOKE, TAGS.API, TAGS.REGRESSION, TAGS.CUSTOMERS] },
    async function ({ customerController }) {
      const response = await customerController.getAll(token);
      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(getCustomerSchemaAll, response.body);
    },
  );
  test(
    'Should get error with incorrect authorization token',
    { tag: [TAGS.API, TAGS.REGRESSION, TAGS.CUSTOMERS] },
    async function ({ customerController }) {
      const response = await customerController.getAll(token.slice(1));
      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERRORS.UNAUTHORIZED);
    },
  );
  test.afterEach(async ({ customerController }) => {
    if (!id) return;
    const response = await customerController.delete(id, token);
    expect.soft(response.status).toBe(STATUS_CODES.DELETED);
  });
});
