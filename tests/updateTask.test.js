// tests/updateTask.test.js
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const assert = require("assert");

describe("Update Task Test", function () {
  this.timeout(90000);

  let driver;

  const email = "aimentayyab215@gmail.com";
  const password = "aimen12";
  const taskTitle = "Selenium Test Task " + Date.now();
  const category = "Work";
  const dueDate = "12-06-2025";

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
    // 1️⃣ Login
    await driver.get("http://localhost:3000/login");
    await driver.findElement(By.css('input[type="email"]')).sendKeys(email);
    await driver.findElement(By.css('input[type="password"]')).sendKeys(password);
    await driver.findElement(By.css('button[type="submit"]')).click();

    // 2️⃣ Wait for dashboard
    await driver.wait(until.urlContains("/dashboard"), 15000);

    // 3️⃣ Add new task
    await driver.wait(until.elementLocated(By.css('input[placeholder="Enter new task..."]')), 10000);
    await driver.findElement(By.css('input[placeholder="Enter new task..."]')).sendKeys(taskTitle);
    await driver.findElement(By.css('select')).sendKeys(category);
    await driver.findElement(By.css('input[type="date"]')).sendKeys(dueDate);
    await driver.findElement(By.css('.add-btn')).click();

    // 4️⃣ Wait for the specific task card
    const taskCardXpath = `//div[contains(@class,'task-card')]//div[contains(text(), '${taskTitle}')]/ancestor::div[contains(@class,'task-card')]`;
    await driver.wait(until.elementLocated(By.xpath(taskCardXpath)), 20000);

    // 5️⃣ Click "In Progress"
    const inProgressBtn = await driver.wait(
      until.elementLocated(By.xpath(`${taskCardXpath}//button[contains(text(),'In Progress')]`)),
      10000
    );
    await inProgressBtn.click();

    // 6️⃣ Click "Done"
    const doneBtn = await driver.wait(
      until.elementLocated(By.xpath(`${taskCardXpath}//button[contains(text(),'Done')]`)),
      10000
    );
    await doneBtn.click();

    // 7️⃣ **Wait until Done button is disabled**
    const doneBtnAfter = await driver.wait(
      until.elementIsDisabled(doneBtn),
      10000
    );

    // 8️⃣ Assertion
    const isDisabled = await doneBtnAfter.getAttribute("disabled");
    assert.strictEqual(isDisabled, "true", "Done button should be disabled after completion");
  });
});



// // tests/updateTask.test.js
// const { Builder, By, until } = require('selenium-webdriver');
// require('chromedriver');
// const assert = require('assert');

// describe('Update Task Test', function () {
//   this.timeout(40000); // Timeout for async Selenium actions

//   let driver;

//   before(async function () {
//     driver = await new Builder().forBrowser('chrome').build();
//   });

//   after(async function () {
//     if (driver) await driver.quit();
//   });

//   it('should update a task status successfully', async function () {
//     // 1. Open login page
//     await driver.get('http://localhost:3000/login');

//     // 2. Login
//     await driver.findElement(By.css('input[type="email"]')).sendKeys('aimentayyab215@gmail.com');
//     await driver.findElement(By.css('input[type="password"]')).sendKeys('aimen12');
//     await driver.findElement(By.css('button[type="submit"]')).click();

//     // 3. Wait for dashboard
//     await driver.wait(until.urlContains('/dashboard'), 15000);

// // 4. Wait for task card to appear
// await driver.wait(until.elementLocated(By.css(".task-card")), 15000);

// // 5. Find the task card again after status update
// const taskCardUpdated = await driver.wait(
//   until.elementLocated(By.css(".task-card")),
//   15000
// );

// // 6. Click In Progress
// const inProgressBtn = await taskCardUpdated.findElement(By.xpath(".//button[contains(text(), 'In Progress')]"));
// await inProgressBtn.click();

// // Wait a bit for re-render
// await driver.sleep(1000);

// // 7. Verify the task card still exists
// const updatedTaskCard = await driver.findElement(By.css(".task-card"));
// assert.ok(await updatedTaskCard.isDisplayed());

// // 8. Click Done button
// const doneBtn = await updatedTaskCard.findElement(By.xpath(".//button[contains(text(),'Done')]"));
// assert.ok(doneBtn);

//   });
// });
