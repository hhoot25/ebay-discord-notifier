# eBay Discord Notifier

Sends Discord notifications to a configured webhook when new eBay listings match a search term.

This small Node.js project periodically queries the eBay Browse API for newly listed items and posts a nicely-formatted message (with up to 10 embeds) to a Discord webhook.

## Features
- Polls eBay for newly listed items (sorted by newest)
- Filters out already-seen items to avoid duplicate notifications
- Sends a single Discord message containing up to 10 embeds for new listings
- Uses environment variables for credentials and configuration

## Prerequisites
- Node.js 18+ (or a recent Node 16+ runtime that supports ES modules)
- An eBay Developer App (Client ID / Client Secret) with access to the OAuth2 Client Credentials flow
- A Discord webhook URL where notifications will be posted

## Install

1. Clone the repo and change into the project directory

2. Install dependencies:

```bash
npm install
```

## Configuration
Create a `.env` file in the project root with the following variables:

```
CLIENT_ID=your_ebay_client_id
CLIENT_SECRET=your_ebay_client_secret
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
DISCORD_USER_ID=123456789012345678   # optional: mention a user in the message (without @)
```

Notes:
- The project uses the eBay OAuth2 Client Credentials flow to obtain an app access token. Keep your client secret private.
- `DISCORD_USER_ID` is optional and is used in the notification message to ping a user.

## Configuration in code
- The search term is defined in `main.js` as `SEARCH_TERM`. Edit that constant to change what the bot searches for:

```js
export const SEARCH_TERM = "pokemon";
```

- The polling interval is controlled by `CHECK_INTERVAL_MINUTES` in `main.js`. It is currently set to a small value for testing; increase it for production usage.

## Files of interest
- `main.js` – application entry point, obtains token, runs the periodic search loop
- `acquireToken.js` – gets eBay OAuth2 access token using client credentials
- `searchEbay.js` – queries eBay Browse API and tracks seen item IDs
- `discordNotification.js` – formats and sends Discord webhook messages

## Run

Start the notifier with Node:

```bash
node main.js
```

You should see console logs indicating the token was obtained and when new listings are found. When new items are discovered, the app sends a Discord message to the configured webhook.

## Example .env (do not commit)

```
CLIENT_ID=abcd1234
CLIENT_SECRET=verysecret
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx/yyy
DISCORD_USER_ID=123456789012345678
```

## Troubleshooting
- "Token fetch failed": check `CLIENT_ID` and `CLIENT_SECRET` and that your eBay app has the correct scopes.
- "Search failed": confirm token is valid and that `SEARCH_TERM` is set correctly.
- Discord webhook errors: check that the webhook URL is correct and the bot isn't hitting rate limits. Inspect console logs for Discord response bodies.

## Notes & next steps
- The project currently hardcodes `SEARCH_TERM` in `main.js`. Consider moving it to an environment variable for easier configuration.
- Add a retry/backoff strategy for token and search calls for better resilience.
- Add a small script or npm script for running in production (PM2, Docker, or a systemd service recommended).

## License
ISC
