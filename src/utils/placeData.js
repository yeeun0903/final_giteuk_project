const csvUrl = "/data/integrated_places_db.csv";
const songpaPubsCsvUrl = "/data/pubs_songpa.csv";
const songpaImageManifestUrl = "/data/pub_songpa_images.json";
const songpaImageBaseUrl = "/assets/pub_songpa_images";
export const placeImagePlaceholder = `${songpaImageBaseUrl}/placeholder.svg`;

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(value);
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  const [headers, ...dataRows] = rows;
  return dataRows.map((cells) =>
    headers.reduce((record, header, index) => {
      record[header] = cells[index] ?? "";
      return record;
    }, {})
  );
}

export function parsePriceNumber(value) {
  if (value === null || value === undefined) return null;
  const raw = String(value).trim();
  if (!raw || raw === "-" || raw === "--") return null;
  if (/무료|free/i.test(raw)) return 0;

  const number = Number(raw.replace(/[^\d.-]/g, ""));
  return Number.isFinite(number) ? number : null;
}

function firstPriceNumber(...values) {
  for (const value of values) {
    const parsed = parsePriceNumber(value);
    if (parsed !== null) return parsed;
  }
  return null;
}

export function getDistrict(address = "") {
  const parts = address.trim().split(/\s+/);
  const province = parts[0] || "";

  if (province.includes("서울")) return parts.find((part) => part.endsWith("구")) || "서울";
  if (province.includes("경기")) {
    return parts.find((part) => part.endsWith("시") || part.endsWith("군") || part.endsWith("구")) || "경기";
  }

  return parts.find((part) => part.endsWith("구") || part.endsWith("시") || part.endsWith("군")) || "지역확인";
}

export function formatWon(value) {
  return `${Math.round(value || 0).toLocaleString("ko-KR")}원`;
}

export function getMapLink(place) {
  if (!Number.isFinite(place.latitude) || !Number.isFinite(place.longitude)) return "";
  const label = encodeURIComponent(place.place_name || "기특기특 장소");
  return `https://map.kakao.com/link/to/${label},${place.latitude},${place.longitude}`;
}

export function normalizePlace(row, index) {
  const latitude = parsePriceNumber(row.latitude);
  const longitude = parsePriceNumber(row.longitude);
  const price1 = firstPriceNumber(row.price1_num, row.price_num, row.price1);
  const price2 = firstPriceNumber(row.price2_num, row.price2);
  const placeId = row.place_id || `place-${index}`;

  return {
    id: placeId,
    place_id: placeId,
    platform_name: row.platform_name || "",
    hashtag: row.hashtag || "",
    place_name: row.place_name || "이름 없음",
    category: row.category || row.category_name || "기타",
    address: row.address || "",
    latitude,
    longitude,
    phone: row.phone || "",
    menu1: row.menu1 || row.menu_name || "",
    price1: price1 ?? 0,
    price1_num: price1,
    price1Text: row.price1 || row.price_text || (price1 !== null ? formatWon(price1) : ""),
    menu2: row.menu2 || "",
    price2: price2 ?? 0,
    price2_num: price2,
    price2Text: row.price2 || (price2 !== null ? formatWon(price2) : ""),
    description: row.description || "",
    district: getDistrict(row.address || ""),
    images: []
  };
}

export async function loadPlacesFromCsv(url, options = {}) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("CSV 파일을 읽을 수 없음");

  const text = await response.text();
  const imageMap = options.imageMap || {};

  return parseCsv(text)
    .map(normalizePlace)
    .filter((place) => Number.isFinite(place.latitude) && Number.isFinite(place.longitude))
    .map((place) => ({
      ...place,
      images: imageMap[place.place_id] || imageMap[place.id] || place.images
    }));
}

export async function loadPlaces() {
  return loadPlacesFromCsv(csvUrl);
}

async function loadSongpaImageMap() {
  try {
    const response = await fetch(songpaImageManifestUrl);
    if (!response.ok) return {};
    const files = await response.json();

    return files.reduce((map, fileName) => {
      const match = fileName.match(/^place_id_(.+?)_image\d+\.(jpe?g|png|webp)$/i);
      if (!match) return map;
      const placeId = match[1];
      map[placeId] = map[placeId] || [];
      map[placeId].push(`${songpaImageBaseUrl}/${fileName}`);
      return map;
    }, {});
  } catch {
    return {};
  }
}

export async function loadSongpaPubs() {
  const imageMap = await loadSongpaImageMap();
  return loadPlacesFromCsv(songpaPubsCsvUrl, { imageMap });
}
