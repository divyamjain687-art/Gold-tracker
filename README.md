# 🪙 Gold Tracker - India Gold & Silver Live Rate Web Application

A modern, fast, accessible web application designed to track live **Gold (24K, 22K, 18K)** and **Silver** prices across major cities in India with **GPS Auto-Location**, **10 Indian Regional Languages**, **Instant Unit Calculator**, **Dark/Light Theme Switcher**, and **Interactive Price Trend Graphs**.

---

## ✨ Features

- 📈 **Live Market Rates (IBJA Aligned)**: Real-time live market updates for 24K, 22K, 18K Gold and 999 Fine Silver, calibrated with official Indian bullion rates.
- 📍 **GPS Geolocation Auto-Detection**: Uses HTML5 Geolocation API with Haversine distance calculations to automatically detect your nearest city/state in India.
- 🗣️ **10 Indian Languages**: Native localization in **English, Hindi (हिंदी), Tamil (தமிழ்), Telugu (తెలుగు), Bengali (বাংলা), Marathi (मराठी), Gujarati (ગુજરાતી), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), and Punjabi (ਪੰਜਾਬੀ)**.
- 🧮 **Instant Price & GST Calculator**: Calculate exact purchase costs for custom weights (grams, Tola, 10g, 100g, 1kg) including **3% GST** and **10% Making Charges**.
- 🌓 **Dark & Light Mode Switcher**: Smooth theme transitions with local storage persistence.
- 📊 **Interactive Trend Charts**: 7-Day, 30-Day, and 1-Year historical price trends powered by Chart.js.
- 🔐 **Sign In / Account Modal**: User session state management and price alert preferences.
- 📲 **WhatsApp Share Button**: Easily share today's local rates with friends and family in one click.

---

## 📂 Project Structure

```text
GoldTracker/
├── index.html               # Main single-page web app interface
├── server.py                 # Python HTTP server & live rate API (/api/live-rates)
├── Start_Gold_Tracker.bat    # Windows double-click launcher
├── css/
│   └── styles.css            # Responsive styles & theme definitions
└── js/
    ├── app.js                # App logic, GPS location, theme toggle & calculator
    ├── data.js               # City coordinates & benchmark price datasets
    └── i18n.js               # Translation dictionary for 10 Indian languages
```

---

## 🚀 Quick Start / Local Setup

### Prerequisites
- Python 3.8+ (No external pip dependencies required!)

### Running the Server

1. Open your terminal in the project directory:
   ```bash
   cd GoldTracker
   ```

2. Start the local server:
   ```bash
   python server.py
   ```

3. Open your browser at:
   👉 **[http://localhost:5000](http://localhost:5000)**

*(On Windows, you can simply double-click `Start_Gold_Tracker.bat` to launch the server and open the browser automatically).*

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
