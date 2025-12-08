const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require("chromedriver");
const assert = require('assert');

describe('Login Page Test', function () {
  this.timeout(50000); // Increased timeout for CI/CD
  let driver;
  const BASE_URL = "http://13.51.199.30"; // Change to EC2 URL if running in Docker

  before(async () => {
    const options = new chrome.Options();
    options.addArguments("--headless"); // Headless mode
    options.addArguments("--no-sandbox"); // Needed for Linux/EC2
    options.addArguments("--disable-dev-shm-usage"); // Prevent resource issues
    options.addArguments("--window-size=1920,1080");

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('should login successfully with valid credentials', async () => {
    await driver.get(BASE_URL + '/login');

    await driver.findElement(By.css('input[type="email"]'))
      .sendKeys('aimentayyab215@gmail.com');

    await driver.findElement(By.css('input[type="password"]'))
      .sendKeys('aimen12');

    await driver.findElement(By.css('button[type="submit"]')).click();

    // Wait for redirect to dashboard
    await driver.wait(until.urlContains('/dashboard'), 15000);

    // Wait for dashboard content to load
    const container = await driver.wait(
      until.elementLocated(By.css('.container')),
      10000
    );

    assert.ok(await container.isDisplayed(), "Dashboard container not displayed");
  });

  it('should show error for invalid credentials', async () => {
    await driver.get(BASE_URL + '/login');

    await driver.findElement(By.css('input[type="email"]'))
      .sendKeys('wrong@email.com');
    await driver.findElement(By.css('input[type="password"]'))
      .sendKeys('wrongpass');

    await driver.findElement(By.css('button[type="submit"]')).click();

    // Wait for error message
    const errorMsg = await driver.wait(
      until.elementLocated(By.css('.error-msg')),
      10000
    );

    assert.ok(await errorMsg.isDisplayed(), "Error message not displayed for invalid login");
  });
});
