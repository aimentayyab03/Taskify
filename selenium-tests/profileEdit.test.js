const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const assert = require("assert");

describe("Profile Edit Test", function () {
  this.timeout(60000); // Enough time for SPA
  let driver;
  const email = "aimentayyab215@gmail.com";
  const password = "aimen12";
  const newUsername = "Tayyab"; // Adjust as needed
  const BASE_URL = "http://13.51.199.30"; // Change to EC2 URL if needed

  before(async function () {
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

  after(async function () {
    if (driver) await driver.quit();
  });

  it("should edit profile information and save changes", async function () {
    // 1️⃣ Login
    await driver.get(BASE_URL + "/login");
    await driver.findElement(By.css('input[type="email"]')).sendKeys(email);
    await driver.findElement(By.css('input[type="password"]')).sendKeys(password);
    await driver.findElement(By.css('button[type="submit"]')).click();

    // 2️⃣ Wait for Dashboard
    await driver.wait(until.elementLocated(By.css(".container")), 15000);

    // 3️⃣ Click Profile in sidebar
    const profileBtn = await driver.findElement(By.xpath("//button[contains(.,'Profile')]"));
    await profileBtn.click();

    // 4️⃣ Wait for Edit button and click
    const editBtn = await driver.wait(until.elementLocated(By.css(".edit-btn")), 10000);
    await editBtn.click();

    // 5️⃣ Change username
    const usernameInput = await driver.wait(until.elementLocated(By.css('input[type="text"]')), 5000);
    await usernameInput.clear();
    await usernameInput.sendKeys(newUsername);

    // 6️⃣ Click Save Changes (same button toggles)
    await editBtn.click();

    // 7️⃣ Verify username changed in DOM
    const usernameText = await driver.wait(
      until.elementLocated(By.xpath(`//h2[contains(.,'${newUsername}')]`)),
      5000
    );
    assert.ok(await usernameText.isDisplayed(), "Username not updated!");

    // 8️⃣ Logout
    const logoutBtn = await driver.findElement(By.css(".logout-btn"));
    await logoutBtn.click();

    // 9️⃣ Verify redirect to login
    await driver.wait(until.urlContains("/login"), 10000);
  });
});
