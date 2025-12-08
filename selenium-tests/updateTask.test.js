// tests/updateTask.test.js
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const assert = require("assert");

describe("Update Task Test", function () {
  this.timeout(120000); // Increased timeout for EC2

  let driver;

  const email = "aimentayyab215@gmail.com";
  const password = "aimen12";
  const taskTitle = "Selenium Test Task " + Date.now();
  const category = "Work";

  // Use today's date in YYYY-MM-DD format
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const dueDate = `${yyyy}-${mm}-${dd}`;

  before(async function () {
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

  after(async function () {
    if (driver) await driver.quit();
  });

  it("should add a task, move it to In Progress, complete it, and verify status", async function () {
    const BASE_URL = "http://51.20.10.38"; // Correct EC2 frontend IP, no port

    // 1️⃣ Login
    await driver.get(BASE_URL + "/login");
    await driver.findElement(By.css('input[type="email"]')).sendKeys(email);
    await driver.findElement(By.css('input[type="password"]')).sendKeys(password);
    await driver.findElement(By.css('button[type="submit"]')).click();

    // 2️⃣ Wait for dashboard URL
    await driver.wait(until.urlContains("/dashboard"), 30000);

    // Optional: wait for main container if exists
    // await driver.wait(until.elementLocated(By.css('.dashboard-container')), 30000);

    // 3️⃣ Add new task
    await driver.wait(until.elementLocated(By.css('input[placeholder="Enter new task..."]')), 15000);
    await driver.findElement(By.css('input[placeholder="Enter new task..."]')).sendKeys(taskTitle);
    await driver.findElement(By.css('select')).sendKeys(category);
    await driver.findElement(By.css('input[type="date"]')).sendKeys(dueDate);
    await driver.findElement(By.css('.add-btn')).click();

    // 4️⃣ Wait for the new task card to appear
    const taskCardXpath = `//div[contains(@class,'task-card')]//div[contains(text(), "${taskTitle}")]/ancestor::div[contains(@class,'task-card')]`;
    const taskCard = await driver.wait(until.elementLocated(By.xpath(taskCardXpath)), 15000);

    // 5️⃣ Move task to In Progress
    const inProgressBtn = await taskCard.findElement(By.xpath(`.//button[contains(text(),'In Progress')]`));
    await inProgressBtn.click();
    await driver.sleep(1000);

    // 6️⃣ Mark task as Done
    const doneBtn = await taskCard.findElement(By.xpath(`.//button[contains(text(),'Done')]`));
    await doneBtn.click();

    // 7️⃣ Wait until Done button is disabled
    await driver.wait(async () => {
      const disabled = await doneBtn.getAttribute("disabled");
      return disabled !== null;
    }, 10000);

    // 8️⃣ Assertion
    const isDisabled = await doneBtn.getAttribute("disabled");
    assert.ok(isDisabled, "Done button should be disabled after completion");
  });
});
