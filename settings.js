function toggleSiteSettings() {
  var panel = document.getElementById("siteSettingsPanel");
  var backdrop = document.getElementById("settingsBackdrop");
  var isOpen = panel.classList.contains("active");
  if (isOpen) {
    panel.classList.remove("active");
    backdrop.style.display = "none";
  } else {
    panel.classList.add("active");
    backdrop.style.display = "block";
    updateAllColorPreviews();
  }
}
function applyGradientColors() {
  var bg1 = document.getElementById("settingsBg1").value,
    bg2 = document.getElementById("settingsBg2").value,
    card1 = document.getElementById("settingsCard1").value,
    card2 = document.getElementById("settingsCard2").value,
    btn1 = document.getElementById("settingsBtn1").value,
    btn2 = document.getElementById("settingsBtn2").value,
    font = document.getElementById("settingsFont").value,
    header = document.getElementById("settingsHeader").value;

  var bgVal =
    bg1 && bg2 && bg1 !== bg2
      ? "linear-gradient(135deg," + bg1 + "," + bg2 + ")"
      : bg1;
  var cardVal =
    card1 && card2 && card1 !== card2
      ? "linear-gradient(135deg," + card1 + "," + card2 + ")"
      : card1;
  var btnVal =
    btn1 && btn2 && btn1 !== btn2
      ? "linear-gradient(90deg," + btn1 + "," + btn2 + ")"
      : btn1;

  document.documentElement.style.setProperty("--bg", bgVal);
  document.documentElement.style.setProperty("--card", cardVal);
  document.documentElement.style.setProperty("--btn", btnVal);
  document.documentElement.style.setProperty("--font", font);
  document.documentElement.style.setProperty("--header", header);

  document.getElementById("bgPreview").style.background = bgVal;
  document.getElementById("cardPreview").style.background = cardVal;
  document.getElementById("btnPreview").style.background = btnVal;
  document.getElementById("fontPreview").style.background = font;
  document.getElementById("headerPreview").style.background = header;
}
function updateAllColorPreviews() {
  applyGradientColors();
}
window.addEventListener("DOMContentLoaded", function () {
  var def = {
    bg1: "#0a0a0a",
    bg2: "#1a1a1a",
    card1: "#1a5f4a",
    card2: "#0a0a0a",
    btn1: "#2ecc71",
    btn2: "#27ae60",
    font: "#f5f5f5",
    header: "#f5f5f5",
  };
  ["bg1", "bg2", "card1", "card2", "btn1", "btn2"].forEach(function (key) {
    var val = localStorage.getItem("user-setting-" + key) || def[key];
    document.getElementById(
      "settings" + key.charAt(0).toUpperCase() + key.slice(1)
    ).value = val;
  });
  document.getElementById("settingsFont").value =
    localStorage.getItem("user-setting-font") || def.font;
  document.getElementById("settingsHeader").value =
    localStorage.getItem("user-setting-header") || def.header;
  applyGradientColors();
  updateAllColorPreviews();
});
document.getElementById("saveBtn").onclick = function () {
  ["bg1", "bg2", "card1", "card2", "btn1", "btn2"].forEach(function (key) {
    localStorage.setItem(
      "user-setting-" + key,
      document.getElementById(
        "settings" + key.charAt(0).toUpperCase() + key.slice(1)
      ).value
    );
  });
  localStorage.setItem(
    "user-setting-font",
    document.getElementById("settingsFont").value
  );
  localStorage.setItem(
    "user-setting-header",
    document.getElementById("settingsHeader").value
  );
  applyGradientColors();
  toggleSiteSettings();
};
document.getElementById("resetBtn").onclick = function () {
  var def = {
    bg1: "#0a0a0a",
    bg2: "#1a1a1a",
    card1: "#1a5f4a",
    card2: "#0a0a0a",
    btn1: "#2ecc71",
    btn2: "#27ae60",
    font: "#f5f5f5",
    header: "#f5f5f5",
  };
  ["bg1", "bg2", "card1", "card2", "btn1", "btn2"].forEach(function (key) {
    localStorage.removeItem("user-setting-" + key);
    document.getElementById(
      "settings" + key.charAt(0).toUpperCase() + key.slice(1)
    ).value = def[key];
  });
  document.getElementById("settingsFont").value = def.font;
  document.getElementById("settingsHeader").value = def.header;
  applyGradientColors();
  updateAllColorPreviews();
};
document.getElementById("closeBtn").onclick = function () {
  toggleSiteSettings();
};
[
  "settingsBg1",
  "settingsBg2",
  "settingsCard1",
  "settingsCard2",
  "settingsBtn1",
  "settingsBtn2",
  "settingsFont",
  "settingsHeader",
].forEach(function (id) {
  if (document.getElementById(id)) {
    document
      .getElementById(id)
      .addEventListener("input", updateAllColorPreviews);
  }
});
