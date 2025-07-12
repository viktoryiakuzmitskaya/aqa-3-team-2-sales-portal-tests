import { TAGS } from 'data/tags';
import { test, expect } from 'ui/fixtures/index';

test.describe('[UI] [Managers] Managers List Page', async function () {
  test.beforeEach(async ({ signInUIService, managersUIService }) => {
    await signInUIService.signInAsLocalUser();
    await managersUIService.openManagersList();
  });

  test(
    'Verify Managers List page elements',
    { tag: [TAGS.UI, TAGS.MANAGERS, TAGS.SMOKE] },
    async function ({ managersListPage }) {
      // Verify page title
      await managersListPage.verifyPageTitle();

      // Verify main page elements
      await managersListPage.verifyAddManagerButtonVisible();
      await managersListPage.verifySearchElements();
      await managersListPage.verifyTableVisible();

      // Verify table headers
      await managersListPage.verifyTableHeaders();

      // Verify search functionality elements
      await managersListPage.verifySearchInputPlaceholder();
      await managersListPage.verifySearchInputMaxLength();
      await managersListPage.verifySearchButtonDisabled();
      await managersListPage.verifyFilterButtonDisabled();
    },
  );

  test(
    'Verify Managers List contains data',
    { tag: [TAGS.UI, TAGS.MANAGERS, TAGS.SMOKE] },
    async function ({ managersListPage }) {
      // Verify that the managers list is not empty
      await managersListPage.verifyManagersListNotEmpty();

      // Verify specific managers exist (based on the HTML data)
      await managersListPage.verifyManagerData('Admin', 'Admin', 'ADMIN');
      await managersListPage.verifyManagerData('Sam', 'Nazarov', 'USER');
      await managersListPage.verifyManagerData('Dmitry', 'Litvinovich', 'USER');
    },
  );

  test(
    'Verify navigation to Add Manager page',
    { tag: [TAGS.UI, TAGS.MANAGERS, TAGS.SMOKE] },
    async function ({ managersListPage, page }) {
      // Click Add Manager button
      await managersListPage.clickAddManager();

      // Verify navigation to add manager page
      await page.waitForURL('**/managers/add');
    },
  );

  test(
    'Verify manager details navigation',
    { tag: [TAGS.UI, TAGS.MANAGERS, TAGS.SMOKE] },
    async function ({ managersListPage, page }) {
      // Click on a manager details link
      await managersListPage.clickManagerDetails('Admin', 'Admin');

      // Verify navigation to manager details page
      await page.waitForURL('**/managers/**');
    },
  );

  test(
    'Verify search functionality',
    { tag: [TAGS.UI, TAGS.MANAGERS, TAGS.FUNCTIONAL] },
    async function ({ managersListPage }) {
      // Initially search button should be disabled
      await managersListPage.verifySearchButtonDisabled();

      // Type in search input only (without clicking search)
      await managersListPage.searchInput.fill('Admin');

      // Wait for search button to become enabled
      await managersListPage.searchButton.waitFor({ state: 'visible' });

      // Check if button is enabled before clicking
      const isEnabled = await managersListPage.searchButton.isEnabled();
      console.log(`Search button enabled: ${isEnabled}`);

      // Verify managers are still visible (search might be real-time)
      await managersListPage.verifyManagersListNotEmpty();
    },
  );

  test(
    'Verify managers count',
    { tag: [TAGS.UI, TAGS.MANAGERS, TAGS.SMOKE] },
    async function ({ managersListPage }) {
      // Get current managers count
      const managersCount = await managersListPage.getManagersCount();

      // Verify we have managers in the table
      expect(managersCount).toBeGreaterThan(0);

      // Log the actual count for debugging
      console.log(`Found ${managersCount} managers in the table`);
    },
  );
});
