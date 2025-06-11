# aqa-3-team-2-sales-portal-tests

Automated tests for the Sales Portal project using Playwright, TypeScript, ESLint, and Prettier.

## Features

- UI and API tests with Playwright
- Linting with ESLint
- Code formatting with Prettier
- Allure and HTML reporting
- Pre-commit hooks with Husky

## Getting Started

### Prerequisites

- Node.js
- npm

### Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd aqa-3-team-2-sales-portal-tests
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the project root if needed.
   - Add required variables:
     ```
     USER_LOGIN=your_login
     USER_PASSWORD=your_password
     ```

4. **(Optional) Install Playwright browsers:**
   ```sh
   npx playwright install
   ```

## Running Tests

- **Run UI tests:**
  ```sh
  npm run test:ui
  ```

- **Run API tests:**
  ```sh
  npm run test:api
  ```

- **Run tests in UI mode (interactive):**
  ```sh
  npm run ui-mode
  ```

## Linting & Formatting

- **Check lint:**
  ```sh
  npm run lint
  ```
- **Check formatting:**
  ```sh
  npm run prettier
  ```
- **Fix lint and formatting:**
  ```sh
  npm run format:fix
  ```

## Reports

- **Open HTML report:**
  ```sh
  npm run report-html-open
  ```
- **Generate and open Allure report:**
  ```sh
  npm run allure-report-open
  ```

## Project Structure

```
src/
  api/         # API tests
  ui/          # UI tests
```

## Pre-commit Hooks

Husky will automatically run lint and formatting checks before each commit.

## Configuration

- Base URLs and credentials are managed in `src/config/environment.ts`, `src/config/api-config.ts`, and `.env` files.

---