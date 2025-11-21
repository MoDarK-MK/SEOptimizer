const analyzer = new SEOAnalyzer();
let currentAnalysisData = null;

function switchTab(tabName) {
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => content.classList.remove("active"));
  event.target.classList.add("active");
  document.getElementById(tabName + "Tab").classList.add("active");
  if (tabName === "history") loadHistory();
}

function loadFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById("textInput").value = e.target.result;
  };
  reader.readAsText(file);
}

function loadSampleText() {
  document.getElementById("textInput").value =
    "بهینه‌سازی موتورهای جستجو یا سئو یکی از مهم‌ترین تکنیک‌های بازاریابی دیجیتال است. با استفاده از سئو می‌توانید وب‌سایت خود را در نتایج جستجوی گوگل بهبود دهید و ترافیک ارگانیک بیشتری جذب کنید. کلمات کلیدی مناسب، محتوای باکیفیت و ساختار صحیح وب‌سایت از عوامل مهم در سئو هستند. همچنین سرعت بارگذاری سایت، تجربه کاربری و بهینه‌سازی موبایل نیز تاثیر زیادی در رتبه‌بندی دارند. استفاده از لینک‌های داخلی و خارجی، تصاویر بهینه شده با alt text و محتوای منحصر به فرد از دیگر نکات کلیدی SEO می‌باشند.";
}

function analyzeSEO() {
  const text = document.getElementById("textInput").value.trim();
  if (!text) {
    alert("⚠️ لطفاً ابتدا متنی وارد کنید!");
    return;
  }
  try {
    const analysisData = analyzer.analyze(text);
    currentAnalysisData = analysisData;
    saveToHistory(analysisData);
    displayResults(analysisData);
    updateVisualizations(analysisData);
    applyGradientColors();
  } catch (error) {
    alert("خطا در تحلیل متن: " + error.message);
  }
}

function displayResults(data) {
  const resultsDiv = document.getElementById("results");
  const clearBtn = document.getElementById("clearBtn");
  let scoreClass =
    data.score >= 70
      ? "score-excellent"
      : data.score >= 40
      ? "score-good"
      : "score-poor";
  let scoreLabel =
    data.score >= 70 ? "عالی" : data.score >= 40 ? "خوب" : "نیاز به بهبود";
  let html = `
    <div class="stat-grid">
      <div class="stat-card liquid-glass"><div class="stat-value">${data.wordCount}</div><div class="stat-label">📊 کلمات</div></div>
      <div class="stat-card liquid-glass"><div class="stat-value">${data.charCount}</div><div class="stat-label">📝 کاراکتر</div></div>
      <div class="stat-card liquid-glass"><div class="stat-value">${data.uniqueWords}</div><div class="stat-label">🔤 کلمات منحصر</div></div>
      <div class="stat-card liquid-glass"><div class="stat-value">${data.sentenceCount}</div><div class="stat-label">📄 جملات</div></div>
    </div>
    <div class="result-card liquid-glass"><h3>🌐 زبان متن</h3><p><span class="language-badge">${data.language}</span></p></div>
    <div class="result-card liquid-glass"><h3>📖 خوانایی متن</h3><p>
      <span class="readability-indicator ${data.readability.className}">${data.readability.level}</span>
      میانگین ${data.avgWordsPerSentence} کلمه در هر جمله</p>
    </div>
  `;
  if (data.keywords.length)
    html += `<div class="result-card liquid-glass"><h3>🔑 کلمات کلیدی برتر</h3>
      <div class="keywords-list">${data.keywords
        .map((kw) => `<span class="keyword-tag">${kw[0]} (${kw[1]})</span>`)
        .join("")}</div></div>`;
  if (data.keywordDensities.length) {
    html += `<div class="result-card liquid-glass"><h3>🔍 تراکم کلمات کلیدی</h3>`;
    data.keywordDensities.forEach((kw) => {
      html += `<div style="margin: 10px 0;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>${kw.word}</span>
          <span class="density-indicator"><span>${
            kw.density
          }%</span><span style="color:${kw.color};">${kw.status}</span></span>
        </div>
        <div class="density-bar"><div class="density-fill" style="width: ${Math.min(
          kw.density * 33,
          100
        )}%; background:${kw.color};"></div></div>
      </div>`;
    });
    html += `</div>`;
  }
  html += `
    <div class="result-card liquid-glass"><h3>📌 عنوان پیشنهادی SEO</h3><p>${
      data.seoTitle
    }</p>
      <button class="copy-btn" onclick="copyToClipboard('${
        data.seoTitle
      }', this)">📋 کپی عنوان</button>
    </div>
    <div class="result-card liquid-glass"><h3>📄 توضیحات متا پیشنهادی</h3><p>${
      data.metaDescription
    }</p>
      <button class="copy-btn" onclick="copyToClipboard('${
        data.metaDescription
      }', this)">📋 کپی توضیحات</button>
    </div>
    <div class="score-card liquid-glass"><h3>⭐ امتیاز کلی SEO</h3>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${data.score}%;${
    data.score < 40
      ? "background:#e74c3c;"
      : data.score < 70
      ? "background:#f39c12;"
      : ""
  }">${data.score}%</div>
      </div>
      <div class="score-value ${scoreClass}">${data.score}/100</div>
      <p>${scoreLabel}</p>
    </div>
  `;
  if (data.suggestions.length) {
    html += `<div class="result-card liquid-glass"><h3>💡 پیشنهادات بهبود</h3>`;
    data.suggestions.forEach((sug) => {
      html += `<div class="suggestion-card"><h4>${sug.title}</h4><p>${sug.text}</p></div>`;
    });
    html += `</div>`;
  }
  resultsDiv.innerHTML = html;
  resultsDiv.classList.add("show");
  clearBtn.style.display = "block";
  applyGradientColors();
}

