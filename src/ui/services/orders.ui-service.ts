import { Page } from '@playwright/test';
import { OrdersListPage } from 'ui/pages/orders/ordersList.page';
import { logStep } from 'utils/reporter.utils';

export class OrdersUIService {
  readonly ordersListPage: OrdersListPage;

  constructor(private page: Page) {
    this.ordersListPage = new OrdersListPage(page);
  }

  @logStep('Open Orders List page as logged in user')
  async openOrdersList() {
    await this.ordersListPage.open();
  }

  @logStep('Search for orders with text: {searchText}')
  async searchOrders(searchText: string) {
    await this.ordersListPage.searchOrders(searchText);
  }

  @logStep('Clear search')
  async clearSearch() {
    await this.ordersListPage.clearSearch();
  }

  @logStep('Create new order')
  async createNewOrder() {
    await this.ordersListPage.clickCreateOrder();
  }

  @logStep('Open create order modal')
  async openCreateOrderModal() {
    return await this.ordersListPage.openCreateOrderModal();
  }

  @logStep('Open filter modal')
  async openFilters() {
    return await this.ordersListPage.openFiltersModal();
  }

  @logStep('Sort orders by {columnName}')
  async sortOrdersByColumn(
    columnName:
      | 'orderNumber'
      | 'email'
      | 'price'
      | 'delivery'
      | 'status'
      | 'assignedManager'
      | 'createdOn',
  ) {
    await this.ordersListPage.sortByColumn(columnName);
  }

  @logStep('Navigate to order details for order: {orderNumber}')
  async openOrderDetails(orderNumber: string) {
    await this.ordersListPage.navigateToOrderDetails(orderNumber);
  }

  @logStep('Reopen canceled order: {orderNumber}')
  async reopenOrder(orderNumber: string) {
    await this.ordersListPage.clickReopenOrder(orderNumber);
  }

  @logStep('Set items per page to: {itemsCount}')
  async setItemsPerPage(itemsCount: '10' | '25' | '50' | '100') {
    await this.ordersListPage.setItemsPerPage(itemsCount);
  }

  @logStep('Navigate to page number: {pageNumber}')
  async goToPage(pageNumber: number) {
    await this.ordersListPage.goToPage(pageNumber);
  }

  @logStep('Navigate to next page of orders')
  async goToNextPage() {
    if (await this.ordersListPage.isNextPageEnabled()) {
      await this.ordersListPage.goToNextPage();
    }
  }

  @logStep('Navigate to previous page of orders')
  async goToPreviousPage() {
    if (await this.ordersListPage.isPreviousPageEnabled()) {
      await this.ordersListPage.goToPreviousPage();
    }
  }

  @logStep('Get complete order information by row index: {rowIndex}')
  async getOrderInfo(rowIndex: number) {
    return await this.ordersListPage.getOrderData(rowIndex);
  }

  @logStep('Get order number by row index: {rowIndex}')
  async getOrderNumber(rowIndex: number): Promise<string> {
    return await this.ordersListPage.getOrderNumber(rowIndex);
  }

  @logStep('Get order status by row index: {rowIndex}')
  async getOrderStatus(rowIndex: number): Promise<string> {
    return await this.ordersListPage.getOrderStatus(rowIndex);
  }

  @logStep('Get order email by row index: {rowIndex}')
  async getOrderEmail(rowIndex: number): Promise<string> {
    return await this.ordersListPage.getOrderEmail(rowIndex);
  }

  @logStep('Verify orders list is loaded and visible')
  async verifyOrdersListLoaded() {
    await this.ordersListPage.waitForOpened();
    await this.ordersListPage.waitForTableToLoad();
  }

  @logStep('Get number of visible orders on current page')
  async getVisibleOrdersCount(): Promise<number> {
    return await this.ordersListPage.getVisibleOrdersCount();
  }

  @logStep('Get current page number')
  async getCurrentPage(): Promise<number> {
    return await this.ordersListPage.getCurrentPageNumber();
  }

  @logStep('Check if pagination controls are available')
  async isPaginationAvailable(): Promise<{ hasNext: boolean; hasPrevious: boolean }> {
    return {
      hasNext: await this.ordersListPage.isNextPageEnabled(),
      hasPrevious: await this.ordersListPage.isPreviousPageEnabled(),
    };
  }

  @logStep('Verify order appears in the list: {orderNumber}')
  async verifyOrderInList(orderNumber: string) {
    const orderRow = this.ordersListPage.getOrderRowByNumber(orderNumber);
    await orderRow.waitFor({ state: 'visible' });
  }

  @logStep('Check if order can be reopened: {orderNumber}')
  async canReopenOrder(orderNumber: string): Promise<boolean> {
    return await this.ordersListPage.hasReopenButton(orderNumber);
  }

  @logStep('Verify table contains orders')
  async verifyTableHasOrders(): Promise<boolean> {
    const ordersCount = await this.getVisibleOrdersCount();
    return ordersCount > 0;
  }

  @logStep('Get all order numbers from current page')
  async getAllOrderNumbers(): Promise<string[]> {
    const ordersCount = await this.getVisibleOrdersCount();
    const orderNumbers: string[] = [];

    for (let i = 0; i < ordersCount; i++) {
      const orderNumber = await this.getOrderNumber(i);
      orderNumbers.push(orderNumber);
    }

    return orderNumbers;
  }

