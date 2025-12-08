// tests/simpleTodo.test.js
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const assert = require("assert");

describe("Simple To Do Section Test", function () {
  this.timeout(60000); // Enough time for all actions

  let driver;
  const email = "aimentayyab215@gmail.com";
  const password = "aimen12";
  const newTaskName = "Automated To Do Task " + Date.now();
  const dueDateInput = "2025-12-06"; // Correct YYYY-MM-DD format for input[type=date]

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

  it("should add a task with due date, verify it in To Do section, and logout", async function () {
    // 1️⃣ Login
    await driver.get("http://13.51.199.30/login");
    await driver.findElement(By.css('input[type="email"]')).sendKeys(email);
    await driver.findElement(By.css('input[type="password"]')).sendKeys(password);
    await driver.findElement(By.css('button[type="submit"]')).click();

    // 2️⃣ Wait for dashboard
    await driver.wait(until.urlContains("/dashboard"), 15000);

    // 3️⃣ Add a new task in All section
    await driver.wait(until.elementLocated(By.css(".add-task")), 15000);
    await driver.findElement(By.css('.add-task input[type="text"]')).sendKeys(newTaskName);
    await driver.findElement(By.css(".add-task select")).sendKeys("Work");
    await driver.findElement(By.css('.add-task input[type="date"]')).sendKeys(dueDateInput);
    await driver.findElement(By.css(".add-task button.add-btn")).click();

    // 4️⃣ Wait for task to appear in All view
    const addedTaskAll = await driver.wait(
      until.elementLocated(By.xpath(`//div[contains(@class,'task-card')]//div[contains(text(),'${newTaskName}')]`)),
      15000
    );
    assert.ok(await addedTaskAll.isDisplayed(), "Task not added in All view");

    // 5️⃣ Click "To Do" button in sidebar
    const todoBtn = await driver.findElement(By.xpath("//button[contains(text(),'To Do')]"));
    await todoBtn.click();
    await driver.sleep(1000); // wait for React to render To Do view

    // 6️⃣ Locate the task card in To Do section
    const taskCardTodo = await driver.findElement(
      By.xpath(`//div[contains(@class,'task-card')]//div[contains(text(),'${newTaskName}')]/ancestor::div[contains(@class,'task-card')]`)
    );

    // 7️⃣ Verify task title exists
    const taskTitle = await taskCardTodo.findElement(By.xpath(`.//div[contains(text(),'${newTaskName}')]`));
    assert.ok(await taskTitle.isDisplayed(), "Task not visible in To Do view");

    // 8️⃣ Verify there is a Due date element
    const dueDateElement = await taskCardTodo.findElement(By.xpath(`.//span[contains(text(),'Due:')]`));
    assert.ok(await dueDateElement.isDisplayed(), "Task due date not displayed");

    // 9️⃣ Logout
    const logoutBtn = await driver.findElement(By.xpath("//button[contains(text(),'Logout')]"));
    await logoutBtn.click();

    // 🔟 Verify redirect to login
    await driver.wait(until.urlContains("/login"), 10000);
  });
});
