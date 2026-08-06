const GAS_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbwZuEkMw6rO6WR0qdezWsSxcxsLz0kmyMNakqOEtXIDt5v9H515vMxTv6mE4_P-xPNRDA/exec";

const POLLING_INTERVAL_MS = 1000;
const MAX_POLLING_COUNT = 15;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateRequestId() {
  return [
    Date.now(),
    Math.random().toString(36).slice(2),
    Math.random().toString(36).slice(2)
  ].join("-");
}

async function sendBookingRequest(payload) {
  /*
   * GASの予約処理自体が完了すればよいため、
   * ContentServiceのリダイレクト後の本文はここでは読みません。
   */
  return fetch(GAS_WEBAPP_URL, {
    method: "POST",
    redirect: "manual",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(payload)
  });
}

async function fetchBookingResult(requestId) {
  const resultUrl =
    `${GAS_WEBAPP_URL}` +
    `?action=bookingResult` +
    `&requestId=${encodeURIComponent(requestId)}` +
    `&_=${Date.now()}`;

  const response = await fetch(resultUrl, {
    method: "GET",
    redirect: "follow",
    headers: {
      Accept: "application/json"
    },
    cache: "no-store"
  });

  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(
      `GAS bookingResult の返却がJSONではありません。` +
      `HTTP ${response.status} / ${text.slice(0, 300)}`
    );
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  const requestId = generateRequestId();

  const payload = {
    ...req.body,
    requestId
  };

  let postError = null;

  try {
    await sendBookingRequest(payload);
  } catch (error) {
    /*
     * 通信エラーに見えてもGAS側で予約が完了している可能性があるため、
     * ここでは終了せず、予約結果の確認へ進みます。
     */
    postError = error;
  }

  let lastPollingError = null;

  for (let count = 0; count < MAX_POLLING_COUNT; count++) {
    if (count > 0) {
      await sleep(POLLING_INTERVAL_MS);
    }

    try {
      const result = await fetchBookingResult(requestId);

      if (!result.ready) {
        continue;
      }

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message || "予約作成に失敗しました。"
        });
      }

      return res.status(200).json(result);

    } catch (error) {
      lastPollingError = error;
    }
  }

  console.error("Booking result timeout", {
    requestId,
    postError: postError ? postError.message : null,
    pollingError: lastPollingError ? lastPollingError.message : null
  });

  return res.status(504).json({
    success: false,
    message:
      "予約処理の結果確認がタイムアウトしました。" +
      "予約が反映されている可能性があるため、同じ内容を再送せず管理者へご確認ください。"
  });
}
