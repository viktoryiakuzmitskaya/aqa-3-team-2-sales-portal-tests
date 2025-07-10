import { NOTIFICATIONS } from 'data/notifications.data';
import { ORDER_STATUSES } from 'data/orders/orders.data';
import { TAGS } from 'data/tags';
import { test, expect } from 'fixtures';

test.describe('[UI] [Orders] Cancel Order', () => {
  const testCases = [
    { testTitle: 'Canceled draft order', method: 'createDraftOrder' },
    { testTitle: 'Canceled in process order', method: 'createInProsessOrder' },
    {
      testTitle: 'Canceled draft with delivery order',
      method: 'createDraftOrderWithDelivery',
    },
  ] as const;

  testCases.forEach(({ testTitle, method }) => {
    test(
      testTitle,
      { tag: [TAGS.UI, TAGS.SMOKE, TAGS.ORDER] },
      async ({
        orderService,
        signInService,
        headerPage,
        orderListPage,
        orderDetailsPage,
        confirmationModal,
        orderDetailsHeader,
        signInUIService,
      }) => {
        const token = await signInService.loginAsLocalUser();
        const orderId = (await orderService[method](token, 1))._id;

        await test.step('Login via UI and open Orders module', async () => {
          await signInUIService.signInAsLocalUser();
          await headerPage.clickModule('Orders');
        });

        await test.step('Cancel the order via UI', async () => {
          await orderListPage.clickOrderDetails(orderId);
          await orderDetailsPage.waitForOpened();
          await orderDetailsHeader.clickCancelOrder();
          await orderDetailsPage.waitForSpinner();
          await confirmationModal.clickYesButton();
          await orderDetailsPage.waitForSpinner();
        });

        await test.step('Check cancellation notification and order status', async () => {
          await orderListPage.waitForNotification(NOTIFICATIONS.ORDER_CANCELED);

          const updatedStatus = await orderDetailsHeader.getOrderStatus();
          await expect(updatedStatus, 'Order status is incorrect').toBe(ORDER_STATUSES.CANCELED);

          await expect(
            orderDetailsHeader.reopenOrderButton,
            'Reopen order button is not displayed',
          ).toBeVisible();
        });
      },
    );
  });
});

test.describe('[UI] [Orders] Reopen order', () => {
  test(
    'Reopen canceled order (in process)',
    { tag: [TAGS.UI, TAGS.SMOKE, TAGS.ORDER] },
    async ({
      orderService,
      signInService,
      headerPage,
      orderListPage,
      orderDetailsPage,
      confirmationModal,
      orderDetailsHeader,
      signInUIService,
    }) => {
      const token = await signInService.loginAsLocalUser();
      const orderId = (await orderService.createCanceled(token, { productCount: 1 }))._id;

      await test.step('Login via UI and open Orders module', async () => {
        await signInUIService.signInAsLocalUser();
        await headerPage.clickModule('Orders');
      });

      await test.step('Reopen the canceled order via UI', async () => {
        await orderListPage.clickOrderDetails(orderId);
        await orderDetailsPage.waitForOpened();
        await orderDetailsHeader.clickReopenOrder();
        await orderDetailsPage.waitForSpinner();
        await confirmationModal.clickYesButton();
        await orderDetailsPage.waitForSpinner();
      });

      await test.step('Check reopen notification and order status', async () => {
        await orderListPage.waitForNotification(NOTIFICATIONS.ORDER_REOPENED);

        const updatedStatus = await orderDetailsHeader.getOrderStatus();
        await expect(updatedStatus, 'Order status is incorrect').toBe(ORDER_STATUSES.DRAFT);

        await expect(
          orderDetailsHeader.cancelOrderButton,
          'Cancel button is not displayed',
        ).toBeVisible();
      });
    },
  );
});
