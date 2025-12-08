const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");

describe("Dashboard Page Tests", function () {
  let driver;
  this.timeout(60000); // Increased timeout for EC2 headless

  before(async () => {
    // Headless Chrome options
    let options = new chrome.Options();
    options.addArguments("--headless"); // Run headless
    options.addArguments("--no-sandbox"); // Needed for Linux/EC2
    options.addArguments("--disable-dev-shm-usage"); // Prevent limited resource issues
    options.addArguments("--window-size=1920,1080");

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it("should open dashboard after login", async () => {
    const BASE_URL = "http://13.51.199.30" // Use EC2 Docker frontend

    // 1️⃣ Open login page
    await driver.get(BASE_URL + "/login");

    // 2️⃣ Fill login form
    await driver.findElement(By.css('input[type="email"]'))
      .sendKeys('aimentayyab215@gmail.com');
    await driver.findElement(By.css('input[type="password"]'))
      .sendKeys('aimen12');

    // 3️⃣ Click login
    await driver.findElement(By.css('button[type="submit"]')).click();

    // 4️⃣ Wait for redirect to dashboard
    await driver.wait(until.urlContains("/dashboard"), 20000);

    // 5️⃣ Wait for dashboard container to be visible
    const container = await driver.wait(
      until.elementLocated(By.css(".container")),
      20000
    );

    // 6️⃣ Verify Add Task input exists
    const addTaskInput = await driver.wait(
      until.elementLocated(By.css("input[placeholder='Enter new task...']")),
      20000
    );

    // Optional: simple assertion
    const isDisplayed = await addTaskInput.isDisplayed();
    if (!isDisplayed) throw new Error("Add Task input not visible on dashboard");
  });
});