function updateVisualizations(data) {
  updateWordCloud(data.keywords);
  updateProgressRing(data.score);
  updateHashtags(data.keywords);
  updateDensityChart(data.keywordDensities);
  applyGradientColors();
}

function updateWordCloud(keywords) {
  const wordCloud = document.getElementById("wordCloud");
  if (!keywords.length) {
    wordCloud.innerHTML =
      '<p style="text-align:center;color:rgba(245,245,245,0.7);">کلمات کلیدی یافت نشد</p>';
    return;
  }
  const maxFreq = keywords[0][1];
  wordCloud.innerHTML = keywords
    .map((kw, i) => {
      const size = 12 + (kw[1] / maxFreq) * 20;
      const delay = i * 0.3;
      return `<div class="word-cloud-item" style="font-size:${size}px;animation-delay:${delay}s;">${kw[0]}</div>`;
    })
    .join("");
  applyGradientColors();
}

function updateProgressRing(score) {
  const circle = document.querySelector(".progress-ring-circle");
  const text = document.getElementById("scoreText");
  const circumference = 2 * Math.PI * 52;
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  const offset = circumference - (score / 100) * circumference;
  setTimeout(() => {
    circle.style.strokeDashoffset = offset;
    text.textContent = score;
    applyGradientColors();
  }, 100);
}

function updateHashtags(keywords) {
  const hashtagList = document.getElementById("hashtagList");
  if (!keywords.length) {
    hashtagList.innerHTML =
      '<p style="text-align:center;color:rgba(245,245,245,0.7);width:100%;">کلمات کلیدی یافت نشد</p>';
    return;
  }
  hashtagList.innerHTML = keywords
    .slice(0, 5)
    .map(
      (kw) =>
        `<div class="hashtag-item" onclick="copyToClipboard('#${kw[0]}', this)">#${kw[0]}</div>`
    )
    .join("");
  applyGradientColors();
}

