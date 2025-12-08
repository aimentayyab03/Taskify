FROM node:20

# Install Chrome and dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    wget \
    unzip \
    curl \
    libxi6 \
    libgconf-2-4 \
    libxss1 \
    libnss3 \
    libasound2 \
    fonts-liberation \
    libappindicator3-1 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy package.json first and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy all test files
COPY . .

# Set Chrome environment variable
ENV CHROME_BIN=/usr/bin/chromium

# Run only login test
CMD ["npx", "mocha", "login.test.js", "--timeout", "120000", "--exit"]
