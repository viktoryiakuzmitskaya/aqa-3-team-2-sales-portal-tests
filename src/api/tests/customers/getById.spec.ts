import { ERRORS } from 'data/errorMessages';
import { getCustomersSchemaById } from 'data/schemas/customers/get.customers.id.schema';
import { STATUS_CODES } from 'data/status.code';
import { TAGS } from 'data/tages';
import { expect, test } from 'fixtures';
import { ICustomerFromResponse } from 'types/customer.types';
import { validateResponse } from 'utils/notifications/validations/responseValidation';
import { validateSchema } from 'utils/notifications/validations/schemaValidation';

test.describe('[API] [Customers] [Get By Id]', () => {
  const id = '';
  let token = '';
  let customer: ICustomerFromResponse;

  test.beforeAll(
    'Create customer with smoke data and Controller',
    async ({ signInService, customerService }) => {
      token = await signInService.loginAsLocalUser();
      customer = await customerService.create(token);
    },
  );

  test(
    'Should GET the customer by correct ID',
    { tag: [TAGS.SMOKE, TAGS.API, TAGS.REGRESSION, TAGS.CUSTOMERS] },
    async function ({ customerController }) {
      const response = await customerController.getById(customer._id, token);
      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(getCustomersSchemaById, response.body);
    },
  );
  test(
    'Should NOT GET the customer by ID with incorrect authorization token',
    { tag: [TAGS.API, TAGS.REGRESSION, TAGS.CUSTOMERS] },
    async function ({ customerController }) {
      const response = await customerController.getById(customer._id, token.slice(1));
      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERRORS.UNAUTHORIZED);
    },
  );
  test(
    ' Should NOT GET customer by incorrect ID',
    { tag: [TAGS.API, TAGS.REGRESSION, TAGS.CUSTOMERS] },
    async function ({ customerController }) {
      const incorrectID = '684c09381c508c5d5e52ba5e';
      const response = await customerController.getById(incorrectID, token);
      validateResponse(
        response,
        STATUS_CODES.NOT_FOUND,
        false,
        ERRORS.CUSTOMER_NOT_FOUND(incorrectID),
      );
    },
  );
  test.afterEach(async ({ customerController }) => {
    if (!id) return;
    const response = await customerController.delete(id, token);
    expect.soft(response.status).toBe(STATUS_CODES.DELETED);
  });
});