function updateDensityChart(keywordDensities) {
  const canvas = document.getElementById("densityChart");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = 250;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!keywordDensities.length) return;
  const barWidth = canvas.width / keywordDensities.length - 20;
  const maxDensity = Math.max(...keywordDensities.map((k) => k.density));
  keywordDensities.forEach((kw, i) => {
    const height = (kw.density / maxDensity) * 180;
    const x = i * (barWidth + 20) + 20;
    const y = canvas.height - height - 40;
    ctx.fillStyle = kw.color;
    ctx.fillRect(x, y, barWidth, height);
    ctx.fillStyle = "#f5f5f5";
    ctx.font = "12px Vazir, Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText(kw.word, x + barWidth / 2, canvas.height - 25);
    ctx.fillText(kw.density + "%", x + barWidth / 2, y - 5);
  });
  applyGradientColors();
}

function compareTexts() {
  const text1 = document.getElementById("textInput1").value.trim();
  const text2 = document.getElementById("textInput2").value.trim();
  if (!text1 || !text2) {
    alert("⚠️ لطفاً هر دو متن را وارد کنید!");
    return;
  }
  try {
    const comparison = analyzer.compare(text1, text2);
    displayComparisonResults(comparison);
    applyGradientColors();
  } catch (error) {
    alert("خطا در مقایسه متن‌ها: " + error.message);
  }
}

function displayComparisonResults(comparison) {
  const data1 = comparison.text1,
    data2 = comparison.text2;
  const compareResults = document.getElementById("compareResults");
  compareResults.innerHTML = `
    <div class="result-card liquid-glass">
      <h3 style="text-align:center;margin-bottom:20px;">⚖️ نتایج مقایسه</h3>
      <table class="comparison-table">
        <thead>
          <tr><th>معیار</th><th>متن اول</th><th>متن دوم</th></tr>
        </thead>
        <tbody>
          <tr><td>تعداد کلمات</td><td>${data1.wordCount}</td><td>${data2.wordCount}</td></tr>
          <tr><td>تعداد کاراکتر</td><td>${data1.charCount}</td><td>${data2.charCount}</td></tr>
          <tr><td>تعداد جملات</td><td>${data1.sentenceCount}</td><td>${data2.sentenceCount}</td></tr>
          <tr><td>میانگین کلمات/جمله</td><td>${data1.avgWordsPerSentence}</td><td>${data2.avgWordsPerSentence}</td></tr>
          <tr><td>امتیاز SEO</td><td>${data1.score}/100</td><td>${data2.score}/100</td></tr>
          <tr><td>خوانایی</td><td>${data1.readability.level}</td><td>${data2.readability.level}</td></tr>
        </tbody>
      </table>
    </div>
  `;
  compareResults.classList.add("show");
  applyGradientColors();
}

function saveToHistory(data) {
  let history = JSON.parse(localStorage.getItem("seoHistory") || "[]");
  let scoreClass =
    data.score >= 70
      ? "score-excellent"
      : data.score >= 40
      ? "score-good"
      : "score-poor";
  history.unshift({
    text: data.seoTitle.substring(0, 100),
    wordCount: data.wordCount,
    charCount: data.charCount,
    score: data.score,
    scoreClass: scoreClass,
    date: new Date().toLocaleString("fa-IR"),
    id: Date.now(),
  });
  history = history.slice(0, 10);
  localStorage.setItem("seoHistory", JSON.stringify(history));
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("seoHistory") || "[]");
  const historyList = document.getElementById("historyList");
  if (!history.length) {
    historyList.innerHTML =
      '<div class="result-card liquid-glass"><p style="text-align:center;color:rgba(245,245,245,0.7);">هنوز تحلیلی ذخیره نشده است</p></div>';
    return;
  }
  historyList.innerHTML = history
    .map(
      (item) => `
    <div class="result-card liquid-glass">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <span style="font-size:12px;color:rgba(245,245,245,0.6);">${item.date}</span>
        <span class="score-value ${item.scoreClass}" style="font-size:20px;">${item.score}/100</span>
      </div>
      <p style="font-size:14px;">${item.text}...</p>
      <div style="margin-top:10px;">
        <span style="font-size:12px;color:rgba(245,245,245,0.7);">کلمات: ${item.wordCount} | کاراکتر: ${item.charCount}</span>
      </div>
    </div>
  `
    )
    .join("");
  applyGradientColors();
}

