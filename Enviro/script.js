// Replace with your OpenWeatherMap API key
const OWM_API_KEY = "bc845fab908750ed676612c8b56963d3";

// Helper: AQI categories (US EPA style)
function getCategoryFromAQI(aqi) {
  if (aqi == null) return "N/A";
  if (aqi <= 50) return "Good 😊";
  if (aqi <= 100) return "Moderate 😐";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups 😷";
  if (aqi <= 200) return "Unhealthy 🤒";
  if (aqi <= 300) return "Very Unhealthy 😫";
  return "Hazardous ☠️";
}

async function getAirQuality() {
  const city = document.getElementById("aq-city").value;
  const result = document.getElementById("aq-result");

  try {
    // 1. Get coordinates (common for both APIs)
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      result.innerText = "City not found.";
      return;
    }

    const { latitude, longitude } = geoData.results[0];

    // 2. Try Open-Meteo Air Quality API
    try {
      const aqRes = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=pm2_5,pm10,o3,european_aqi`
      );
      const aqData = await aqRes.json();

      if (aqData.hourly && aqData.hourly.european_aqi) {
        const pm25 = aqData.hourly.pm2_5?.[0] ?? null;
        const pm10 = aqData.hourly.pm10?.[0] ?? null;
        const o3   = aqData.hourly.o3?.[0] ?? null;
        const aqi  = aqData.hourly.european_aqi?.[0] ?? null;

        const aqiCat = getCategoryFromAQI(aqi);

        result.innerHTML = `
          <p><strong>AQI (European):</strong> ${aqi ?? "N/A"} — <em>${aqiCat}</em></p>
          <p><strong>PM2.5:</strong> ${pm25 ?? "N/A"} µg/m³</p>
          <p><strong>PM10:</strong> ${pm10 ?? "N/A"} µg/m³</p>
          <p><strong>O₃:</strong> ${o3 ?? "N/A"} µg/m³</p>
        `;
        return; // ✅ success, stop here
      }
    } catch (err) {
      console.warn("Open-Meteo failed:", err);
    }

    // 3. Fallback → OpenWeatherMap API
    try {
      const owmRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${OWM_API_KEY}`
      );
      const owmData = await owmRes.json();

      if (owmData.list && owmData.list.length > 0) {
        const data = owmData.list[0];
        const aqiIndex = data.main.aqi; // 1 to 5
        const components = data.components;

        const aqiCategories = {
          1: "Good 😊",
          2: "Fair 🙂",
          3: "Moderate 😐",
          4: "Poor 😷",
          5: "Very Poor ☠️"
        };

        result.innerHTML = `
          <p><strong>AQI (OWM):</strong> ${aqiIndex} — <em>${aqiCategories[aqiIndex]}</em></p>
          <p><strong>PM2.5:</strong> ${components.pm2_5 ?? "N/A"} µg/m³</p>
          <p><strong>PM10:</strong> ${components.pm10 ?? "N/A"} µg/m³</p>
          <p><strong>O₃:</strong> ${components.o3 ?? "N/A"} µg/m³</p>
        `;
        return;
      }
    } catch (err) {
      console.warn("OpenWeatherMap failed:", err);
    }

    // If both fail
    result.innerText = "No air quality data available.";
  } catch (error) {
    console.error("Error fetching air quality:", error);
    result.innerText = "Error fetching air quality data.";
  }
}


