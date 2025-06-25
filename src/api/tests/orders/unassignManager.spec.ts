import { USER_ID } from 'config/environment';
import { ERRORS } from 'data/errorMessages';
import { ORDER_HISTORY_ACTIONS } from 'data/orders/orders.data';
import { baseSchema } from 'data/schemas/base.schema';
import { orderSchema } from 'data/schemas/orders/order.schema';
import { STATUS_CODES } from 'data/status.code';
import { TAGS } from 'data/tags';
import { expect, test } from 'fixtures';
import { IOrderFromResponse } from 'types/orders.type';
import { generateUniqueId } from 'utils/generateUniqueID.utils';
import { validateResponse } from 'utils/notifications/validations/responseValidation';
import { validateSchema } from 'utils/notifications/validations/schemaValidation';

test.describe('[API] [Orders] [Unassign Manager | status Draft]', () => {
  let token = '';
  let orderId = '';
  let order: IOrderFromResponse;
  const managerID = USER_ID;
  let orderWithManager: IOrderFromResponse;

  test.beforeEach(async ({ signInService, orderService }) => {
    token = await signInService.loginAsLocalUser();
    order = await orderService.createDraftOrder(token);
    orderWithManager = await orderService.assignManager(order._id, managerID, token);
    orderId = orderWithManager._id;
  });

  test.afterEach(async ({ orderService }) => {
    await orderService.fullDelete(orderId, token);
  });

  test(
    'Should unassign manager with all valid data',
    {
      tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ orderController }) => {
      const response = await orderController.unassignManager(orderWithManager._id, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body.Order);

      await test.step('Validated that assigned manager is null', () => {
        expect.soft(response.body.Order.assignedManager).toEqual(null);
      });
      await test.step('Validated that order history contains MANAGER_UNASSIGNED action', () => {
        expect
          .soft(response.body.Order.history[0].action)
          .toBe(ORDER_HISTORY_ACTIONS.MANAGER_UNASSIGNED);
      });
    },
  );

  test(
    'Should NOT unassign manager with invalid token',
    {
      tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ orderController }) => {
      const incorrectToken = '12345';
      const response = await orderController.unassignManager(orderWithManager._id, incorrectToken);
      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERRORS.UNAUTHORIZED);
      validateSchema(baseSchema, response.body);
    },
  );

  test(
    'Should NOT unassign manager with missing token',
    {
      tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ orderController }) => {
      const emptyToken = '';
      const response = await orderController.unassignManager(orderWithManager._id, emptyToken);
      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERRORS.NOT_AUTHORIZED);
      validateSchema(baseSchema, response.body);
    },
  );

  test(
    'Should NOT unassign manager with  nonexistent orderId valid format',
    {
      tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ orderController }) => {
      const nonexistentOrderId = generateUniqueId();
      const response = await orderController.unassignManager(nonexistentOrderId, token);
      validateResponse(
        response,
        STATUS_CODES.NOT_FOUND,
        false,
        ERRORS.ORDER_NOT_FOUND(nonexistentOrderId),
      );
      validateSchema(baseSchema, response.body);
    },
  );

  test(
    'Should allow unassigning when no manager is assigned',
    {
      tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ orderController }) => {
      const response = await orderController.unassignManager(order._id, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      await test.step('Validated that assigned manager is null', () => {
        expect.soft(response.body.Order.assignedManager).toEqual(null);
      });
      await test.step('Validated that order history contains MANAGER_UNASSIGNED action', () => {
        expect
          .soft(response.body.Order.history[0].action)
          .toBe(ORDER_HISTORY_ACTIONS.MANAGER_UNASSIGNED);
      });
    },
  );
});

