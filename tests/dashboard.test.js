const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");

describe("Dashboard Page Tests", function () {
  let driver;
  this.timeout(50000);

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

  it("should open dashboard after manual login", async () => {
    // 1. Open login page
    await driver.get("http://localhost:3000/login");

    // 2. Fill login form
    await driver.findElement(By.css('input[type="email"]'))
      .sendKeys('aimentayyab215@gmail.com');
    await driver.findElement(By.css('input[type="password"]'))
      .sendKeys('aimen12');

    // 3. Click login
    await driver.findElement(By.css('button[type="submit"]')).click();

    // 4. Wait for redirect to dashboard
    await driver.wait(until.urlContains("/dashboard"), 20000);

    // 5. Wait for dashboard main container
    await driver.wait(until.elementLocated(By.css(".container")), 20000);

    // 6. Verify Add Task input exists
    await driver.wait(
      until.elementLocated(By.css("input[placeholder='Enter new task...']")),
      20000
    );
  });
});
