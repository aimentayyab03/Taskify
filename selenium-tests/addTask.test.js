// tests/addTask.test.js
const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');
const assert = require('assert');

describe('Add Task Test', function () {
  this.timeout(60000); // Increased timeout for EC2 / headless

  let driver;

  before(async function () {
    // Headless Chrome setup
    const options = new chrome.Options();
    options.addArguments('--headless'); // Run in headless mode
    options.addArguments('--no-sandbox'); // Needed for Linux/EC2
    options.addArguments('--disable-dev-shm-usage'); // Prevent limited resource issues
    options.addArguments('--window-size=1920,1080'); // Standard viewport

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('should add a new task successfully', async function () {
const BASE_URL = 'http://13.51.199.30'; // EC2 frontend URL, port 80
    // 1. Open login page
    await driver.get(BASE_URL + '/login');

    // 2. Fill login form
    await driver.findElement(By.css('input[type="email"]')).sendKeys('aimentayyab215@gmail.com');
    await driver.findElement(By.css('input[type="password"]')).sendKeys('aimen12');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // 3. Wait for dashboard URL
    await driver.wait(until.urlContains('/dashboard'), 15000);

    // 4. Click "All Tasks" button
    const allTasksBtn = await driver.findElement(By.xpath("//button[contains(text(),'All')]"));
    await allTasksBtn.click();

    // 5. Wait for "Add Task" input to appear
    const addTaskInput = await driver.wait(
      until.elementLocated(By.css('input[placeholder="Enter new task..."]')),
      10000
    );

    // 6. Fill new task form
    const taskTitle = 'Selenium Test Task';
    await addTaskInput.sendKeys(taskTitle);

    // Select category (e.g., Work)
    const categorySelect = await driver.findElement(By.css('select'));
    await categorySelect.sendKeys('Work');

    // Fill date
    const taskDate = '2025-12-08'; // format must match your app's input type="date"
    await driver.findElement(By.css('input[type="date"]')).sendKeys(taskDate);

    // 7. Click "Add Task"
    await driver.findElement(By.css('button.add-btn')).click();

    // 8. Wait for new task to appear in the list
    const newTask = await driver.wait(
      until.elementLocated(By.xpath(`//div[contains(@class,'task-title') and text()='${taskTitle}']`)),
      10000
    );

    const taskText = await newTask.getText();
    assert.strictEqual(taskText, taskTitle);
  });
});
