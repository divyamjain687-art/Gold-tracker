// Main Application Logic with Live API, Theme Switcher & Authentication
document.addEventListener("DOMContentLoaded", () => {
  let currentLang = localStorage.getItem("userLang") || "en";
  let currentTheme = localStorage.getItem("userTheme") || "dark";
  let currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  let selectedCityData = cityRates[0]; // Default to Mumbai
  let trendChartInstance = null;

  // DOM Elements
  const langSelect = document.getElementById("langSelect");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const themeIcon = document.getElementById("themeIcon");
  const themeText = document.getElementById("themeText");
  const citySelect = document.getElementById("citySelect");
  const gpsBtn = document.getElementById("gpsBtn");
  const refreshRatesBtn = document.getElementById("refreshRatesBtn");
  const gpsStatus = document.getElementById("gpsStatus");
  const searchCity = document.getElementById("searchCity");
  const cityTableBody = document.getElementById("cityTableBody");
  const whatsappShareBtn = document.getElementById("whatsappShareBtn");

  // Calculator DOM Elements
  const calcWeight = document.getElementById("calcWeight");
  const calcUnit = document.getElementById("calcUnit");
  const calcMetal = document.getElementById("calcMetal");
  const calcGst = document.getElementById("calcGst");
  const calcMaking = document.getElementById("calcMaking");
  const calcTotalVal = document.getElementById("calcTotalVal");

  // Auth DOM Elements
  const authContainer = document.getElementById("authContainer");
  const authModal = document.getElementById("authModal");
  const openAuthBtn = document.getElementById("openAuthBtn");
  const closeAuthBtn = document.getElementById("closeAuthBtn");
  const tabSignIn = document.getElementById("tabSignIn");
  const tabSignUp = document.getElementById("tabSignUp");
  const signInForm = document.getElementById("signInForm");
  const signUpForm = document.getElementById("signUpForm");

  // Initialize Theme
  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("userTheme", theme);
    const langDict = translations[currentLang] || translations.en;

    if (theme === "light") {
      themeIcon.className = "fa-solid fa-moon";
      themeText.textContent = langDict.themeDark || "Dark Mode";
    } else {
      themeIcon.className = "fa-solid fa-sun";
      themeText.textContent = langDict.themeLight || "Light Mode";
    }

    if (trendChartInstance) {
      initChart(document.querySelector(".chart-btn.active")?.getAttribute("data-period") || "7d");
    }
  }

  themeToggleBtn.addEventListener("click", () => {
    applyTheme(currentTheme === "dark" ? "light" : "dark");
  });

  // Fetch Live Rates from Backend API
  async function fetchLiveRates() {
    try {
      refreshRatesBtn.querySelector("i").classList.add("fa-spin");
      const response = await fetch("/api/live-rates");
      const resData = await response.json();

      if (resData && resData.success && resData.cities) {
        resData.cities.forEach(liveCity => {
          const match = cityRates.find(c => c.city === liveCity.city);
          if (match) {
            match.gold24k = liveCity.gold24k;
            match.gold22k = liveCity.gold22k;
            match.gold18k = liveCity.gold18k;
            match.silver = liveCity.silver;
            if (liveCity.change24h !== undefined) match.change24h = liveCity.change24h;
          }
        });

        if (resData.officialDate) {
          const sessionEl = document.getElementById("ibjaSessionDate");
          if (sessionEl) {
            sessionEl.innerHTML = `<i class="fa-regular fa-clock"></i> <span>Session: ${resData.officialDate}</span>`;
          }
        }

        // Update selected city ref
        const updatedSelected = cityRates.find(c => c.city === selectedCityData.city);
        if (updatedSelected) selectedCityData = updatedSelected;

        const langDict = translations[currentLang] || translations.en;
        gpsStatus.textContent = `${langDict.lastUpdated || 'Last Updated:'} ${resData.updatedAt}`;
        gpsStatus.style.color = "var(--accent-green)";

        updateRateCards();
        updateCalculator();
        renderCityTable(searchCity.value);
      }
    } catch (err) {
      console.warn("Live rate sync notice:", err);
    } finally {
      setTimeout(() => refreshRatesBtn.querySelector("i").classList.remove("fa-spin"), 500);
    }
  }

  refreshRatesBtn.addEventListener("click", fetchLiveRates);

  // User Auth UI Updates
  function updateAuthUI() {
    const langDict = translations[currentLang] || translations.en;
    authContainer.innerHTML = "";

    if (currentUser) {
      const userBadge = document.createElement("div");
      userBadge.className = "user-badge";
      userBadge.innerHTML = `
        <i class="fa-solid fa-user-circle"></i>
        <span>${currentUser.name || currentUser.email}</span>
        <button id="signOutBtn" class="sign-out-btn" title="Sign Out">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      `;
      authContainer.appendChild(userBadge);

      document.getElementById("signOutBtn").addEventListener("click", () => {
        currentUser = null;
        localStorage.removeItem("currentUser");
        updateAuthUI();
      });
    } else {
      const btn = document.createElement("button");
      btn.className = "auth-btn";
      btn.innerHTML = `<i class="fa-solid fa-user"></i> <span>${langDict.signInBtn || 'Sign In'}</span>`;
      btn.addEventListener("click", () => authModal.classList.add("active"));
      authContainer.appendChild(btn);
    }
  }

  // Auth Modal Handlers
  openAuthBtn?.addEventListener("click", () => authModal.classList.add("active"));
  closeAuthBtn?.addEventListener("click", () => authModal.classList.remove("active"));
  authModal.addEventListener("click", (e) => {
    if (e.target === authModal) authModal.classList.remove("active");
  });

  tabSignIn.addEventListener("click", () => {
    tabSignIn.classList.add("active");
    tabSignUp.classList.remove("active");
    signInForm.style.display = "flex";
    signUpForm.style.display = "none";
  });

  tabSignUp.addEventListener("click", () => {
    tabSignUp.classList.add("active");
    tabSignIn.classList.remove("active");
    signUpForm.style.display = "flex";
    signInForm.style.display = "none";
  });

  signInForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("signInEmail").value;
    currentUser = { name: email.split("@")[0], email: email };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    authModal.classList.remove("active");
    updateAuthUI();
  });

  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("signUpName").value;
    const email = document.getElementById("signUpEmail").value;
    currentUser = { name: name, email: email };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    authModal.classList.remove("active");
    updateAuthUI();
  });

  // Populate City Select Dropdown
  function populateCities() {
    citySelect.innerHTML = "";
    cityRates.forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item.city;
      opt.textContent = `${item.city} (${item.state})`;
      if (item.city === selectedCityData.city) opt.selected = true;
      citySelect.appendChild(opt);
    });
  }

  // Translate Entire UI
  function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("userLang", lang);
    const langDict = translations[lang] || translations.en;

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (langDict[key]) {
        if (el.tagName === "INPUT" && el.placeholder) {
          el.placeholder = langDict[key];
        } else {
          el.textContent = langDict[key];
        }
      }
    });

    langSelect.value = lang;
    applyTheme(currentTheme);
    updateAuthUI();
    updateRateCards();
    updateCalculator();
    renderCityTable();
    updateWhatsAppLink();
  }

  // Update Rate Cards for Selected City
  function updateRateCards() {
    if (!selectedCityData) return;

    // 24K Gold
    document.getElementById("priceGold24k").textContent = `₹${selectedCityData.gold24k.toLocaleString("en-IN")}`;
    document.getElementById("gold24kGram").textContent = `₹${Math.round(selectedCityData.gold24k / 10).toLocaleString("en-IN")}`;

    // 22K Gold
    document.getElementById("priceGold22k").textContent = `₹${selectedCityData.gold22k.toLocaleString("en-IN")}`;
    document.getElementById("gold22kGram").textContent = `₹${Math.round(selectedCityData.gold22k / 10).toLocaleString("en-IN")}`;

    // 18K Gold
    document.getElementById("priceGold18k").textContent = `₹${selectedCityData.gold18k.toLocaleString("en-IN")}`;
    document.getElementById("gold18kGram").textContent = `₹${Math.round(selectedCityData.gold18k / 10).toLocaleString("en-IN")}`;

    // Silver
    document.getElementById("priceSilver").textContent = `₹${selectedCityData.silver.toLocaleString("en-IN")}`;
    document.getElementById("silver10g").textContent = `₹${Math.round(selectedCityData.silver / 100).toLocaleString("en-IN")}`;

    // Update 24h Change Badges
    const change24 = selectedCityData.change24h !== undefined ? selectedCityData.change24h : -1.60;
    const isUp = change24 >= 0;
    const changeText = `${isUp ? '+' : ''}${change24}% (24h IBJA)`;

    ["gold24kChange", "gold22kChange", "gold18kChange", "silverChange"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = changeText;
        el.parentElement.className = `price-change ${isUp ? 'up' : 'down'}`;
        const icon = el.previousElementSibling;
        if (icon) icon.className = `fa-solid fa-arrow-trend-${isUp ? 'up' : 'down'}`;
      }
    });

    updateWhatsAppLink();
  }

  // Calculate Total Cost in Calculator
  function updateCalculator() {
    const weight = parseFloat(calcWeight.value) || 0;
    const unitMultipliers = {
      gram: 1,
      tola: 8,
      tenGrams: 10,
      hundredGrams: 100,
      kg: 1000
    };

    const multiplier = unitMultipliers[calcUnit.value] || 1;
    const totalWeightGrams = weight * multiplier;

    let baseRatePerGram = 0;
    if (calcMetal.value === "gold24k") baseRatePerGram = selectedCityData.gold24k / 10;
    else if (calcMetal.value === "gold22k") baseRatePerGram = selectedCityData.gold22k / 10;
    else if (calcMetal.value === "gold18k") baseRatePerGram = selectedCityData.gold18k / 10;
    else if (calcMetal.value === "silver") baseRatePerGram = selectedCityData.silver / 1000;

    let basePrice = totalWeightGrams * baseRatePerGram;

    if (calcMaking.checked) basePrice += basePrice * 0.10;
    if (calcGst.checked) basePrice += basePrice * 0.03;

    calcTotalVal.textContent = `₹${Math.round(basePrice).toLocaleString("en-IN")}`;
  }

  // Render City Comparison Table
  function renderCityTable(filterText = "") {
    cityTableBody.innerHTML = "";
    const filter = filterText.toLowerCase();

    cityRates.forEach(item => {
      if (item.city.toLowerCase().includes(filter) || item.state.toLowerCase().includes(filter)) {
        const tr = document.createElement("tr");
        if (item.city === selectedCityData.city) {
          tr.className = "highlight-row";
        }

        tr.innerHTML = `
          <td><strong>${item.city}</strong> <br><small style="color:var(--text-muted);">${item.state}</small></td>
          <td style="color:var(--primary-gold); font-weight:700;">₹${item.gold24k.toLocaleString("en-IN")}</td>
          <td>₹${item.gold22k.toLocaleString("en-IN")}</td>
          <td>₹${item.silver.toLocaleString("en-IN")}</td>
        `;

        tr.addEventListener("click", () => {
          selectedCityData = item;
          citySelect.value = item.city;
          updateRateCards();
          updateCalculator();
          renderCityTable(searchCity.value);
        });

        cityTableBody.appendChild(tr);
      }
    });
  }

  // GPS Geolocation Detector
  gpsBtn.addEventListener("click", () => {
    const langDict = translations[currentLang] || translations.en;
    if (!navigator.geolocation) {
      gpsStatus.textContent = langDict.locationError;
      gpsStatus.style.color = "var(--accent-red)";
      return;
    }

    gpsStatus.textContent = langDict.detectingLocation;
    gpsStatus.style.color = "var(--primary-gold)";

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const result = getClosestCity(latitude, longitude);
        selectedCityData = result.cityData;

        citySelect.value = selectedCityData.city;
        gpsStatus.textContent = `${langDict.locationDetected} ${selectedCityData.city}, ${selectedCityData.state} (~${result.distanceKm} km away)`;
        gpsStatus.style.color = "var(--accent-green)";

        updateRateCards();
        updateCalculator();
        renderCityTable();
      },
      (error) => {
        console.warn("GPS Error:", error);
        gpsStatus.textContent = langDict.locationError;
        gpsStatus.style.color = "var(--accent-red)";
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });

  // Chart.js Price Trend Graph
  function initChart(period = "7d") {
    const ctx = document.getElementById("trendChart").getContext("2d");
    const dataObj = trendData[period] || trendData["7d"];
    const isLight = currentTheme === "light";
    const labelColor = isLight ? "#0f172a" : "#f8fafc";
    const gridColor = isLight ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.05)";

    if (trendChartInstance) {
      trendChartInstance.destroy();
    }

    trendChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: dataObj.labels,
        datasets: [
          {
            label: "24K Gold (10g)",
            data: dataObj.gold24k,
            borderColor: "#D4AF37",
            backgroundColor: "rgba(212, 175, 55, 0.15)",
            borderWidth: 3,
            fill: true,
            tension: 0.3
          },
          {
            label: "22K Gold (10g)",
            data: dataObj.gold22k,
            borderColor: "#E6C200",
            borderWidth: 2,
            tension: 0.3
          },
          {
            label: "Silver (1kg / 10)",
            data: dataObj.silver.map(v => v / 10),
            borderColor: isLight ? "#64748b" : "#BDBDBD",
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: labelColor }
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: labelColor }
          },
          y: {
            grid: { color: gridColor },
            ticks: { color: labelColor }
          }
        }
      }
    });
  }

  // Update WhatsApp Share Link
  function updateWhatsAppLink() {
    const message = encodeURIComponent(
      `🇮🇳 *Gold Tracker Update (${selectedCityData.city})*\n\n` +
      `• 24K Gold (10g): ₹${selectedCityData.gold24k.toLocaleString("en-IN")}\n` +
      `• 22K Gold (10g): ₹${selectedCityData.gold22k.toLocaleString("en-IN")}\n` +
      `• Silver (1 kg): ₹${selectedCityData.silver.toLocaleString("en-IN")}\n\n` +
      `Check live rates & calculate cost on Gold Tracker!`
    );
    whatsappShareBtn.href = `https://api.whatsapp.com/send?text=${message}`;
  }

  // Event Listeners
  langSelect.addEventListener("change", (e) => updateLanguage(e.target.value));
  citySelect.addEventListener("change", (e) => {
    const found = cityRates.find(c => c.city === e.target.value);
    if (found) {
      selectedCityData = found;
      updateRateCards();
      updateCalculator();
      renderCityTable(searchCity.value);
    }
  });

  [calcWeight, calcUnit, calcMetal, calcGst, calcMaking].forEach(input => {
    input.addEventListener("input", updateCalculator);
    input.addEventListener("change", updateCalculator);
  });

  searchCity.addEventListener("input", (e) => renderCityTable(e.target.value));

  document.querySelectorAll(".chart-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".chart-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      initChart(e.target.getAttribute("data-period"));
    });
  });

  // Initial Boot
  populateCities();
  updateLanguage(currentLang);
  initChart("7d");
  fetchLiveRates();

  // Auto Refresh Live API every 30 seconds
  setInterval(fetchLiveRates, 30000);
});
