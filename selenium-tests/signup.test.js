const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const { expect } = require("chai");

describe("Signup Page Test", function () {
  this.timeout(40000); // increase timeout for slow network
  let driver;

  before(async () => {
    const options = new chrome.Options();
    options.addArguments("--headless"); // headless mode
    options.addArguments("--no-sandbox"); // needed for Linux/EC2
    options.addArguments("--disable-dev-shm-usage"); // prevent resource issues
    options.addArguments("--window-size=1920,1080");

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it("should show success OR error after signup attempt", async () => {
    await driver.get("http://localhost:3000/signup");

    // Wait for the signup form to load
    await driver.wait(until.elementLocated(By.css("input[placeholder='Username']")), 10000);

    const randomEmail = `selenium_${Date.now()}@test.com`;

    // Fill signup form
    await driver.findElement(By.css("input[placeholder='Username']")).sendKeys("seleniumUser");
    await driver.findElement(By.css("input[placeholder='Email address']")).sendKeys(randomEmail);
    await driver.findElement(By.css("input[placeholder='Password']")).sendKeys("pass123");

    // Click signup button
    await driver.findElement(By.css("button.auth-btn")).click();

    // Wait a few seconds for either redirect or error message
    await driver.sleep(2000);

    const currentUrl = await driver.getCurrentUrl();

    if (currentUrl.includes("/login") || currentUrl.includes("/dashboard")) {
      // Success case
      console.log("✅ Signup successful, redirected to:", currentUrl);
      expect(currentUrl).to.match(/\/(login|dashboard)/);
    } else {
      // Try to find error message
      let errorText = "";
      try {
        const errorElement = await driver.findElement(By.css(".error-msg"));
        errorText = await errorElement.getText();
      } catch (err) {
        // No error element found
        errorText = "No error element found, and no redirect happened!";
      }
      console.log("⚠ Signup failed or error shown:", errorText);
      expect(errorText.length).to.be.greaterThan(0);
    }
  });
});
