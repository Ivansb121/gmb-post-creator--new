/**
 * Netlify Function: sheet.js
 * Google Apps Script proxy — runs server-side to bypass browser CORS restrictions.
 * Google Apps Script URLs do a 302 redirect; Node fetch follows it automatically.
 *
 * Accepts POST with JSON body: { url, action, ...otherParams }
 * Calls: url?action=X&...otherParams
 * Returns the Apps Script JSON response directly.
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

exports.handler = async (event) => {
  // Preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS_HEADERS, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (e) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Invalid JSON body" })
    };
  }

  const { url, ...params } = body;

  if (!url) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Missing 'url' in request body" })
    };
  }

  // Build query string from remaining params
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  const targetUrl = url + (qs ? "?" + qs : "");

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      redirect: "follow",   // follows Google's 302 to googleusercontent.com
      headers: {
        "Accept": "application/json",
        "User-Agent": "GMBPostCreator/1.0"
      }
    });

    const text = await response.text();

    // Validate JSON
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      // If we get HTML (login page / error page from Google)
      if (text.includes("<!DOCTYPE") || text.includes("<html")) {
        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            error: "Apps Script returned an HTML page. Check: Deploy → Manage Deployments → Who has access = Anyone"
          })
        };
      }
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Non-JSON response: " + text.slice(0, 200) })
      };
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(parsed)
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Fetch failed: " + err.message })
    };
  }
};
