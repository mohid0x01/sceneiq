// Comprehensive Pakistan administrative locations
// Used by the Submit FIR form (district + incident type pickers)

export const PAKISTAN_DISTRICTS: { province: string; districts: string[] }[] = [
  {
    province: "Sindh",
    districts: [
      "Karachi Central", "Karachi East", "Karachi South", "Karachi West", "Korangi", "Malir",
      "Hyderabad", "Sukkur", "Larkana", "Khairpur", "Mirpur Khas", "Nawabshah (Shaheed Benazirabad)",
      "Thatta", "Dadu", "Jamshoro", "Badin", "Tharparkar", "Umerkot", "Sanghar", "Tando Allahyar",
      "Tando Muhammad Khan", "Matiari", "Shikarpur", "Jacobabad", "Kashmore", "Ghotki",
      "Naushahro Feroze", "Kambar Shahdadkot", "Sujawal",
    ],
  },
  {
    province: "Punjab",
    districts: [
      "Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala", "Sialkot", "Bahawalpur",
      "Sargodha", "Sheikhupura", "Jhang", "Kasur", "Rahim Yar Khan", "Gujrat", "Sahiwal",
      "Okara", "Vehari", "Dera Ghazi Khan", "Muzaffargarh", "Khanewal", "Mandi Bahauddin",
      "Hafizabad", "Narowal", "Toba Tek Singh", "Pakpattan", "Lodhran", "Nankana Sahib",
      "Chiniot", "Bhakkar", "Khushab", "Mianwali", "Attock", "Chakwal", "Jhelum", "Layyah",
      "Rajanpur", "Bahawalnagar",
    ],
  },
  {
    province: "Khyber Pakhtunkhwa",
    districts: [
      "Peshawar", "Mardan", "Abbottabad", "Mansehra", "Swat", "Kohat", "Bannu", "Dera Ismail Khan",
      "Charsadda", "Nowshera", "Swabi", "Haripur", "Buner", "Shangla", "Lower Dir", "Upper Dir",
      "Chitral", "Malakand", "Battagram", "Tor Ghar", "Lakki Marwat", "Tank", "Karak", "Hangu",
      "Khyber", "Mohmand", "Bajaur", "Kurram", "Orakzai", "North Waziristan", "South Waziristan",
    ],
  },
  {
    province: "Balochistan",
    districts: [
      "Quetta", "Gwadar", "Turbat (Kech)", "Khuzdar", "Sibi", "Loralai", "Zhob", "Chaman (Killa Abdullah)",
      "Pishin", "Mastung", "Kalat", "Lasbela", "Awaran", "Panjgur", "Washuk", "Kharan", "Naushki",
      "Chagai", "Dera Bugti", "Kohlu", "Barkhan", "Musakhel", "Killa Saifullah", "Ziarat",
      "Harnai", "Jaffarabad", "Jhal Magsi", "Nasirabad", "Sohbatpur", "Sherani",
    ],
  },
  {
    province: "Islamabad Capital Territory",
    districts: ["Islamabad"],
  },
  {
    province: "Azad Jammu & Kashmir",
    districts: [
      "Muzaffarabad", "Mirpur", "Bhimber", "Kotli", "Bagh", "Poonch (Rawalakot)", "Sudhanoti",
      "Haveli", "Neelum", "Hattian Bala",
    ],
  },
  {
    province: "Gilgit-Baltistan",
    districts: [
      "Gilgit", "Skardu", "Hunza", "Nagar", "Ghizer", "Ghanche", "Astore", "Diamer",
      "Shigar", "Kharmang",
    ],
  },
];

export const ALL_DISTRICTS = PAKISTAN_DISTRICTS.flatMap((p) =>
  p.districts.map((d) => ({ district: d, province: p.province })),
);

// Generate a 3-letter code for case numbers from a district name
export function districtCode(name: string): string {
  const cleaned = name.replace(/[^A-Za-z ]/g, "").trim().toUpperCase();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length >= 3) return (parts[0][0] + parts[1][0] + parts[2][0]);
  if (parts.length === 2) return (parts[0][0] + parts[1].slice(0, 2));
  return (parts[0] || "XXX").slice(0, 3).padEnd(3, "X");
}

export function generateCaseNumber(district: string): string {
  const year = new Date().getFullYear();
  const code = districtCode(district);
  // 4-digit sequence derived from a timestamp slice (good enough for default placeholder)
  const seq = String(Date.now() % 10000).padStart(4, "0");
  return `FIR-${year}-${code}-${seq}`;
}

export const INCIDENT_TYPES: { label: string; value: string }[] = [
  { label: "Theft", value: "theft" },
  { label: "Robbery", value: "robbery" },
  { label: "Assault", value: "assault" },
  { label: "Homicide / Murder", value: "homicide" },
  { label: "Sexual Assault", value: "sexual_assault" },
  { label: "Domestic Violence", value: "domestic_violence" },
  { label: "Kidnapping / Abduction", value: "kidnapping" },
  { label: "Vehicular / Hit & Run", value: "vehicular" },
  { label: "Property Damage", value: "property" },
  { label: "Arson", value: "arson" },
  { label: "Fraud / Forgery", value: "fraud" },
  { label: "Cybercrime", value: "cybercrime" },
  { label: "Narcotics", value: "narcotics" },
  { label: "Terrorism", value: "terrorism" },
  { label: "Smuggling", value: "smuggling" },
  { label: "Vandalism", value: "vandalism" },
  { label: "Other", value: "other" },
];

export const INCIDENT_TYPE_VALUES = INCIDENT_TYPES.map((i) => i.value) as [string, ...string[]];