async function getDisasterRisk() {
  const city = document.getElementById("dp-city").value;
  const result = document.getElementById("dp-result");

  // Simulated risk levels
  const riskMap = {
  "Delhi": {
    "riskLevel": "Moderate",
    "advice": "Stay alert during monsoon season."
  },
  "Mumbai": {
    "riskLevel": "High",
    "advice": "Flood risk during heavy rains."
  },
  "Chennai": {
    "riskLevel": "Low",
    "advice": "Minimal disaster risk currently."
  },
  "Kanpur": {
    "riskLevel": "Moderate",
    "advice": "Stay updated with local alerts."
  },
  "Ahmedabad": {
    "riskLevel": "Moderate",
    "advice": "Monitor rainfall warnings."
  },
  "Bengaluru": {
    "riskLevel": "Low",
    "advice": "No significant risk currently."
  },
  "Hyderabad": {
    "riskLevel": "Low",
    "advice": "Minimal disaster risk."
  },
  "Kolkata": {
    "riskLevel": "High",
    "advice": "Be prepared for flooding."
  },
  "Pune": {
    "riskLevel": "Moderate",
    "advice": "Stay alert during heavy rains."
  },
  "Lucknow": {
    "riskLevel": "Moderate",
    "advice": "Monitor local alerts."
  },
  "Jaipur": {
    "riskLevel": "Low",
    "advice": "No immediate risk."
  },
  "Patna": {
    "riskLevel": "High",
    "advice": "Be prepared for floods."
  },
  "Bhopal": {
    "riskLevel": "Low",
    "advice": "Minimal risk."
  },
  "Nagpur": {
    "riskLevel": "Moderate",
    "advice": "Monitor heavy rainfall."
  },
  "Visakhapatnam": {
    "riskLevel": "Moderate",
    "advice": "Cyclone risk in season."
  },
  "Thiruvananthapuram": {
    "riskLevel": "Low",
    "advice": "Minimal risk."
  },
  "Ranchi": {
    "riskLevel": "Moderate",
    "advice": "Monitor rainfall warnings."
  },
  "Chandigarh": {
    "riskLevel": "Low",
    "advice": "Minimal disaster risk."
  },
  "Guwahati": {
    "riskLevel": "High",
    "advice": "Flood risk during monsoon."
  },
  "Shimla": {
    "riskLevel": "Moderate",
    "advice": "Monitor landslide alerts."
  },
  "Varanasi": {
    "riskLevel": "Moderate",
    "advice": "Monitor river levels."
  },
  "Indore": {
    "riskLevel": "Low",
    "advice": "No significant risk."
  },
  "Surat": {
    "riskLevel": "High",
    "advice": "Flood risk during heavy rains."
  },
  "Vadodara": {
    "riskLevel": "Moderate",
    "advice": "Stay alert during monsoon."
  },
  "Rajkot": {
    "riskLevel": "Moderate",
    "advice": "Monitor local rainfall alerts."
  },
  "Coimbatore": {
    "riskLevel": "Low",
    "advice": "Minimal risk."
  },
  "Madurai": {
    "riskLevel": "Low",
    "advice": "Minimal risk currently."
  },
  "Tiruchirappalli": {
    "riskLevel": "Low",
    "advice": "No significant risk."
  },
  "Erode": {
    "riskLevel": "Low",
    "advice": "Minimal risk."
  },
  "Salem": {
    "riskLevel": "Low",
    "advice": "No immediate risk."
  },
  "Mysuru": {
    "riskLevel": "Low",
    "advice": "Minimal disaster risk."
  },
  "Mangaluru": {
    "riskLevel": "Moderate",
    "advice": "Monitor heavy rainfall alerts."
  },
  "Hubballi": {
    "riskLevel": "Low",
    "advice": "Minimal risk."
  },
  "Belagavi": {
    "riskLevel": "Moderate",
    "advice": "Stay alert for local flooding."
  },
  "Davangere": {
    "riskLevel": "Low",
    "advice": "No significant risk."
  },
  "Hassan": {
    "riskLevel": "Low",
    "advice": "Minimal risk."
  },
  "Ballari": {
    "riskLevel": "Low",
    "advice": "Minimal disaster risk."
  },
  "Dharwad": {
    "riskLevel": "Low",
    "advice": "No significant risk."
  },
  "Gulbarga": {
    "riskLevel": "Moderate",
    "advice": "Monitor rainfall warnings."
  },
  "Udupi": {
    "riskLevel": "Moderate",
    "advice": "Flood risk in heavy rains."
  },
  "Karwar": {
    "riskLevel": "Moderate",
    "advice": "Monitor cyclone alerts."
  },
  "Alappuzha": {
    "riskLevel": "High",
    "advice": "Flood risk during monsoon."
  },
  "Kochi": {
    "riskLevel": "High",
    "advice": "Monitor coastal flooding alerts."
  },
  "Kozhikode": {
    "riskLevel": "High",
    "advice": "Flood and landslide risk."
  },
  "Kannur": {
    "riskLevel": "Moderate",
    "advice": "Monitor rainfall warnings."
  },
  "Kollam": {
    "riskLevel": "High",
    "advice": "Flood risk during heavy rains."
  },
  "Kottayam": {
    "riskLevel": "Moderate",
    "advice": "Stay alert during monsoon."
  },
  "Palakkad": {
    "riskLevel": "Moderate",
    "advice": "Monitor rainfall alerts."
  },
  "Thrissur": {
    "riskLevel": "High",
    "advice": "Flood risk during monsoon."
  },
  "Pathanamthitta": {
    "riskLevel": "High",
    "advice": "Landslide and flood risk."
  },
  "Malappuram": {
    "riskLevel": "Moderate",
    "advice": "Stay alert during monsoon."
  },
  "Wayanad": {
    "riskLevel": "High",
    "advice": "Landslide and flood risk."
  },
  "Kasargod": {
    "riskLevel": "High",
    "advice": "Monitor heavy rainfall alerts."
  },
  "Srinagar": {
    "riskLevel": "High",
    "advice": "Monitor flood and snow alerts."
  },
  "Jammu": {
    "riskLevel": "Moderate",
    "advice": "Monitor river levels and snowfall."
  },
  "Leh": {
    "riskLevel": "Moderate",
    "advice": "Avalanche risk in winter."
  },
  "Ladakh": {
    "riskLevel": "Moderate",
    "advice": "Monitor snow and landslide alerts."
  },
  "Amritsar": {
    "riskLevel": "Low",
    "advice": "Minimal risk."
  },
  "Ludhiana": {
    "riskLevel": "Low",
    "advice": "Minimal disaster risk."
  },
  "Jalandhar": {
    "riskLevel": "Low",
    "advice": "No significant risk."
  },
  "Patiala": {
    "riskLevel": "Low",
    "advice": "Minimal risk."
  },
  "Bathinda": {
    "riskLevel": "Low",
    "advice": "No immediate risk."
  },
  "Chandrapur": {
    "riskLevel": "Moderate",
    "advice": "Monitor local heavy rainfall."
  },
  "Aurangabad": {
    "riskLevel": "Moderate",
    "advice": "Flood risk during monsoon."
  },
  "Nashik": {
    "riskLevel": "Moderate",
    "advice": "Stay alert during heavy rains."
  },
  "Kolhapur": {
    "riskLevel": "High",
    "advice": "Flood risk during monsoon."
  },
  "Solapur": {
    "riskLevel": "Moderate",
    "advice": "Monitor rainfall warnings."
  },
  "Satara": {
    "riskLevel": "Moderate",
    "advice": "Stay alert during monsoon."
  },
  "Sangli": {
    "riskLevel": "Moderate",
    "advice": "Monitor river levels."
  },
  "Thane": {
    "riskLevel": "High",
    "advice": "Flood risk during heavy rains."
  },
  "Raigad": {
    "riskLevel": "High",
    "advice": "Monitor coastal flooding alerts."
  },
  "Ratnagiri": {
    "riskLevel": "Moderate",
    "advice": "Monitor rainfall warnings."
  },
  "Sindhudurg": {
    "riskLevel": "High",
    "advice": "Coastal flooding risk."
  },
  "Wardha": {
    "riskLevel": "Moderate",
    "advice": "Monitor local rainfall."
  },
  "Amravati": {
    "riskLevel": "Moderate",
    "advice": "Monitor river alerts."
  },
  "Akola": {
    "riskLevel": "Low",
    "advice": "No significant risk."
  },
  "Yavatmal": {
    "riskLevel": "Moderate",
    "advice": "Monitor rainfall alerts."
  },
  "Dhule": {
    "riskLevel": "Moderate",
    "advice": "Stay alert during heavy rains."
  },
  "Jalgaon": {
    "riskLevel": "Moderate",
    "advice": "Monitor river levels."
  },
  "Buldhana": {
    "riskLevel": "Low",
    "advice": "Minimal risk."
  },
  "Gaya": {
    "riskLevel": "Moderate",
    "advice": "Monitor local flooding."
  },
  "Muzaffarpur": {
    "riskLevel": "High",
    "advice": "Flood risk during monsoon."
  },
  "Darbhanga": {
    "riskLevel": "High",
    "advice": "Monitor river flooding."
  },
  "Bhagalpur": {
    "riskLevel": "Moderate",
    "advice": "Stay alert during monsoon."
  },
  "Gorakhpur": {
    "riskLevel": "High",
    "advice": "Flood risk during monsoon."
  },
  "Allahabad": {
    "riskLevel": "Moderate",
    "advice": "Monitor river levels."
  },
  "Agra": {
    "riskLevel": "Low",
    "advice": "Minimal risk."
  },
  "Meerut": {
    "riskLevel": "Moderate",
    "advice": "Monitor rainfall alerts."
  },
  "Ghaziabad": {
    "riskLevel": "Moderate",
    "advice": "Stay alert during heavy rains."
  },
  "Noida": {
    "riskLevel": "Moderate",
    "advice": "Monitor local rainfall warnings."
  },
  "Aligarh": {
    "riskLevel": "Low",
    "advice": "Minimal risk."
  },
  "Bareilly": {
    "riskLevel": "Moderate",
    "advice": "Monitor rainfall alerts."
  },
  "Moradabad": {
    "riskLevel": "Moderate",
    "advice": "Stay alert during monsoon."
  },
  "Saharanpur": {
    "riskLevel": "Moderate",
    "advice": "Monitor rainfall warnings."
  },
  "Dehradun": {
    "riskLevel": "Low",
    "advice": "Minimal risk."
  },
  "Haridwar": {
    "riskLevel": "Moderate",
    "advice": "Monitor river levels."
  },
  "Nainital": {
    "riskLevel": "Moderate",
    "advice": "Landslide risk in heavy rain."
  },
  "Haldwani": {
    "riskLevel": "Moderate",
    "advice": "Monitor rainfall alerts."
  },
  "Rishikesh": {
    "riskLevel": "Moderate",
    "advice": "Monitor river and rainfall alerts."
  },
  "Udaipur": {
    "riskLevel": "Low",
    "advice": "Minimal risk."
  },
  "Kota": {
    "riskLevel": "Low",
    "advice": "No immediate risk."
  },
  "Ajmer": {
    "riskLevel": "Low",
    "advice": "Minimal risk."
  },
  "Jodhpur": {
    "riskLevel": "Low",
    "advice": "No significant risk."
  },
  "Bikaner": {
    "riskLevel": "Low",
    "advice": "Minimal risk."
  },
  "Alwar": {
    "riskLevel": "Low",
    "advice": "Minimal risk."
  }
};

  const risk = riskMap[city] || { riskLevel: "Unknown", advice: "No data available." };

  result.innerHTML = `
    <p><strong>Risk Level:</strong> ${risk.riskLevel}</p>
    <p><strong>Advice:</strong> ${risk.advice}</p>
  `;
}

