FROM node:20

# Install Google Chrome
RUN apt-get update && apt-get install -y wget gnupg unzip curl \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list' \
    && apt-get update && apt-get install -y google-chrome-stable

# Install ChromeDriver matching Chrome
RUN CHROME_VERSION=$(google-chrome --version | sed 's/Google Chrome //') \
    && DRIVER_URL=$(curl -s "https://googlechromelabs.github.io/chrome-for-testing/known-good-versions-with-downloads.json" \
        | grep -A 20 "$CHROME_VERSION" | grep "linux64" | grep "url" | cut -d '"' -f 4) \
    && wget -O chromedriver.zip "$DRIVER_URL" \
    && unzip chromedriver.zip \
    && mv chromedriver-linux64/chromedriver /usr/bin/chromedriver \
    && chmod +x /usr/bin/chromedriver

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Run ALL tests
CMD ["npx", "mocha", "*.test.js", "--timeout", "120000", "--exit"]
