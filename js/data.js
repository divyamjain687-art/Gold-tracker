// City-wise Gold & Silver Rates in India with Coordinates for GPS Matching (IBJA Benchmark Aligned)
const cityRates = [
  {
    city: "Mumbai",
    state: "Maharashtra",
    lat: 19.0760,
    lon: 72.8777,
    gold24k: 152020,
    gold22k: 139350,
    gold18k: 114020,
    silver: 252000,
    change24h: 0.25
  },
  {
    city: "Delhi",
    state: "Delhi NCR",
    lat: 28.6139,
    lon: 77.2090,
    gold24k: 152170,
    gold22k: 139500,
    gold18k: 114170,
    silver: 252300,
    change24h: 0.30
  },
  {
    city: "Chennai",
    state: "Tamil Nadu",
    lat: 13.0827,
    lon: 80.2707,
    gold24k: 152020,
    gold22k: 139350,
    gold18k: 117200,
    silver: 254500,
    change24h: 0.20
  },
  {
    city: "Kolkata",
    state: "West Bengal",
    lat: 22.5726,
    lon: 88.3639,
    gold24k: 152020,
    gold22k: 139350,
    gold18k: 114020,
    silver: 252000,
    change24h: 0.25
  },
  {
    city: "Bengaluru",
    state: "Karnataka",
    lat: 12.9716,
    lon: 77.5946,
    gold24k: 152020,
    gold22k: 139350,
    gold18k: 114020,
    silver: 252000,
    change24h: 0.25
  },
  {
    city: "Hyderabad",
    state: "Telangana",
    lat: 17.3850,
    lon: 78.4867,
    gold24k: 152020,
    gold22k: 139350,
    gold18k: 114020,
    silver: 254500,
    change24h: 0.22
  },
  {
    city: "Ahmedabad",
    state: "Gujarat",
    lat: 23.0225,
    lon: 72.5714,
    gold24k: 152070,
    gold22k: 139400,
    gold18k: 114060,
    silver: 252100,
    change24h: 0.28
  },
  {
    city: "Jaipur",
    state: "Rajasthan",
    lat: 26.9124,
    lon: 75.7873,
    gold24k: 152170,
    gold22k: 139500,
    gold18k: 114170,
    silver: 252300,
    change24h: 0.30
  },
  {
    city: "Pune",
    state: "Maharashtra",
    lat: 18.5204,
    lon: 73.8567,
    gold24k: 152020,
    gold22k: 139350,
    gold18k: 114020,
    silver: 252000,
    change24h: 0.25
  },
  {
    city: "Surat",
    state: "Gujarat",
    lat: 21.1702,
    lon: 72.8311,
    gold24k: 152070,
    gold22k: 139400,
    gold18k: 114060,
    silver: 252100,
    change24h: 0.28
  },
  {
    city: "Lucknow",
    state: "Uttar Pradesh",
    lat: 26.8467,
    lon: 80.9462,
    gold24k: 152170,
    gold22k: 139500,
    gold18k: 114170,
    silver: 252300,
    change24h: 0.30
  },
  {
    city: "Patna",
    state: "Bihar",
    lat: 25.5941,
    lon: 85.1376,
    gold24k: 152120,
    gold22k: 139450,
    gold18k: 114100,
    silver: 252200,
    change24h: 0.27
  },
  {
    city: "Kochi",
    state: "Kerala",
    lat: 9.9312,
    lon: 76.2673,
    gold24k: 152020,
    gold22k: 139350,
    gold18k: 114020,
    silver: 254500,
    change24h: 0.20
  },
  {
    city: "Chandigarh",
    state: "Punjab / Haryana",
    lat: 30.7333,
    lon: 76.7794,
    gold24k: 152170,
    gold22k: 139500,
    gold18k: 114170,
    silver: 252300,
    change24h: 0.30
  },
  {
    city: "Bhubaneswar",
    state: "Odisha",
    lat: 20.2961,
    lon: 85.8245,
    gold24k: 152020,
    gold22k: 139350,
    gold18k: 114020,
    silver: 252000,
    change24h: 0.25
  },
  {
    city: "Guwahati",
    state: "Assam",
    lat: 26.1445,
    lon: 91.7362,
    gold24k: 152090,
    gold22k: 139420,
    gold18k: 114080,
    silver: 252150,
    change24h: 0.26
  }
];

// Historical trend data (7 days, 30 days, 1 year) aligned with benchmark rates
const trendData = {
  "7d": {
    labels: ["Aug 27", "Aug 28", "Aug 29", "Aug 30", "Aug 31", "Sep 1", "Sep 2 (Today)"],
    gold24k: [151200, 151450, 151300, 151600, 151900, 152100, 152020],
    gold22k: [138600, 138830, 138690, 138970, 139240, 139420, 139350],
    silver: [248000, 249500, 249000, 250500, 251800, 252400, 252000]
  },
  "30d": {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Today"],
    gold24k: [148500, 149200, 150400, 151500, 152020],
    gold22k: [136125, 136760, 137860, 138870, 139350],
    silver: [242000, 245000, 248000, 250500, 252000]
  },
  "1y": {
    labels: ["Sep 25", "Nov 25", "Jan 26", "Mar 26", "May 26", "Jul 26", "Sep 26"],
    gold24k: [128000, 133500, 139000, 144500, 148000, 150500, 152020],
    gold22k: [117300, 122370, 127400, 132450, 135660, 137950, 139350],
    silver: [198000, 210000, 222000, 235000, 242000, 248500, 252000]
  }
};

// Function to find closest city by latitude/longitude using Haversine formula
function getClosestCity(lat, lon) {
  let minDistance = Infinity;
  let closest = cityRates[0];

  cityRates.forEach(item => {
    const R = 6371; // Earth's radius in km
    const dLat = (item.lat - lat) * Math.PI / 180;
    const dLon = (item.lon - lon) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * Math.PI / 180) * Math.cos(item.lat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    if (distance < minDistance) {
      minDistance = distance;
      closest = item;
    }
  });

  return { cityData: closest, distanceKm: Math.round(minDistance) };
}