test.describe('[API] [Orders] [Unassign Manager  with all valid data| Other statuses]', () => {
  let token = '';
  let orderId = '';
  let order: IOrderFromResponse;
  const managerID = USER_ID;

  test.beforeEach(async ({ signInService, orderService }) => {
    token = await signInService.loginAsLocalUser();
    order = await orderService.createDraftOrder(token);
    orderId = order._id;
  });

  test.afterEach(async ({ orderService }) => {
    await orderService.fullDelete(orderId, token);
  });

  test(
    'Should unassign manager successfully for Canceled order',
    {
      tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ orderController, orderService }) => {
      const order = await orderService.createCanceled(token);
      const orderWithManager = await orderService.assignManager(order._id, managerID, token);
      const response = await orderController.unassignManager(orderWithManager._id, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body.Order);

      await test.step('Validated that assigned manager is null', () => {
        expect.soft(response.body.Order.assignedManager).toEqual(null);
      });
      await test.step('Validated that order history contains MANAGER_UNASSIGNED action', () => {
        expect
          .soft(response.body.Order.history[0].action)
          .toBe(ORDER_HISTORY_ACTIONS.MANAGER_UNASSIGNED);
      });
    },
  );

  test(
    'Should unassign manager successfully for Draft order with delivery',
    {
      tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ orderController, orderService }) => {
      const order = await orderService.createDraftOrderWithDelivery(token);
      const orderWithManager = await orderService.assignManager(order._id, managerID, token);
      const response = await orderController.unassignManager(orderWithManager._id, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body.Order);

      await test.step('Validated that assigned manager is null', () => {
        expect.soft(response.body.Order.assignedManager).toEqual(null);
      });
      await test.step('Validated that order history contains MANAGER_UNASSIGNED action', () => {
        expect
          .soft(response.body.Order.history[0].action)
          .toBe(ORDER_HISTORY_ACTIONS.MANAGER_UNASSIGNED);
      });
    },
  );

  test(
    'Should unassign manager successfully for InProcess order',
    {
      tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ orderController, orderService }) => {
      const order = await orderService.createInProsessOrder(token);
      const orderWithManager = await orderService.assignManager(order._id, managerID, token);
      const response = await orderController.unassignManager(orderWithManager._id, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body.Order);

      await test.step('Validated that assigned manager is null', () => {
        expect.soft(response.body.Order.assignedManager).toEqual(null);
      });
      await test.step('Validated that order history contains MANAGER_UNASSIGNED action', () => {
        expect
          .soft(response.body.Order.history[0].action)
          .toBe(ORDER_HISTORY_ACTIONS.MANAGER_UNASSIGNED);
      });
    },
  );

  test(
    'Should unassign manager successfully for Partially Received order',
    {
      tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ orderController, orderService }) => {
      const order = await orderService.createOrderInPartiallyReceivedStatus(token);
      const orderWithManager = await orderService.assignManager(order._id, managerID, token);
      const response = await orderController.unassignManager(orderWithManager._id, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body.Order);

      await test.step('Validated that assigned manager is null', () => {
        expect.soft(response.body.Order.assignedManager).toEqual(null);
      });
      await test.step('Validated that order history contains MANAGER_UNASSIGNED action', () => {
        expect
          .soft(response.body.Order.history[0].action)
          .toBe(ORDER_HISTORY_ACTIONS.MANAGER_UNASSIGNED);
      });
    },
  );

  test(
    'Should unassign manager successfully for Received order',
    {
      tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ orderController, orderService }) => {
      const order = await orderService.createOrderInRecivedStatus(token);
      const orderWithManager = await orderService.assignManager(order._id, managerID, token);
      const response = await orderController.unassignManager(orderWithManager._id, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body.Order);

      await test.step('Validated that assigned manager is null', () => {
        expect.soft(response.body.Order.assignedManager).toEqual(null);
      });
      await test.step('Validated that order history contains MANAGER_UNASSIGNED action', () => {
        expect
          .soft(response.body.Order.history[0].action)
          .toBe(ORDER_HISTORY_ACTIONS.MANAGER_UNASSIGNED);
      });
    },
  );
});
