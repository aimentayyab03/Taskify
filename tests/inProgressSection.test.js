const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const assert = require("assert");

describe("In Progress Section Test", function () {
  this.timeout(60000); // Slightly increased for stability

  let driver;
  const email = "aimentayyab215@gmail.com";
  const password = "aimen12";
  const newTaskName = "Automated In Progress Task " + Date.now();
  const dueDateInput = "12-06-2025"; // MM-DD-YYYY format

  before(async function () {
    let options = new chrome.Options();
    options.addArguments("--headless"); // Headless for EC2/Jenkins
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

  it("should add a task with due date, verify it in In Progress section, and logout", async function () {
    // 1️⃣ Login
    await driver.get("http://localhost:3000/login");
    await driver.findElement(By.css('input[type="email"]')).sendKeys(email);
    await driver.findElement(By.css('input[type="password"]')).sendKeys(password);
    await driver.findElement(By.css('button[type="submit"]')).click();

    // 2️⃣ Wait for dashboard
    await driver.wait(until.urlContains("/dashboard"), 15000);

    // 3️⃣ Add a new task in All section with due date
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

    // 5️⃣ Move task to In Progress by clicking the button inside task card
    const taskCard = await driver.findElement(
      By.xpath(`//div[contains(@class,'task-card')]//div[contains(text(),'${newTaskName}')]/ancestor::div[contains(@class,'task-card')]`)
    );
    const inProgressBtn = await taskCard.findElement(By.xpath(".//button[contains(text(),'In Progress')]"));
    await inProgressBtn.click();
    await driver.sleep(500); // wait for state update

    // 6️⃣ Click "In Progress" button in sidebar to filter
    const inProgressSidebarBtn = await driver.findElement(By.xpath("//button[contains(text(),'In Progress')]"));
    await inProgressSidebarBtn.click();
    await driver.sleep(1000); // wait for React to render

    // 7️⃣ Locate the task card in In Progress section
    const taskCardInProgress = await driver.findElement(
      By.xpath(`//div[contains(@class,'task-card')]//div[contains(text(),'${newTaskName}')]/ancestor::div[contains(@class,'task-card')]`)
    );

    // 8️⃣ Verify task title exists
    const taskTitle = await taskCardInProgress.findElement(By.xpath(`.//div[contains(text(),'${newTaskName}')]`));
    assert.ok(await taskTitle.isDisplayed(), "Task not visible in In Progress view");

    // 9️⃣ Verify there is a Due date element
    const dueDateElement = await taskCardInProgress.findElement(By.xpath(`.//span[contains(text(),'Due:')]`));
    assert.ok(await dueDateElement.isDisplayed(), "Task due date not displayed");

    // 🔟 Logout
    const logoutBtn = await driver.findElement(By.xpath("//button[contains(text(),'Logout')]"));
    await logoutBtn.click();
    await driver.wait(until.urlContains("/login"), 10000);
  });
});
