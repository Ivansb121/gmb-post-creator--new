const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Content-Type": "application/json" };

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: CORS, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: "Method not allowed" }) };

  let body;
  try { body = JSON.parse(event.body || "{}"); }
  catch(e) { return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Invalid JSON" }) }; }

  const { url, ...params } = body;
  if (!url) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Missing url" }) };

  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  const targetUrl = url + (qs ? "?" + qs : "");

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      redirect: "follow",
      headers: { "Accept": "application/json", "User-Agent": "GMBPostCreator/1.0" }
    });

    const text = await response.text();

    if (text.includes("<!DOCTYPE") || text.includes("<html")) {
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: "Apps Script returned HTML. Go to Apps Script → Deploy → Manage Deployments → set 'Who has access' to Anyone" }) };
    }

    let parsed;
    try { parsed = JSON.parse(text); }
    catch(e) { return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: "Non-JSON response: " + text.slice(0, 200) }) }; }

    return { statusCode: 200, headers: CORS, body: JSON.stringify(parsed) };
  } catch (err) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: "Fetch failed: " + err.message }) };
  }
};
