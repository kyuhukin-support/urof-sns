const GAS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxRDywg23acgY-1GIXNAujOH17U4lzm7CV5J6c0Ceq0RweBchG6xoOFCaLFlXTicX4VVA/exec';

export default async function handler(req, res) {
  try {
    const gasBaseUrl =
      "https://script.google.com/macros/s/AKfycbxRDywg23acgY-1GIXNAujOH17U4lzm7CV5J6c0Ceq0RweBchG6xoOFCaLFlXTicX4VVA/exec";

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
