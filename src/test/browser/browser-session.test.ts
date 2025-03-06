import { describe, it, beforeEach, afterEach } from "mocha"
import * as vscode from "vscode"
import { expect } from "chai"
import * as sinon from "sinon"
import { BrowserSession } from "../../services/browser/BrowserSession"
import { BrowserSettings, DEFAULT_BROWSER_SETTINGS } from "../../shared/BrowserSettings"
import { MockServer } from "./mock-server"

describe("BrowserSession E2E Tests", function() {
  // Increase timeout for browser tests
  this.timeout(30000)

  let context: vscode.ExtensionContext
  let browserSession: BrowserSession
  let getConfigStub: sinon.SinonStub
  let mockServer: MockServer
  let testUrl: string

  beforeEach(async () => {
    // Start mock server
    mockServer = new MockServer()
    const port = await mockServer.start()
    testUrl = mockServer.getUrl()
    
    // Mock the extension context
    context = {
      globalStorageUri: { fsPath: "/tmp/test-global-storage" },
    } as unknown as vscode.ExtensionContext

    // Restore any previous stubs
    sinon.restore()
  })

  afterEach(async () => {
    // Clean up after each test
    if (browserSession) {
      await browserSession.closeBrowser()
    }
    
    // Stop mock server
    await mockServer.stop()
    
    // Restore stubs
    sinon.restore()
  })

  describe("Puppeteer Browser Tests", () => {
    beforeEach(() => {
      // Stub the configuration to ensure Puppeteer is used
      getConfigStub = sinon.stub(vscode.workspace, "getConfiguration")
      getConfigStub.returns({
        get: sinon.stub().withArgs("headlessBrowserType").returns("puppeteer")
      })

      // Create browser session with Puppeteer
      const browserSettings: BrowserSettings = {
        ...DEFAULT_BROWSER_SETTINGS,
        headlessBrowserType: "puppeteer"
      }
      browserSession = new BrowserSession(context, browserSettings)
    })

    it("should launch Puppeteer browser and navigate to a URL", async function() {
      try {
        // Launch browser
        await browserSession.launchBrowser()
        
        // Navigate to the mock server URL
        const result = await browserSession.navigateToUrl(testUrl)
        
        // Verify the result contains expected properties
        expect(result).to.have.property("screenshot").that.is.a("string")
        expect(result).to.have.property("logs").that.is.a("string")
        expect(result).to.have.property("currentUrl").that.includes(`localhost:`)
      } catch (error) {
        console.error("Test failed:", error)
        throw error
      }
    })
  })

  describe("LightPanda Browser Tests", () => {
    beforeEach(() => {
      // Stub the configuration to ensure LightPanda is used
      getConfigStub = sinon.stub(vscode.workspace, "getConfiguration")
      getConfigStub.returns({
        get: sinon.stub().withArgs("headlessBrowserType").returns("lightpanda")
      })

      // Create browser session with LightPanda
      const browserSettings: BrowserSettings = {
        ...DEFAULT_BROWSER_SETTINGS,
        headlessBrowserType: "lightpanda"
      }
      browserSession = new BrowserSession(context, browserSettings)
    })

    it("should launch LightPanda browser and navigate to a URL", async function() {
      try {
        // Launch browser
        await browserSession.launchBrowser()
        
        // Navigate to the mock server URL
        const result = await browserSession.navigateToUrl(testUrl)
        
        // Verify the result contains expected properties
        expect(result).to.have.property("screenshot").that.is.a("string")
        expect(result).to.have.property("logs").that.is.a("string")
        expect(result).to.have.property("currentUrl").that.includes(`localhost:`)
      } catch (error) {
        console.error("Test failed:", error)
        throw error
      }
    })
  })

  describe("Browser Action Tests", () => {
    // Test both browser types for actions
    const browserTypes = ["puppeteer", "lightpanda"] as const

    browserTypes.forEach(browserType => {
      describe(`${browserType} browser actions`, () => {
        beforeEach(() => {
          // Stub the configuration
          getConfigStub = sinon.stub(vscode.workspace, "getConfiguration")
          getConfigStub.returns({
            get: sinon.stub().withArgs("headlessBrowserType").returns(browserType)
          })

          // Create browser session
          const browserSettings: BrowserSettings = {
            ...DEFAULT_BROWSER_SETTINGS,
            headlessBrowserType: browserType
          }
          browserSession = new BrowserSession(context, browserSettings)
        })

        it(`should perform click action with ${browserType}`, async function() {
          try {
            // Launch browser
            await browserSession.launchBrowser()
            
            // Navigate to the mock server URL
            await browserSession.navigateToUrl(testUrl)
            
            // Get button position (center of the button)
            // In a real test, we would get the actual position, but for this test we'll use a fixed position
            const buttonX = 150
            const buttonY = 150
            
            // Perform click action
            const result = await browserSession.click(`${buttonX},${buttonY}`)
            
            // Verify the result
            expect(result).to.have.property("screenshot").that.is.a("string")
            expect(result).to.have.property("currentMousePosition").that.equals(`${buttonX},${buttonY}`)
          } catch (error) {
            console.error("Test failed:", error)
            throw error
          }
        })

        it(`should perform type action with ${browserType}`, async function() {
          try {
            // Launch browser
            await browserSession.launchBrowser()
            
            // Navigate to the mock server URL
            await browserSession.navigateToUrl(testUrl)
            
            // Click on the input field first (position is approximate)
            await browserSession.click("200,250")
            
            // Type some text
            const testText = "Testing with " + browserType
            const result = await browserSession.type(testText)
            
            // Verify the result
            expect(result).to.have.property("screenshot").that.is.a("string")
            
            // In a real test, we would verify the text was typed correctly
            // by checking the page content, but that's beyond the scope of this example
          } catch (error) {
            console.error("Test failed:", error)
            throw error
          }
        })
      })
    })
  })
})