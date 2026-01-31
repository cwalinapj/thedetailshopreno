/**
 * Cloudflare Worker: Form Handler
 * Receives form submissions, saves to Google Sheets, and sends email notifications
 */

interface Env {
  ALLOWED_ORIGIN: string;
  GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
  GOOGLE_SHEET_ID: string;
  NOTIFICATION_EMAIL: string;
  RESEND_API_KEY?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
  source?: string;
  locale?: string;
}

// CORS headers
function corsHeaders(origin: string, allowedOrigin: string): HeadersInit {
  const isAllowed = origin === allowedOrigin ||
                    origin === 'http://localhost:3000' ||
                    origin === 'http://localhost:3001';
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

// Generate JWT for Google API authentication
async function generateGoogleJWT(email: string, privateKey: string): Promise<string> {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  // Import the private key
  const pemContents = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\n/g, '');

  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signatureInput)
  );

  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${signatureInput}.${encodedSignature}`;
}

// Get Google access token
async function getGoogleAccessToken(email: string, privateKey: string): Promise<string> {
  const jwt = await generateGoogleJWT(email, privateKey);

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${await response.text()}`);
  }

  const data = await response.json() as { access_token: string };
  return data.access_token;
}

// Append row to Google Sheets
async function appendToGoogleSheet(
  accessToken: string,
  sheetId: string,
  formData: FormData
): Promise<void> {
  const timestamp = new Date().toISOString();
  const values = [[
    timestamp,
    formData.name,
    formData.email,
    formData.phone,
    formData.notes,
    formData.source || 'hero-form',
    formData.locale || 'en',
  ]];

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A:G:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to append to sheet: ${await response.text()}`);
  }
}

// Send email notification via Resend
async function sendEmailNotification(
  apiKey: string,
  toEmail: string,
  formData: FormData
): Promise<void> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Car Detailing Reno <notifications@thedetailshopreno.com>',
      to: [toEmail],
      subject: `New Lead: ${formData.name} - ${formData.phone}`,
      html: `
        <h2>New Consultation Request</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        <p><strong>Notes:</strong> ${formData.notes || 'None'}</p>
        <p><strong>Source:</strong> ${formData.source || 'hero-form'}</p>
        <p><strong>Language:</strong> ${formData.locale || 'en'}</p>
        <hr>
        <p><em>Submitted at ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</em></p>
      `,
    }),
  });

  if (!response.ok) {
    console.error('Failed to send email:', await response.text());
    // Don't throw - email is secondary to the sheet logging
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin, env.ALLOWED_ORIGIN);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    try {
      const formData: FormData = await request.json();

      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      // Get Google access token and append to sheet
      const accessToken = await getGoogleAccessToken(
        env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        env.GOOGLE_PRIVATE_KEY
      );

      await appendToGoogleSheet(accessToken, env.GOOGLE_SHEET_ID, formData);

      // Send email notification if Resend is configured
      if (env.RESEND_API_KEY && env.NOTIFICATION_EMAIL) {
        await sendEmailNotification(env.RESEND_API_KEY, env.NOTIFICATION_EMAIL, formData);
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('Form submission error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
  },
};
