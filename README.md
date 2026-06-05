<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>日程調整ページ</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif;
      background: #f7f7f7;
      color: #222;
    }
    .wrap {
      max-width: 900px;
      margin: 0 auto;
      padding: 24px 16px;
    }
    .card {
      background: #fff;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      margin-bottom: 16px;
    }
    h1 {
      margin: 0 0 12px;
      font-size: 32px;
      line-height: 1.4;
    }
    h2 {
      margin: 0 0 12px;
      font-size: 20px;
    }
    p {
      line-height: 1.8;
      color: #555;
      margin: 0;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 14px;
    }
    .chip {
      border: 1px solid #d0d7de;
      background: #fff;
      border-radius: 999px;
      padding: 12px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: .15s ease;
    }
    .chip:hover {
      background: #f0f6ff;
    }
    .chip.active {
      background: #1a73e8;
      color: #fff;
      border-color: #1a73e8;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
      margin-top: 14px;
    }
    @media (max-width: 640px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
    .field label {
      display: block;
      font-size: 13px;
      color: #666;
      margin-bottom: 6px;
    }
    .field input,
    .field select {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #d0d7de;
      border-radius: 10px;
      padding: 12px;
      font-size: 14px;
      background: #fff;
    }
    .submit-row {
      margin-top: 18px;
    }
    .btn {
      display: inline-block;
      border: none;
      border-radius: 10px;
      background: #1a73e8;
      color: #fff;
      padding: 14px 20px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      width: 100%;
    }
    .btn:disabled {
      background: #9bbff2;
      cursor: not-allowed;
    }
    .summary {
      margin-top: 16px;
      padding: 14px 16px;
      border-radius: 12px;
      background: #eef7ee;
      font-size: 14px;
      line-height: 1.8;
    }
    .empty {
      margin-top: 12px;
      color: #777;
      font-size: 14px;
    }
    .error {
      margin-top: 12px;
      padding: 12px 14px;
      border-radius: 10px;
      background: #fff2f0;
      color: #c62828;
      font-size: 14px;
      line-height: 1.7;
      display: none;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .success {
      margin-top: 12px;
      padding: 12px 14px;
      border-radius: 10px;
      background: #eef7ee;
      color: #1b5e20;
      font-size: 14px;
      line-height: 1.7;
      display: none;
      word-break: break-word;
    }
    .loading {
      color: #666;
      font-size: 14px;
      margin-top: 12px;
    }
    a {
      word-break: break-all;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h1>日程調整ページ</h1>
      <p>ご希望の日付と時間を選択し、その後に必要情報をご入力ください。</p>
      <div class="loading" id="loadingSlots">空き枠を読み込み中です...</div>
    </div>

    <div class="card">
      <h2>1. 日付を選択</h2>
      <div class="chips" id="dateChips"></div>
      <div class="empty" id="emptyDate" style="display:none;">表示できる日付がありません。</div>
    </div>

    <div class="card">
      <h2>2. 時間を選択</h2>
      <div class="chips" id="timeChips"></div>
      <div class="empty" id="emptyTime" style="display:none;">この日の時間候補はありません。</div>
    </div>

    <div class="card">
      <h2>3. 必要情報を入力</h2>

      <div class="grid">
        <div class="field">
          <label>姓</label>
          <input id="lastName" type="text" placeholder="例: 山田">
        </div>
        <div class="field">
          <label>名</label>
          <input id="firstName" type="text" placeholder="例: 太郎">
        </div>

        <div class="field">
          <label>セイ</label>
          <input id="lastNameKana" type="text" placeholder="例: ヤマダ">
        </div>
        <div class="field">
          <label>メイ</label>
          <input id="firstNameKana" type="text" placeholder="例: タロウ">
        </div>

        <div class="field">
          <label>年齢</label>
          <input id="age" type="text" placeholder="例: 35">
        </div>
        <div class="field">
          <label>メールアドレス</label>
          <input id="email" type="email" placeholder="example@example.com">
        </div>

        <div class="field">
          <label>携帯番号</label>
          <input id="phone" type="tel" placeholder="09012345678">
        </div>
        <div class="field">
          <label>携帯番号(確認用)</label>
          <input id="phoneConfirm" type="tel" placeholder="09012345678">
        </div>

        <div class="field">
          <label>勤続年数</label>
          <input id="yearsOfService" type="text" placeholder="例: 3年">
        </div>
        <div class="field">
          <label>退職予定日</label>
          <input id="retirementDate" type="date">
        </div>

        <div class="field">
          <label>社会保険の加入</label>
          <select id="socialInsurance">
            <option value="">選択してください</option>
            <option value="あり">あり</option>
            <option value="なし">なし</option>
          </select>
        </div>
        <div class="field">
          <label>雇用保険の加入</label>
          <select id="employmentInsurance">
            <option value="">選択してください</option>
            <option value="あり">あり</option>
            <option value="なし">なし</option>
          </select>
        </div>
      </div>

      <div class="summary" id="summaryBox">
        選択中の日付: 未選択<br>
        選択中の時間: 未選択
      </div>

      <div class="submit-row">
        <button class="btn" id="submitBtn" type="button">この内容で予約する</button>
      </div>

      <div class="error" id="errorBox"></div>
      <div class="success" id="successBox"></div>
    </div>
  </div>

  <script>
    let scheduleData = [];
    let selectedDateValue = "";
    let selectedDateLabel = "";
    let selectedTimeStart = "";
    let selectedTimeEnd = "";
    let selectedTimeLabel = "";
    let isSubmitting = false;

    function normalizePhone(value) {
      return String(value || "").replace(/\D/g, "");
    }

    function isValidMobilePhone(value) {
      return /^0\d{10}$/.test(normalizePhone(value));
    }

    async function loadSlots() {
      try {
        const response = await fetch('/api/slots');
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || '空き枠取得に失敗しました。');
        }

        scheduleData = result.dates || [];
        renderDates();
        document.getElementById('loadingSlots').style.display = 'none';

        if (!scheduleData.length) {
          document.getElementById('emptyDate').style.display = 'block';
        }
      } catch (error) {
        document.getElementById('loadingSlots').style.display = 'none';
        showError(error.message || '空き枠取得エラー');
      }
    }

    function renderDates() {
      const dateChips = document.getElementById("dateChips");
      dateChips.innerHTML = "";

      scheduleData.forEach((dateObj) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "chip";
        btn.textContent = dateObj.label;

        btn.addEventListener("click", () => {
          selectedDateValue = dateObj.value;
          selectedDateLabel = dateObj.label;
          selectedTimeStart = "";
          selectedTimeEnd = "";
          selectedTimeLabel = "";
          updateActiveDate();
          renderTimes(dateObj.times || []);
          updateSummary();
          clearMessages();
        });

        dateChips.appendChild(btn);
      });
    }

    function updateActiveDate() {
      document.querySelectorAll("#dateChips .chip").forEach((chip) => {
        chip.classList.toggle("active", chip.textContent === selectedDateLabel);
      });
    }

    function renderTimes(times) {
      const timeChips = document.getElementById("timeChips");
      const emptyTime = document.getElementById("emptyTime");
      timeChips.innerHTML = "";

      if (!times.length) {
        emptyTime.style.display = "block";
        return;
      }

      emptyTime.style.display = "none";

      times.forEach((timeObj) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "chip";
        btn.textContent = timeObj.label;

        btn.addEventListener("click", () => {
          selectedTimeStart = timeObj.start;
          selectedTimeEnd = timeObj.end;
          selectedTimeLabel = timeObj.label;
          updateActiveTime();
          updateSummary();
          clearMessages();
        });

        timeChips.appendChild(btn);
      });
    }

    function updateActiveTime() {
      document.querySelectorAll("#timeChips .chip").forEach((chip) => {
        chip.classList.toggle("active", chip.textContent === selectedTimeLabel);
      });
    }

    function updateSummary() {
      document.getElementById("summaryBox").innerHTML =
        "選択中の日付: " + (selectedDateLabel || "未選択") + "<br>" +
        "選択中の時間: " + (selectedTimeLabel || "未選択");
    }

    function clearMessages() {
      document.getElementById("errorBox").style.display = "none";
      document.getElementById("successBox").style.display = "none";
      document.getElementById("errorBox").textContent = "";
      document.getElementById("successBox").textContent = "";
    }

    function showError(message) {
      const box = document.getElementById("errorBox");
      box.textContent = message;
      box.style.display = "block";
      document.getElementById("successBox").style.display = "none";
    }

    function getValue(id) {
      return document.getElementById(id).value.trim();
    }

    function redirectToCompletePage(result) {
      const params = new URLSearchParams({
        bookingDate: result.bookingDate || "",
        bookingStartTime: result.bookingStartTime || "",
        bookingEndTime: result.bookingEndTime || "",
        fullName: result.fullName || "",
        bookingId: result.bookingId || "",
        managementUrl: result.managementUrl || ""
      });

      window.location.href = "/complete.html?" + params.toString();
    }

    document.getElementById("submitBtn").addEventListener("click", async () => {
      if (isSubmitting) return;

      clearMessages();

      const submitBtn = document.getElementById("submitBtn");

      const payload = {
        bookingDate: selectedDateValue,
        bookingStartTime: selectedTimeStart,
        lastName: getValue("lastName"),
        firstName: getValue("firstName"),
        lastNameKana: getValue("lastNameKana"),
        firstNameKana: getValue("firstNameKana"),
        age: getValue("age"),
        email: getValue("email"),
        phone: getValue("phone"),
        phoneConfirm: getValue("phoneConfirm"),
        yearsOfService: getValue("yearsOfService"),
        retirementDate: getValue("retirementDate"),
        socialInsurance: getValue("socialInsurance"),
        employmentInsurance: getValue("employmentInsurance")
      };

      if (!payload.bookingDate) return showError("日付を選択してください。");
      if (!payload.bookingStartTime) return showError("時間を選択してください。");
      if (!payload.lastName) return showError("姓を入力してください。");
      if (!payload.firstName) return showError("名を入力してください。");
      if (!payload.lastNameKana) return showError("セイを入力してください。");
      if (!payload.firstNameKana) return showError("メイを入力してください。");
      if (!payload.age) return showError("年齢を入力してください。");
      if (!payload.email) return showError("メールアドレスを入力してください。");
      if (!payload.phone) return showError("携帯番号を入力してください。");
      if (!payload.phoneConfirm) return showError("携帯番号(確認用)を入力してください。");

      const normalizedPhone = normalizePhone(payload.phone);
      const normalizedPhoneConfirm = normalizePhone(payload.phoneConfirm);

      if (!isValidMobilePhone(normalizedPhone)) {
        return showError("携帯番号は11桁の携帯番号を入力してください。");
      }

      if (!isValidMobilePhone(normalizedPhoneConfirm)) {
        return showError("携帯番号(確認用)は11桁の携帯番号を入力してください。");
      }

      if (normalizedPhone !== normalizedPhoneConfirm) {
        return showError("携帯番号と携帯番号(確認用)が一致していません。");
      }

      payload.phone = normalizedPhone;
      payload.phoneConfirm = normalizedPhoneConfirm;

      if (!payload.yearsOfService) return showError("勤続年数を入力してください。");
      if (!payload.retirementDate) return showError("退職予定日を入力してください。");
      if (!payload.socialInsurance) return showError("社会保険の加入を選択してください。");
      if (!payload.employmentInsurance) return showError("雇用保険の加入を選択してください。");

      try {
        isSubmitting = true;
        submitBtn.disabled = true;
        submitBtn.textContent = "予約を確定中です...";

        const response = await fetch('/api/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          isSubmitting = false;
          submitBtn.disabled = false;
          submitBtn.textContent = "この内容で予約する";
          return showError(result.message || '送信に失敗しました。');
        }

        redirectToCompletePage(result);

      } catch (error) {
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.textContent = "この内容で予約する";
        showError("通信エラーが発生しました。");
      }
    });

    loadSlots();
  </script>
</body>
</html>
