const GAS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwZuEkMw6rO6WR0qdezWsSxcxsLz0kmyMNakqOEtXIDt5v9H515vMxTv6mE4_P-xPNRDA/exec';

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        message: "Method Not Allowed"
      });
    }

    const gasUrl =
      "https://script.google.com/macros/s/AKfycbwZuEkMw6rO6WR0qdezWsSxcxsLz0kmyMNakqOEtXIDt5v9H515vMxTv6mE4_P-xPNRDA/exec";

    const response = await fetch(gasUrl, {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();

    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: `GAS book の返却がJSONではありません。HTTP ${response.status} / ${text.slice(0, 300)}`
      });
    }

    return res.status(response.ok ? 200 : 500).json(json);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "book API error"
    });
  }
}
