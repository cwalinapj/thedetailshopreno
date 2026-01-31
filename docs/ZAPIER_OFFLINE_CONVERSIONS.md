# Offline Conversion Tracking with Zapier

This document outlines the setup for tracking offline conversions (phone bookings) from Fieldd back to GA4.

## Conversion Flow

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐     ┌─────────┐
│  Website Visit  │────▶│  Phone Call  │────▶│  Fieldd     │────▶│  Zapier │
│  (GA4 tracks)   │     │  (Click2Call)│     │  Booking    │     │         │
└─────────────────┘     └──────────────┘     └─────────────┘     └────┬────┘
                                                                      │
                                                                      ▼
                                                              ┌─────────────┐
                                                              │  GA4 MP API │
                                                              │  (Offline   │
                                                              │  Conversion)│
                                                              └─────────────┘
```

## Setup Steps

### 1. GA4 Measurement Protocol Setup

First, get your GA4 Measurement Protocol credentials:

1. Go to GA4 Admin → Data Streams → Your Web Stream
2. Copy the **Measurement ID** (G-XXXXXXXXXX)
3. Go to "Measurement Protocol API secrets"
4. Create a new secret and copy the **API Secret**

### 2. Fieldd Webhook Configuration

In Fieldd dashboard:

1. Go to Settings → Integrations → Webhooks
2. Add a new webhook with:
   - **Event**: Booking Created / Booking Completed
   - **URL**: Your Zapier webhook URL (get from step 3)
   - **Format**: JSON

### 3. Zapier Zap Setup

Create a new Zap with these steps:

#### Trigger: Webhooks by Zapier
- **Event**: Catch Hook
- Copy the webhook URL to Fieldd (step 2)
- Test with a sample booking

#### Action 1: Formatter (Optional - Extract Client ID)
If you're passing the GA4 client_id through Fieldd booking notes:

- **Event**: Text
- **Transform**: Extract Pattern
- **Input**: `{{booking_notes}}`
- **Pattern**: `ga_client_id:([a-zA-Z0-9._-]+)`

#### Action 2: Webhooks by Zapier (Send to GA4)
- **Event**: Custom Request
- **Method**: POST
- **URL**:
  ```
  https://www.google-analytics.com/mp/collect?measurement_id=G-XXXXXXXXXX&api_secret=YOUR_API_SECRET
  ```
- **Data**:
  ```json
  {
    "client_id": "{{client_id_or_fallback}}",
    "events": [{
      "name": "purchase",
      "params": {
        "currency": "USD",
        "value": {{booking_total}},
        "transaction_id": "{{booking_id}}",
        "items": [{
          "item_name": "{{service_name}}",
          "price": {{booking_total}},
          "quantity": 1
        }]
      }
    }]
  }
  ```

### 4. Client ID Tracking (Advanced)

To properly attribute offline conversions to the original website visit:

#### Option A: Pass client_id through booking form

Add a hidden field to your Fieldd booking widget that captures the GA4 client_id:

```javascript
// On thedetailshopreno.com, before redirecting to Fieldd
const getGA4ClientId = () => {
  return new Promise((resolve) => {
    if (typeof gtag !== 'undefined') {
      gtag('get', 'G-XXXXXXXXXX', 'client_id', (clientId) => {
        resolve(clientId);
      });
    } else {
      resolve(null);
    }
  });
};

// Store in localStorage before redirect
getGA4ClientId().then(clientId => {
  if (clientId) {
    localStorage.setItem('ga_client_id', clientId);
  }
});
```

#### Option B: Cross-domain tracking with linker

Already configured in GTMScript.tsx - the client_id should pass through to Fieldd automatically via URL parameters.

#### Option C: Match by customer info (fallback)

If client_id isn't available, use phone number or email to match:

1. Store HubSpot leads with phone/email + timestamp
2. When Fieldd booking comes in, match by phone/email
3. Use the original click_to_call event's timestamp for conversion attribution

### 5. HubSpot → Fieldd → GA4 Flow

For leads that came through HubSpot before booking:

```
Zap 1: HubSpot New Contact
├── Store contact in Google Sheet (name, email, phone, timestamp, ga_client_id)
└── Tag contact as "Lead - Not Booked"

Zap 2: Fieldd New Booking
├── Lookup in Google Sheet by phone/email
├── If found:
│   ├── Get original ga_client_id
│   ├── Send purchase event to GA4 with that client_id
│   └── Update sheet status to "Booked"
└── If not found:
    └── Send purchase event with new client_id (direct booking)
```

### 6. Sample Zapier JSON for GA4 Measurement Protocol

```json
{
  "client_id": "{{client_id}}",
  "user_id": "{{customer_email}}",
  "timestamp_micros": "{{timestamp_unix_microseconds}}",
  "non_personalized_ads": false,
  "events": [
    {
      "name": "purchase",
      "params": {
        "currency": "USD",
        "value": {{total_amount}},
        "transaction_id": "fieldd_{{booking_id}}",
        "affiliation": "Fieldd Booking",
        "tax": 0,
        "shipping": 0,
        "coupon": "",
        "items": [
          {
            "item_id": "{{service_id}}",
            "item_name": "{{service_name}}",
            "item_category": "Auto Detailing",
            "price": {{service_price}},
            "quantity": 1
          }
        ]
      }
    }
  ]
}
```

### 7. Google Ads Conversion Import

To import these conversions into Google Ads:

1. In Google Ads, go to Tools → Conversions
2. Click "+" to add conversion
3. Select "Import" → "Google Analytics 4 properties"
4. Select your GA4 property
5. Choose the "purchase" event
6. Set conversion value to "Use the value from the conversion event"
7. Set attribution model (recommend: Data-driven or Position-based)

### 8. Testing

1. Make a test booking through Fieldd
2. Check Zapier task history for successful run
3. In GA4 DebugView, verify the purchase event appears
4. Check GA4 Realtime → Conversions
5. After 24-48 hours, verify in GA4 Reports → Monetization → Ecommerce purchases

## Troubleshooting

### Event not showing in GA4
- Verify Measurement ID and API Secret are correct
- Check client_id format (should be like `GA1.1.123456789.1234567890`)
- Ensure timestamp is within 72 hours of current time
- Check for JSON formatting errors in Zapier

### Conversion not attributed correctly
- Verify cross-domain tracking is working
- Check that linker parameter is passing to Fieldd
- Use "user_id" parameter for better cross-device attribution

### Duplicate conversions
- Add deduplication filter in Zapier (check booking_id)
- Use transaction_id to prevent duplicates in GA4