async function getWeather() {
  const city = document.getElementById("w-city").value;
  if (!city) return alert("Please enter a city name");

  try {
    let weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=b56d18bf0bacc63f53581f00fea9b79a`
    );
    let weatherData = await weatherRes.json();
    if (weatherData.cod !== 200) throw new Error(weatherData.message);

    let temp = weatherData.main.temp;
    let desc = weatherData.weather[0].description;
    let icon = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

    document.getElementById("w-result").innerHTML = `
      <p><b>${weatherData.name}</b></p>
      <img src="${icon}" alt="Weather icon" />
      <p>🌡️ ${temp}°C | ${desc}</p>
    `;
  } catch (err) {
    document.getElementById("w-result").innerHTML = `<p>Error: ${err.message}</p>`;
  }
}

document.getElementById("call-btn").addEventListener("click", () => {
  const selectedNumber = document.getElementById("emergency-select").value;
  if (!selectedNumber) {
    alert("Please select an emergency service.");
    return;
  }

  // Opens the dialer with the selected number
  window.location.href = `tel:${selectedNumber}`;
});

function updateTimeDate() {
  const now = new Date();

  const time = now.toLocaleTimeString('en-US', { hour12: false });
  const date = now.toLocaleDateString('en-GB');

  document.getElementById('current-time').textContent = time;
  document.getElementById('current-date').textContent = date;
}

// Update immediately and every second
updateTimeDate();
setInterval(updateTimeDate, 1000);
