// City-wise Gold & Silver Rates in India with Coordinates for GPS Matching
// Official Benchmark: India Bullion and Jewellers Association (IBJA)
const cityRates = [
  {
    city: "Mumbai",
    state: "Maharashtra",
    lat: 19.0760,
    lon: 72.8777,
    gold24k: 144060,
    gold22k: 131959,
    gold18k: 108045,
    silver: 205850,
    change24h: -1.60
  },
  {
    city: "Delhi",
    state: "Delhi NCR",
    lat: 28.6139,
    lon: 77.2090,
    gold24k: 144210,
    gold22k: 132100,
    gold18k: 108150,
    silver: 206150,
    change24h: -1.55
  },
  {
    city: "Chennai",
    state: "Tamil Nadu",
    lat: 13.0827,
    lon: 80.2707,
    gold24k: 144110,
    gold22k: 132010,
    gold18k: 108090,
    silver: 209350,
    change24h: -1.50
  },
  {
    city: "Kolkata",
    state: "West Bengal",
    lat: 22.5726,
    lon: 88.3639,
    gold24k: 144120,
    gold22k: 132020,
    gold18k: 108090,
    silver: 206050,
    change24h: -1.58
  },
  {
    city: "Bengaluru",
    state: "Karnataka",
    lat: 12.9716,
    lon: 77.5946,
    gold24k: 144110,
    gold22k: 132010,
    gold18k: 108090,
    silver: 209350,
    change24h: -1.52
  },
  {
    city: "Hyderabad",
    state: "Telangana",
    lat: 17.3850,
    lon: 78.4867,
    gold24k: 144110,
    gold22k: 132010,
    gold18k: 108090,
    silver: 209350,
    change24h: -1.52
  },
  {
    city: "Ahmedabad",
    state: "Gujarat",
    lat: 23.0225,
    lon: 72.5714,
    gold24k: 144110,
    gold22k: 132010,
    gold18k: 108090,
    silver: 206000,
    change24h: -1.58
  },
  {
    city: "Jaipur",
    state: "Rajasthan",
    lat: 26.9124,
    lon: 75.7873,
    gold24k: 144210,
    gold22k: 132100,
    gold18k: 108150,
    silver: 206150,
    change24h: -1.55
  },
  {
    city: "Pune",
    state: "Maharashtra",
    lat: 18.5204,
    lon: 73.8567,
    gold24k: 144080,
    gold22k: 131980,
    gold18k: 108060,
    silver: 205900,
    change24h: -1.60
  },
  {
    city: "Surat",
    state: "Gujarat",
    lat: 21.1702,
    lon: 72.8311,
    gold24k: 144110,
    gold22k: 132010,
    gold18k: 108090,
    silver: 206000,
    change24h: -1.58
  },
  {
    city: "Lucknow",
    state: "Uttar Pradesh",
    lat: 26.8467,
    lon: 80.9462,
    gold24k: 144210,
    gold22k: 132100,
    gold18k: 108150,
    silver: 206150,
    change24h: -1.55
  },
  {
    city: "Patna",
    state: "Bihar",
    lat: 25.5941,
    lon: 85.1376,
    gold24k: 144160,
    gold22k: 132060,
    gold18k: 108120,
    silver: 206100,
    change24h: -1.56
  },
  {
    city: "Kochi",
    state: "Kerala",
    lat: 9.9312,
    lon: 76.2673,
    gold24k: 144110,
    gold22k: 132010,
    gold18k: 108090,
    silver: 209350,
    change24h: -1.50
  },
  {
    city: "Chandigarh",
    state: "Punjab / Haryana",
    lat: 30.7333,
    lon: 76.7794,
    gold24k: 144210,
    gold22k: 132100,
    gold18k: 108150,
    silver: 206150,
    change24h: -1.55
  },
  {
    city: "Bhubaneswar",
    state: "Odisha",
    lat: 20.2961,
    lon: 85.8245,
    gold24k: 144110,
    gold22k: 132010,
    gold18k: 108090,
    silver: 206100,
    change24h: -1.57
  },
  {
    city: "Guwahati",
    state: "Assam",
    lat: 26.1445,
    lon: 91.7362,
    gold24k: 144180,
    gold22k: 132080,
    gold18k: 108130,
    silver: 206200,
    change24h: -1.55
  }
];

// Historical trend data (7 days, 30 days, 1 year) aligned with official IBJA published sessions
const trendData = {
  "7d": {
    labels: ["15 Oct", "16 Oct", "19 Oct", "20 Oct", "21 Oct", "Today"],
    gold24k: [145564, 146514, 146406, 145942, 144105, 144060],
    gold22k: [133337, 134207, 134108, 133683, 132000, 131959],
    silver: [207098, 210312, 209467, 208275, 206783, 205850]
  },
  "30d": {
    labels: ["Late Sep", "Early Oct", "Mid Oct", "19 Oct", "Today"],
    gold24k: [141200, 143500, 145800, 146406, 144060],
    gold22k: [129400, 131500, 133600, 134108, 131959],
    silver: [198500, 202400, 207900, 209467, 205850]
  },
  "1y": {
    labels: ["Nov 25", "Jan 26", "Mar 26", "May 26", "Jul 26", "Sep 26", "Oct 26"],
    gold24k: [124000, 129500, 135000, 139800, 142500, 145200, 144060],
    gold22k: [113600, 118700, 123700, 128100, 130600, 133100, 131959],
    silver: [178000, 185000, 192000, 198000, 203000, 208000, 205850]
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
