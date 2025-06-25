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

test.describe('[API] [Orders] [Assign Manager | status Draft]', () => {
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
    'Should assign manager successfully for Draft order',
    {
      tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ orderController }) => {
      const response = await orderController.updateAssignManager(order._id, managerID, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body.Order);

      await test.step('Check assigned manager ID', () => {
        expect
          .soft(response.body.Order.assignedManager, 'Assigned manager is not found')
          .toBeDefined();
        expect.soft(response.body.Order.assignedManager?._id).toEqual(managerID);
      });
      await test.step('Check MANAGER_ASSIGNED in order history', () => {
        expect
          .soft(response.body.Order.history[0].action)
          .toBe(ORDER_HISTORY_ACTIONS.MANAGER_ASSIGNED);
      });
    },
  );

  test(
    'Should reassign manager successfully for Draft order',
    {
      tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ orderController }) => {
      await orderController.updateAssignManager(order._id, managerID, token);
      const secondAssignResponse = await orderController.updateAssignManager(
        order._id,
        managerID,
        token,
      );
      validateResponse(secondAssignResponse, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, secondAssignResponse.body.Order);

      await test.step('Check reassigned manager ID', () => {
        expect
          .soft(secondAssignResponse.body.Order.assignedManager, 'Assigned manager is not found')
          .toBeDefined();
        expect.soft(secondAssignResponse.body.Order.assignedManager?._id).toEqual(managerID);
      });
      await test.step('Check MANAGER_ASSIGNED in order history', () => {
        expect
          .soft(secondAssignResponse.body.Order.history[0].action)
          .toBe(ORDER_HISTORY_ACTIONS.MANAGER_ASSIGNED);
      });
    },
  );

  test(
    'Should NOT assign manager with invalid token for Draft order',
    {
      tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ orderController }) => {
      const incorrectToken = '12345';
      const response = await orderController.updateAssignManager(
        order._id,
        managerID,
        incorrectToken,
      );
      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERRORS.UNAUTHORIZED);
      validateSchema(baseSchema, response.body);
    },
  );

  test(
    'Should NOT assign manager with missing token for Draft order',
    {
      tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ orderController }) => {
      const emptyToken = '';
      const response = await orderController.updateAssignManager(order._id, managerID, emptyToken);
      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERRORS.NOT_AUTHORIZED);
      validateSchema(baseSchema, response.body);
    },
  );

  test(
    'Should NOT assign manager for non-existent orderId (valid format)',
    {
      tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ orderController }) => {
      const nonexistentOrderId = generateUniqueId();
      const response = await orderController.updateAssignManager(
        nonexistentOrderId,
        managerID,
        token,
      );
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
    'Should NOT assign manager for non-existent managerId',
    {
      tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ orderController }) => {
      const nonexistentManagerId = generateUniqueId();
      const response = await orderController.updateAssignManager(
        order._id,
        nonexistentManagerId,
        token,
      );
      validateResponse(
        response,
        STATUS_CODES.NOT_FOUND,
        false,
        ERRORS.MANAGER_NOT_FOUND(nonexistentManagerId),
      );
      validateSchema(baseSchema, response.body);
    },
  );
});

test.describe('[API] [Orders] [Assign Manager with all valid data| Other statuses]', () => {
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
    'Should assign manager successfully for Canceled order',
    {
      tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ orderController, orderService }) => {
      order = await orderService.createCanceled(token);
      const response = await orderController.updateAssignManager(order._id, managerID, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body.Order);

      await test.step('Check assigned manager ID', () => {
        expect
          .soft(response.body.Order.assignedManager, 'Assigned manager is not found')
          .toBeDefined();
        expect.soft(response.body.Order.assignedManager?._id).toEqual(managerID);
      });
      await test.step('Check MANAGER_ASSIGNED in order history', () => {
        expect
          .soft(response.body.Order.history[0].action)
          .toBe(ORDER_HISTORY_ACTIONS.MANAGER_ASSIGNED);
      });
    },
  );

  test(
    'Should assign manager successfully for Draft order with delivery',
    {
      tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ orderController, orderService }) => {
      order = await orderService.createDraftOrderWithDelivery(token);
      const response = await orderController.updateAssignManager(order._id, managerID, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body.Order);
      await test.step('Check assigned manager ID', () => {
        expect
          .soft(response.body.Order.assignedManager, 'Assigned manager is not found')
          .toBeDefined();
        expect.soft(response.body.Order.assignedManager?._id).toEqual(managerID);
      });
      await test.step('Check MANAGER_ASSIGNED in order history', () => {
        expect
          .soft(response.body.Order.history[0].action)
          .toBe(ORDER_HISTORY_ACTIONS.MANAGER_ASSIGNED);
      });
    },
  );

  test(
    'Should assign manager successfully for InProcess order',
    {
      tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ orderController, orderService }) => {
      order = await orderService.createInProsessOrder(token);
      const response = await orderController.updateAssignManager(order._id, managerID, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body.Order);

      await test.step('Check assigned manager ID', () => {
        expect
          .soft(response.body.Order.assignedManager, 'Assigned manager is not found')
          .toBeDefined();
        expect.soft(response.body.Order.assignedManager?._id).toEqual(managerID);
      });
      await test.step('Check MANAGER_ASSIGNED in order history', () => {
        expect
          .soft(response.body.Order.history[0].action)
          .toBe(ORDER_HISTORY_ACTIONS.MANAGER_ASSIGNED);
      });
    },
  );

  test(
    'Should assign manager successfully for Partially Received order',
    {
      tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ orderController, orderService }) => {
      order = await orderService.createOrderInPartiallyReceivedStatus(token);
      const response = await orderController.updateAssignManager(order._id, managerID, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body.Order);

      await test.step('Check assigned manager ID', () => {
        expect
          .soft(response.body.Order.assignedManager, 'Assigned manager is not found')
          .toBeDefined();
        expect.soft(response.body.Order.assignedManager?._id).toEqual(managerID);
      });
      await test.step('Check MANAGER_ASSIGNED in order history', () => {
        expect
          .soft(response.body.Order.history[0].action)
          .toBe(ORDER_HISTORY_ACTIONS.MANAGER_ASSIGNED);
      });
    },
  );

  test(
    'Should assign manager successfully for Received order',
    {
      tag: [TAGS.API, TAGS.ORDER, TAGS.SMOKE, TAGS.REGRESSION],
    },
    async ({ orderController, orderService }) => {
      order = await orderService.createOrderInRecivedStatus(token);
      const response = await orderController.updateAssignManager(order._id, managerID, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderSchema, response.body.Order);

      await test.step('Check assigned manager ID', () => {
        expect
          .soft(response.body.Order.assignedManager, 'Assigned manager is not found')
          .toBeDefined();
        expect.soft(response.body.Order.assignedManager?._id).toEqual(managerID);
      });
      await test.step('Check MANAGER_ASSIGNED in order history', () => {
        expect
          .soft(response.body.Order.history[0].action)
          .toBe(ORDER_HISTORY_ACTIONS.MANAGER_ASSIGNED);
      });
    },
  );
});
