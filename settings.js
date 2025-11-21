function toggleSiteSettings() {
  const panel = document.getElementById("siteSettingsPanel");
  const backdrop = document.getElementById("settingsBackdrop");
  const isOpen = panel.classList.contains("active");
  if (isOpen) {
    panel.classList.remove("active");
    backdrop.style.display = "none";
  } else {
    panel.classList.add("active");
    backdrop.style.display = "block";
  }
}

window.addEventListener("DOMContentLoaded", function () {
  const def = {
    bg: "#0a0a0a",
    card: "#1a5f4a",
    btn: "#2ecc71",
    font: "#f5f5f5",
    header: "#f5f5f5",
  };
  ["bg", "card", "btn", "font", "header"].forEach((key) => {
    const val = localStorage.getItem("user-setting-" + key) || def[key];
    document.getElementById(
      "settings" + key.charAt(0).toUpperCase() + key.slice(1)
    ).value = val;
    document.documentElement.style.setProperty("--" + key, val);
  });
});

function saveSiteSettings() {
  localStorage.setItem(
    "user-setting-bg",
    document.getElementById("settingsBg").value
  );
  localStorage.setItem(
    "user-setting-card",
    document.getElementById("settingsCard").value
  );
  localStorage.setItem(
    "user-setting-btn",
    document.getElementById("settingsBtn").value
  );
  localStorage.setItem(
    "user-setting-font",
    document.getElementById("settingsFont").value
  );
  localStorage.setItem(
    "user-setting-header",
    document.getElementById("settingsHeader").value
  );

  document.documentElement.style.setProperty(
    "--bg",
    document.getElementById("settingsBg").value
  );
  document.documentElement.style.setProperty(
    "--card",
    document.getElementById("settingsCard").value
  );
  document.documentElement.style.setProperty(
    "--btn",
    document.getElementById("settingsBtn").value
  );
  document.documentElement.style.setProperty(
    "--font",
    document.getElementById("settingsFont").value
  );
  document.documentElement.style.setProperty(
    "--header",
    document.getElementById("settingsHeader").value
  );

  alert("تنظیمات ذخیره شد و فوراً اعمال شد!");
  toggleSiteSettings();
}

function resetSiteSettings() {
  const def = {
    bg: "#0a0a0a",
    card: "#1a5f4a",
    btn: "#2ecc71",
    font: "#f5f5f5",
    header: "#f5f5f5",
  };
  ["bg", "card", "btn", "font", "header"].forEach((key) => {
    localStorage.removeItem("user-setting-" + key);
    document.getElementById(
      "settings" + key.charAt(0).toUpperCase() + key.slice(1)
    ).value = def[key];
    document.documentElement.style.setProperty("--" + key, def[key]);
  });
}
