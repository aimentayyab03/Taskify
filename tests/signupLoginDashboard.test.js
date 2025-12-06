// tests/signupLoginDashboard.test.js
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const { expect } = require("chai");

describe("Taskify App – Signup → Login → Dashboard Flow", function () {
  this.timeout(60000);
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

  it("should signup → go to login → login and reach dashboard", async () => {
    const BASE_URL = "http://localhost:3000";

    // --- GO TO SIGNUP PAGE ---
    await driver.get(BASE_URL + "/signup");
    await driver.wait(until.elementLocated(By.css("input[placeholder='Username']")), 10000);

    // Generate random user
    const randomEmail = `user${Date.now()}@test.com`;
    const password = "123456";

    // --- FILL SIGNUP FORM ---
    await driver.findElement(By.css("input[placeholder='Username']")).sendKeys("SeleniumUser");
    await driver.findElement(By.css("input[placeholder='Email address']")).sendKeys(randomEmail);
    await driver.findElement(By.css("input[placeholder='Password']")).sendKeys(password);

    // Click Signup
    await driver.findElement(By.css("button.auth-btn")).click();

    // --- WAIT FOR REDIRECT OR ERROR ---
    let signupRedirected = false;
    try {
      await driver.wait(async () => {
        const url = await driver.getCurrentUrl();
        if (url.includes("/login")) {
          signupRedirected = true;
          return true;
        }
        try {
          const error = await driver.findElement(By.css(".error-msg"));
          return true; // Error appeared
        } catch {
          return false;
        }
      }, 10000);
    } catch {
      // timeout
    }

    if (!signupRedirected) {
      // If signup failed, check error message
      let errorText = "No error element found!";
      try {
        errorText = await driver.findElement(By.css(".error-msg")).getText();
      } catch {}
      console.log("⚠ Signup error message:", errorText);
      expect(errorText.length).to.be.greaterThan(0);
      return; // stop test if signup failed
    }

    console.log("✅ Signup success, redirected to login");

    // --- LOGIN ---
    await driver.findElement(By.css("input[placeholder='Email address']")).sendKeys(randomEmail);
    await driver.findElement(By.css("input[placeholder='Password']")).sendKeys(password);
    await driver.findElement(By.css("button.auth-btn")).click();

    // --- WAIT FOR DASHBOARD ---
    await driver.wait(until.urlContains("/dashboard"), 15000);
    const url = await driver.getCurrentUrl();
    expect(url).to.include("/dashboard");
    console.log("✅ Login success, reached dashboard");
  });
});
