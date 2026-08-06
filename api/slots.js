const GAS_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbwZuEkMw6rO6WR0qdezWsSxcxsLz0kmyMNakqOEtXIDt5v9H515vMxTv6mE4_P-xPNRDA/exec";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        message: "Method Not Allowed"
      });
    }

    const gasUrl =
      `${GAS_WEBAPP_URL}` +
      `?action=slots` +
      `&_=${Date.now()}`;

    const response = await fetch(gasUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache"
      },
      cache: "no-store"
    });

    const text = await response.text();

    let json;

    try {
      json = JSON.parse(text);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          `GAS slots の返却がJSONではありません。` +
          `HTTP ${response.status} / ${text.slice(0, 300)}`
      });
    }

    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );

    if (!response.ok || json.success === false) {
      return res.status(400).json(json);
    }

    return res.status(200).json(json);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "slots API error"
    });
  }
}
