const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const { expect } = require("chai");

describe("Taskify – Add Task Validation", function () {
  this.timeout(60000);

  let driver;

  before(async () => {
    // Headless Chrome options
    let options = new chrome.Options();
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

  it("should show validation for empty fields, then add task successfully", async () => {
    const BASE_URL = "http://localhost:3000";

    // --- LOGIN ---
    await driver.get(BASE_URL + "/login");
    await driver.findElement(By.css("input[placeholder='Email address']")).sendKeys("aimentayyab215@gmail.com");
    await driver.findElement(By.css("input[placeholder='Password']")).sendKeys("aimen12");
    await driver.findElement(By.css("button[type='submit']")).click();

    // Wait for dashboard
    await driver.wait(until.urlContains("/dashboard"), 15000);
    await driver.sleep(2000);

    // --- COUNT INITIAL TASKS ---
    let initialTasks = await driver.findElements(By.css(".task-card"));
    const initialCount = initialTasks.length;

    // --- TRY ADDING TASK WITH EMPTY FIELDS ---
    await driver.findElement(By.css("input[placeholder='Enter new task...']")).clear();
    await driver.findElement(By.css("select")).sendKeys("");
    await driver.findElement(By.css("input[type='date']")).clear();
    await driver.findElement(By.css("button.add-btn")).click();

    await driver.sleep(1500);

    let afterEmptyAttempt = await driver.findElements(By.css(".task-card"));
    expect(afterEmptyAttempt.length).to.equal(initialCount);

    // --- ADD VALID TASK ---
    const title = "Selenium Task " + Date.now();

    // Format date as YYYY-MM-DD for input[type=date]
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const dd = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${mm}-${dd}-${yyyy}`; // Correct format for date input

    await driver.findElement(By.css("input[placeholder='Enter new task...']")).sendKeys(title);
    await driver.findElement(By.css("select")).sendKeys("Work");
    await driver.findElement(By.css("input[type='date']")).sendKeys(formattedDate);
    await driver.findElement(By.css("button.add-btn")).click();

    await driver.sleep(2000);

    // --- CHECK TASK ADDED ---
    let finalTasks = await driver.findElements(By.css(".task-card"));
    expect(finalTasks.length).to.equal(initialCount + 1);

    const titles = await driver.findElements(By.css(".task-card .task-title"));
    let found = false;
    for (let t of titles) {
      const txt = (await t.getText()).toLowerCase();
      if (txt.includes("selenium")) found = true;
    }
    expect(found).to.equal(true);
  });
});
