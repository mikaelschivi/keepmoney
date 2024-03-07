# Keepmoney - Telegram to Google Sheets Integration

This application is designed to allow users to easily log their latest purchases into a Google Sheets spreadsheet by sending a message to a Telegram bot. It provides a convenient way to track expenses and purchases in a centralized location.

## Features

- **Telegram Integration:** Interact with a Telegram bot to send messages containing purchase information.
- **Google Sheets Integration:** Automatically logs purchase information into a designated Google Sheets spreadsheet.
- **Simple Setup:** Easy-to-follow setup instructions to get the bot up and running quickly.

## Installation

1. Clone the repository to your local machine:

    ```
    git clone https://github.com/mikaelschivi/keepmoney
    ```

2. Install dependencies:

    ```
    cd keepmoney
    npm install
    ```

3. Set up environment variables:
   
   - Create a `.env` file in the root directory.
   - Add the following environment variables:
     ```
     TELEGRAM_API_KEY=your_telegram_api_key
     TELEGRAM_CHAT_ID=your_telegram_chat_id
     GOOGLE_API_KEY=your_google_api_key
     GOOGLE_SERVICE_ACCOUNT_EMAIL=your_google_service_account_email
     SPREADSHEET_ID=your_google_spreadsheet_id
     ```

## Usage

1. Start the bot:

    ```
    npm run start
    ```

2. Interact with the bot:
   
   - Send a message to the bot in the format: `item_name item_value`.
   - Example: `bread 2.50`
   - The bot will log the purchase into the Google Sheets spreadsheet.