# Browser Tests

This directory contains end-to-end tests for the browser functionality in Cline, including both Puppeteer and LightPanda headless browser implementations.

## Overview

The tests verify that both browser implementations (Puppeteer and LightPanda) work correctly with the BrowserSession class. They test:

1. Browser initialization and navigation
2. Click actions
3. Typing text
4. Screenshot capture

## Test Structure

- `browser-session.test.ts`: Contains the main test suite for BrowserSession with both Puppeteer and LightPanda
- `mock-server.ts`: A simple HTTP server that serves test HTML pages for the browser tests

## Running the Tests

To run the browser tests:

```bash
# Run all tests
npm test

# Run only browser tests
npm test -- --grep "BrowserSession"
```

## Mock Server

The tests use a local mock server instead of external websites to ensure:

1. Tests are reliable and don't depend on external services
2. Tests run faster
3. Tests can be run in environments without internet access

The mock server provides a simple HTML page with elements that can be interacted with (buttons, input fields) to test browser functionality.

## Adding New Tests

When adding new tests:

1. Use the mock server for any HTML content needed
2. Test both Puppeteer and LightPanda implementations
3. Keep tests isolated and clean up resources after each test
4. Use appropriate timeouts for browser operations

## Troubleshooting

If tests fail:

1. Check that both Puppeteer and LightPanda dependencies are installed
2. Verify that the mock server can start (requires an available port)
3. Increase the timeout if browser operations are taking too long
4. Check for any conflicts with existing browser instances