  @logStep('Get all order statuses from current page')
  async getAllOrderStatuses(): Promise<string[]> {
    const ordersCount = await this.getVisibleOrdersCount();
    const statuses: string[] = [];

    for (let i = 0; i < ordersCount; i++) {
      const status = await this.getOrderStatus(i);
      statuses.push(status);
    }

    return statuses;
  }

  @logStep('Find order by number: {orderNumber}')
  async findOrderByNumber(orderNumber: string): Promise<number | null> {
    const ordersCount = await this.getVisibleOrdersCount();

    for (let i = 0; i < ordersCount; i++) {
      const currentOrderNumber = await this.getOrderNumber(i);
      if (currentOrderNumber === orderNumber) {
        return i;
      }
    }

    return null;
  }

  @logStep('Wait for search results to load')
  async waitForSearchResults() {
    await this.ordersListPage.waitForSpinner();
    await this.ordersListPage.waitForTableToLoad();
  }

  @logStep('Verify search results contain: {searchText}')
  async verifySearchResults(searchText: string): Promise<boolean> {
    const ordersCount = await this.getVisibleOrdersCount();

    if (ordersCount === 0) return false;

    // Check if any order contains the search text in order number or email
    for (let i = 0; i < ordersCount; i++) {
      const orderData = await this.getOrderInfo(i);
      if (orderData.orderNumber.includes(searchText) || orderData.email.includes(searchText)) {
        return true;
      }
    }

    return false;
  }

  // ============= FILTERS METHODS =============

  @logStep('Open filters modal')
  async openFiltersModal() {
    return await this.ordersListPage.openFiltersModal();
  }

  @logStep('Filter orders by status: {status}')
  async filterByStatus(
    status: 'Draft' | 'In Process' | 'Partially Received' | 'Received' | 'Canceled',
  ) {
    const filtersModal = await this.openFiltersModal();
    await filtersModal.selectStatusFilter(status);
    await filtersModal.applyFiltersAndClose();
    await this.waitForSearchResults();
  }

  @logStep('Filter orders by multiple statuses: {statuses}')
  async filterByMultipleStatuses(
    statuses: Array<'Draft' | 'In Process' | 'Partially Received' | 'Received' | 'Canceled'>,
  ) {
    const filtersModal = await this.openFiltersModal();
    await filtersModal.selectMultipleStatusFilters(statuses);
    await filtersModal.applyFiltersAndClose();
    await this.waitForSearchResults();
  }

  @logStep('Clear all filters')
  async clearAllFilters() {
    const filtersModal = await this.openFiltersModal();
    await filtersModal.clearFiltersAndClose();
    await this.waitForSearchResults();
  }

  @logStep('Get currently selected filters')
  async getSelectedFilters(): Promise<string[]> {
    const filtersModal = await this.openFiltersModal();
    const selectedFilters = await filtersModal.getSelectedStatusFilters();
    await filtersModal.close();
    return selectedFilters;
  }

  @logStep('Verify filtered results contain only status: {status}')
  async verifyFilteredByStatus(status: string): Promise<boolean> {
    const ordersCount = await this.getVisibleOrdersCount();

    if (ordersCount === 0) return false;

    // Check if all orders have the filtered status
    for (let i = 0; i < ordersCount; i++) {
      const orderStatus = await this.getOrderStatus(i);
      if (orderStatus !== status) {
        return false;
      }
    }

    return true;
  }

  @logStep('Verify filtered results contain only statuses: {statuses}')
  async verifyFilteredByMultipleStatuses(statuses: string[]): Promise<boolean> {
    const ordersCount = await this.getVisibleOrdersCount();

    if (ordersCount === 0) return false;

    // Check if all orders have one of the filtered statuses
    for (let i = 0; i < ordersCount; i++) {
      const orderStatus = await this.getOrderStatus(i);
      if (!statuses.includes(orderStatus)) {
        return false;
      }
    }

    return true;
  }

  @logStep('Toggle status filter: {status}')
  async toggleStatusFilter(
    status: 'Draft' | 'In Process' | 'Partially Received' | 'Received' | 'Canceled',
  ) {
    const filtersModal = await this.openFiltersModal();
    await filtersModal.toggleStatusFilter(status);
    await filtersModal.applyFiltersAndClose();
    await this.waitForSearchResults();
  }

  @logStep('Apply custom filters configuration')
  async applyCustomFilters(config: {
    statuses?: Array<'Draft' | 'In Process' | 'Partially Received' | 'Received' | 'Canceled'>;
    clearFirst?: boolean;
  }) {
    const filtersModal = await this.openFiltersModal();

    // Clear all filters first if requested
    if (config.clearFirst) {
      await filtersModal.unselectAllStatusFilters();
    }

    // Apply status filters if specified
    if (config.statuses && config.statuses.length > 0) {
      await filtersModal.selectMultipleStatusFilters(config.statuses);
    }

    await filtersModal.applyFiltersAndClose();
    await this.waitForSearchResults();
  }
}
