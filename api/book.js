const GAS_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbwZuEkMw6rO6WR0qdezWsSxcxsLz0kmyMNakqOEtXIDt5v9H515vMxTv6mE4_P-xPNRDA/exec";

const REDIRECT_STATUS_CODES = new Set([301, 302, 303, 307, 308]);

async function fetchGasResponse(payload) {
  let requestUrl = GAS_WEBAPP_URL;
  let requestMethod = "POST";
  let requestBody = JSON.stringify(payload);

  for (let redirectCount = 0; redirectCount < 5; redirectCount++) {
    const headers =
      requestMethod === "POST"
        ? {
            "Content-Type": "application/json",
            Accept: "application/json"
          }
        : {
            Accept: "application/json"
          };

    const response = await fetch(requestUrl, {
      method: requestMethod,
      redirect: "manual",
      headers,
      body: requestMethod === "POST" ? requestBody : undefined
    });

    if (!REDIRECT_STATUS_CODES.has(response.status)) {
      return response;
    }

    const redirectUrl = response.headers.get("location");

    if (!redirectUrl) {
      throw new Error(
        `GASからリダイレクトURLを取得できませんでした。HTTP ${response.status}`
      );
    }

    requestUrl = new URL(redirectUrl, requestUrl).toString();

    // Apps Script ContentServiceの302リダイレクト先はGETで取得する
    if ([301, 302, 303].includes(response.status)) {
      requestMethod = "GET";
      requestBody = undefined;
    }
  }

  throw new Error("GASのリダイレクト回数が上限を超えました。");
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        message: "Method Not Allowed"
      });
    }

    const response = await fetchGasResponse(req.body);
    const text = await response.text();

    let json;

    try {
      json = JSON.parse(text);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          `GAS book の返却がJSONではありません。` +
          `HTTP ${response.status} / ${text.slice(0, 300)}`
      });
    }

    if (!json.success) {
      return res.status(400).json(json);
    }

    return res.status(200).json(json);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "book API error"
    });
  }
}
