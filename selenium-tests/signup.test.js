const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const { expect } = require("chai");

describe("Signup Page Test", function () {
  this.timeout(40000); 
  let driver;

  before(async () => {
    const options = new chrome.Options();
    options.addArguments("--headless");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--window-size=1920,1080");

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it("should perform signup and show success or error", async () => {
    await driver.get("http://13.51.199.30/signup");

    const randomEmail = `selenium_${Date.now()}@test.com`;

    await driver.findElement(By.css("input[placeholder='Username']")).sendKeys("seleniumUser");
    await driver.findElement(By.css("input[placeholder='Email address']")).sendKeys(randomEmail);
    await driver.findElement(By.css("input[placeholder='Password']")).sendKeys("pass123");

    await driver.findElement(By.css("button.auth-btn")).click();

    await driver.sleep(2000); // small wait

    const currentUrl = await driver.getCurrentUrl();

    // SUCCESS CASE
    if (currentUrl.includes("/login") || currentUrl.includes("/dashboard")) {
      console.log("✅ Signup successful → redirected to:", currentUrl);
      expect(true).to.equal(true);
      return;
    }

    // ERROR CASE
    try {
      const errorMsg = await driver.findElement(By.css(".error-msg")).getText();
      console.log("⚠ Signup failed:", errorMsg);
      expect(errorMsg.length).to.be.greaterThan(0);
    } catch {
      throw new Error("Signup failed: No redirect and no error message shown");
    }
  });
});
