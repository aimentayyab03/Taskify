const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const { expect } = require("chai");

describe("Taskify – Add Task", function () {
  this.timeout(60000);

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

  it("should add a new task successfully", async () => {
    const BASE_URL = "http://13.51.199.30"; // EC2 frontend IP

    // --- LOGIN ---
    await driver.get(BASE_URL + "/login");
    await driver.findElement(By.css("input[placeholder='Email address']")).sendKeys("aimentayyab215@gmail.com");
    await driver.findElement(By.css("input[placeholder='Password']")).sendKeys("aimen12");
    await driver.findElement(By.css("button[type='submit']")).click();
    await driver.wait(until.urlContains("/dashboard"), 15000);

    // --- ADD VALID TASK ---
    const title = "Selenium Task " + Date.now();

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    await driver.findElement(By.css("input[placeholder='Enter new task...']")).sendKeys(title);
    await driver.findElement(By.css("select")).sendKeys("Work");
    await driver.findElement(By.css("input[type='date']")).sendKeys(formattedDate);
    await driver.findElement(By.css("button.add-btn")).click();

    // Wait for the new task to appear
    const newTask = await driver.wait(
      until.elementLocated(By.xpath(`//div[contains(@class,'task-title') and text()='${title}']`)),
      10000
    );

    // --- VERIFY TASK ADDED ---
    const newTaskText = await newTask.getText();
    expect(newTaskText).to.equal(title);
  });
});
