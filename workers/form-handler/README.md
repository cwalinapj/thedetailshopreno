# Form Handler Worker Setup

This Cloudflare Worker receives form submissions and:
1. Saves them to a Google Sheet
2. Sends you an email notification (optional)

## Setup Steps

### 1. Create Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google Sheets API**:
   - Go to APIs & Services > Library
   - Search for "Google Sheets API" and enable it
4. Create a Service Account:
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "Service Account"
   - Name it (e.g., "form-handler")
   - Copy the **email address** (e.g., `form-handler@project.iam.gserviceaccount.com`)
5. Create a key:
   - Click on the service account
   - Go to "Keys" tab
   - Add Key > Create new key > JSON
   - Download and save the JSON file securely
   - The `private_key` field contains your private key

### 2. Create Google Sheet

1. Create a new Google Sheet
2. Add headers in Row 1:
   ```
   Timestamp | Name | Email | Phone | Notes | Source | Locale
   ```
3. Share the sheet with your service account email (step 1.4) as **Editor**
4. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```

### 3. Set Up Email Notifications (Optional)

1. Sign up at [Resend.com](https://resend.com)
2. Verify your domain (thedetailshopreno.com)
3. Get your API key from the dashboard

### 4. Deploy the Worker

```bash
cd workers/form-handler
npm install

# Set secrets (you'll be prompted for values)
wrangler secret put GOOGLE_SERVICE_ACCOUNT_EMAIL
wrangler secret put GOOGLE_PRIVATE_KEY
wrangler secret put GOOGLE_SHEET_ID
wrangler secret put NOTIFICATION_EMAIL
wrangler secret put RESEND_API_KEY  # optional

# Deploy
wrangler deploy
```

### 5. Configure the Site

Add the worker URL to your environment:

```bash
# In .env.local or Cloudflare Pages settings
NEXT_PUBLIC_FORM_WORKER_URL=https://detailshop-form-handler.YOUR_SUBDOMAIN.workers.dev
```

## Testing

```bash
# Local development
wrangler dev

# Test with curl
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"name":"Test","email":"test@example.com","phone":"775-555-1234","notes":"Testing"}'
```

## Secrets Reference

| Secret | Description |
|--------|-------------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email (e.g., `name@project.iam.gserviceaccount.com`) |
| `GOOGLE_PRIVATE_KEY` | Private key from JSON file (include `-----BEGIN/END-----`) |
| `GOOGLE_SHEET_ID` | ID from Google Sheet URL |
| `NOTIFICATION_EMAIL` | Email to receive notifications |
| `RESEND_API_KEY` | Resend API key for email sending |
