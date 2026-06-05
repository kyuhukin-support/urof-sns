const GAS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwZuEkMw6rO6WR0qdezWsSxcxsLz0kmyMNakqOEtXIDt5v9H515vMxTv6mE4_P-xPNRDA/exec';

export default async function handler(req, res) {
  try {
    const gasBaseUrl =
      "https://script.google.com/macros/s/AKfycbwZuEkMw6rO6WR0qdezWsSxcxsLz0kmyMNakqOEtXIDt5v9H515vMxTv6mE4_P-xPNRDA/exec";

    const gasUrl = `${gasBaseUrl}?action=slots`;

    const response = await fetch(gasUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        "Accept": "application/json"
      }
    });

    const text = await response.text();

    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: `GAS slots の返却がJSONではありません。HTTP ${response.status} / ${text.slice(0, 300)}`
      });
    }

    return res.status(response.ok ? 200 : 500).json(json);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "slots API error"
    });
  }
}