function exportToPDF() {
  if (!currentAnalysisData) {
    alert("⚠️ ابتدا یک متن را تحلیل کنید!");
    return;
  }
  const content = `
SEO Analysis Report - گزارش تحلیل SEO
=========================================
تاریخ: ${new Date().toLocaleString("fa-IR")}
زبان: ${currentAnalysisData.language}
آمار کلی:
- تعداد کلمات: ${currentAnalysisData.wordCount}
- تعداد کاراکتر: ${currentAnalysisData.charCount}
- کلمات منحصر به فرد: ${currentAnalysisData.uniqueWords}
- تعداد جملات: ${currentAnalysisData.sentenceCount}
- میانگین کلمات در جمله: ${currentAnalysisData.avgWordsPerSentence}
خوانایی: ${currentAnalysisData.readability.level}
امتیاز SEO: ${currentAnalysisData.score}/100
عنوان پیشنهادی:
${currentAnalysisData.seoTitle}
توضیحات متا پیشنهادی:
${currentAnalysisData.metaDescription}
کلمات کلیدی برتر:
${currentAnalysisData.keywords
  .map((k) => `- ${k[0]} (تکرار: ${k[1]} بار)`)
  .join("\n")}
تراکم کلمات کلیدی:
${currentAnalysisData.keywordDensities
  .map((k) => `- ${k.word}: ${k.density}% (${k.status})`)
  .join("\n")}
پیشنهادات بهبود:
${currentAnalysisData.suggestions
  .map((s, i) => `${i + 1}. ${s.title}\n   ${s.text}`)
  .join("\n\n")}
  `;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `seo-report-${Date.now()}.txt`;
  a.click();
  showExportMessage();
  applyGradientColors();
}

function exportToJSON() {
  if (!currentAnalysisData) {
    alert("⚠️ ابتدا یک متن را تحلیل کنید!");
    return;
  }
  const blob = new Blob([JSON.stringify(currentAnalysisData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `seo-analysis-${Date.now()}.json`;
  a.click();
  showExportMessage();
  applyGradientColors();
}

function exportToCSV() {
  if (!currentAnalysisData) {
    alert("⚠️ ابتدا یک متن را تحلیل کنید!");
    return;
  }
  const csv = `معیار,مقدار
تعداد کلمات,${currentAnalysisData.wordCount}
تعداد کاراکتر,${currentAnalysisData.charCount}
کلمات منحصر,${currentAnalysisData.uniqueWords}
تعداد جملات,${currentAnalysisData.sentenceCount}
میانگین کلمات/جمله,${currentAnalysisData.avgWordsPerSentence}
امتیاز SEO,${currentAnalysisData.score}
زبان,${currentAnalysisData.language}
خوانایی,${currentAnalysisData.readability.level}
`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `seo-data-${Date.now()}.csv`;
  a.click();
  showExportMessage();
  applyGradientColors();
}

function copyAllResults() {
  if (!currentAnalysisData) {
    alert("⚠️ ابتدا یک متن را تحلیل کنید!");
    return;
  }
  const text = `
امتیاز SEO: ${currentAnalysisData.score}/100
تعداد کلمات: ${currentAnalysisData.wordCount}
تعداد کاراکتر: ${currentAnalysisData.charCount}
زبان: ${currentAnalysisData.language}
خوانایی: ${currentAnalysisData.readability.level}
عنوان پیشنهادی:
${currentAnalysisData.seoTitle}
توضیحات متا:
${currentAnalysisData.metaDescription}
کلمات کلیدی:
${currentAnalysisData.keywords.map((k) => `${k[0]} (${k[1]})`).join(", ")}
  `;
  navigator.clipboard.writeText(text).then(showExportMessage);
  applyGradientColors();
}

function copyToClipboard(text, button) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = button.innerHTML;
    button.innerHTML = "✓ کپی شد";
    setTimeout(() => {
      button.innerHTML = originalText;
    }, 2000);
  });
  applyGradientColors();
}

function showExportMessage() {
  const msg = document.getElementById("exportMessage");
  msg.style.display = "block";
  setTimeout(() => {
    msg.style.display = "none";
  }, 3000);
  applyGradientColors();
}

function toggleTheme() {
  document.body.classList.toggle("light-theme");
  const sunIcon = document.getElementById("theme-icon-sun");
  const moonIcon = document.getElementById("theme-icon-moon");
  if (document.body.classList.contains("light-theme")) {
    sunIcon.style.display = "block";
    moonIcon.style.display = "none";
    localStorage.setItem("theme", "light");
  } else {
    sunIcon.style.display = "none";
    moonIcon.style.display = "block";
    localStorage.setItem("theme", "dark");
  }
  applyGradientColors();
}

function clearAll() {
  document.getElementById("textInput").value = "";
  document.getElementById("results").innerHTML = "";
  document.getElementById("results").classList.remove("show");
  document.getElementById("clearBtn").style.display = "none";
  currentAnalysisData = null;
  document.getElementById("wordCloud").innerHTML =
    '<p style="text-align:center;color:rgba(245,245,245,0.7);">ابتدا یک متن را تحلیل کنید</p>';
  document.getElementById("hashtagList").innerHTML =
    '<p style="text-align:center;color:rgba(245,245,245,0.7);width:100%;">ابتدا یک متن را تحلیل کنید</p>';
  document.getElementById("scoreText").textContent = "0";
  applyGradientColors();
}

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    document.getElementById("theme-icon-sun").style.display = "block";
    document.getElementById("theme-icon-moon").style.display = "none";
  }
  applyGradientColors();
});

function applyGradientColors() {
  if (
    document.getElementById("settingsBg1") &&
    document.getElementById("settingsBg2") &&
    document.getElementById("settingsCard1") &&
    document.getElementById("settingsCard2") &&
    document.getElementById("settingsBtn1") &&
    document.getElementById("settingsBtn2") &&
    document.getElementById("settingsFont") &&
    document.getElementById("settingsHeader")
  ) {
    const bg1 = document.getElementById("settingsBg1").value;
    const bg2 = document.getElementById("settingsBg2").value;
    const card1 = document.getElementById("settingsCard1").value;
    const card2 = document.getElementById("settingsCard2").value;
    const btn1 = document.getElementById("settingsBtn1").value;
    const btn2 = document.getElementById("settingsBtn2").value;
    const font = document.getElementById("settingsFont").value;
    const header = document.getElementById("settingsHeader").value;

    const bgVal =
      bg1 && bg2 && bg1 !== bg2
        ? `linear-gradient(135deg,${bg1},${bg2})`
        : bg1 || "#0a0a0a";
    const cardVal =
      card1 && card2 && card1 !== card2
        ? `linear-gradient(135deg,${card1},${card2})`
        : card1 || "#1a5f4a";
    const btnVal =
      btn1 && btn2 && btn1 !== btn2
        ? `linear-gradient(90deg,${btn1},${btn2})`
        : btn1 || "#2ecc71";

    document.documentElement.style.setProperty("--bg", bgVal);
    document.documentElement.style.setProperty("--card", cardVal);
    document.documentElement.style.setProperty("--btn", btnVal);
    document.documentElement.style.setProperty("--font", font || "#f5f5f5");
    document.documentElement.style.setProperty("--header", header || "#f5f5f5");
  }
}
