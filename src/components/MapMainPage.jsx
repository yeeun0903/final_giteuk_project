import React, { useCallback, useEffect, useMemo, useState } from "react";
import { figmaAssets } from "../data/figmaAssets.js";
import { formatWon, getMapLink, loadPlaces, loadSongpaPubs, placeImagePlaceholder } from "../utils/placeData.js";
import KakaoPlacesMap from "./KakaoPlacesMap.jsx";
import searchToggleIcon from "../assets/common/more.png";
import MapPdpSheet from "./MapPdpSheet.jsx";

const categories = [
  { label: "전체", value: "전체" },
  { label: "식당", value: "식당", iconKey: "식당" },
  { label: "주점", value: "주점", iconKey: "주점" },
  { label: "송파 술집", value: "송파술집", iconKey: "주점" },
  { label: "카페", value: "카페", iconKey: "카페" },
  { label: "문화생활", value: "문화생활", iconKey: "문화생활" },
  { label: "미용", value: "미용", iconKey: "미용" },
  { label: "세탁/목욕", value: "세탁&목욕", iconKey: "세탁&목욕" },
  { label: "기타", value: "기타", iconKey: "기타" }
];

const categoryTrackingLabels = {
  "전체": "all",
  "식당": "restaurant",
  "주점": "pub",
  "송파술집": "songpa_pub",
  "카페": "cafe",
  "문화생활": "culture",
  "미용": "beauty",
  "세탁&목욕": "laundry_bath",
  "기타": "etc",
};

function getCategoryTrackingLabel(value) {
  return categoryTrackingLabels[value] || "etc";
}

const searchAnchors = [
  { name: "강남역", latitude: 37.497952, longitude: 127.027619, aliases: ["강남역", "강남"] },
  { name: "역삼역", latitude: 37.500622, longitude: 127.036456, aliases: ["역삼역", "역삼"] },
  { name: "선릉역", latitude: 37.504503, longitude: 127.049008, aliases: ["선릉역", "선릉"] },
  { name: "신림역", latitude: 37.484201, longitude: 126.929715, aliases: ["신림역", "신림"] },
  { name: "서울대입구역", latitude: 37.481247, longitude: 126.952739, aliases: ["서울대입구역", "서울대입구", "샤로수길"] },
  { name: "봉천역", latitude: 37.482362, longitude: 126.941892, aliases: ["봉천역", "봉천"] },
  { name: "잠실역", latitude: 37.513305, longitude: 127.100129, aliases: ["잠실역", "잠실"] },
  { name: "송파역", latitude: 37.499703, longitude: 127.112183, aliases: ["송파역", "송파"] }
];

function normalizeSearch(value) {
  return String(value || "").replace(/\s+/g, "").toLowerCase();
}

function findStaticSearchAnchor(query) {
  const normalized = normalizeSearch(query);
  if (!normalized) return null;
  return searchAnchors.find((anchor) => anchor.aliases.some((alias) => normalized.includes(normalizeSearch(alias)))) || null;
}

function buildRegionSearchAnchor(query, places) {
  const normalized = normalizeSearch(query);
  if (!normalized || normalized.length < 2) return null;

  const regionMatches = places.filter((place) => {
    const district = normalizeSearch(place.district);
    const address = normalizeSearch(place.address);
    return (district && normalized.includes(district)) || (district && district.includes(normalized)) || address.includes(normalized);
  });

  if (!regionMatches.length) return null;

  const latitude = regionMatches.reduce((sum, place) => sum + place.latitude, 0) / regionMatches.length;
  const longitude = regionMatches.reduce((sum, place) => sum + place.longitude, 0) / regionMatches.length;
  const labelSource = regionMatches.find((place) => normalizeSearch(place.district).includes(normalized))?.district || regionMatches[0].district || query.trim();

  return {
    name: labelSource,
    latitude,
    longitude,
    matchedPlaceIds: new Set(regionMatches.map((place) => String(place.id))),
  };
}

function sortByDistanceFrom(anchor, places, limit = 100) {
  if (!anchor) return places;
  return places
    .filter((place) => Number.isFinite(place.latitude) && Number.isFinite(place.longitude))
    .map((place) => ({ place, distance: distanceKm(anchor, place) }))
    .filter(({ distance }) => distance <= 8)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map(({ place }) => place);
}

function distanceKm(a, b) {
  const radius = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * radius * Math.asin(Math.sqrt(h));
}

function isCulturePlace(place) {
  return String(place.category || "").includes("문화");
}

function getMenuSectionTitle(place) {
  return isCulturePlace(place) ? "기특 가격" : "기특 메뉴";
}

function getPrimaryMenuLabel(place) {
  return isCulturePlace(place) ? "입장료" : place.menu1 || "대표 메뉴";
}

function getPrimaryPriceText(place) {
  return isCulturePlace(place) ? "0원" : place.price1Text || formatWon(place.price1);
}

const CATEGORY_Q3_PRICE = {
  문화생활: 0,
  "세탁&목욕": 8000,
  카페: 3000,
  주점: 18000,
  식당: 10000,
  미용: 25000,
  기타: 90000
};

function getStoredPriceNumber(place, key) {
  const value = place?.[key];
  return Number.isFinite(value) ? value : null;
}

function isPubPlace(place) {
  const category = String(place?.category || "");
  return category.includes("주점") || category.includes("술집");
}

function getPlaceValuePrice(place) {
  const price1 = getStoredPriceNumber(place, "price1_num");
  const price2 = getStoredPriceNumber(place, "price2_num");

  if (isPubPlace(place) && price2 !== null) return price2;
  if (price1 !== null) return price1;
  if (price2 !== null) return price2;
  return null;
}

function getPlaceSavingAmount(place) {
  const basePrice = CATEGORY_Q3_PRICE[place.category] ?? 0;
  const valuePrice = getPlaceValuePrice(place);
  return valuePrice === null ? 0 : Math.max(0, basePrice - valuePrice);
}

function formatValuePriceLabel(place) {
  const valuePrice = getPlaceValuePrice(place);
  return valuePrice === null ? "가격 확인" : `${formatWon(valuePrice)} 기준`;
}

function comparePlacesByValuePrice(anchor) {
  return (a, b) => {
    const aPrice = getPlaceValuePrice(a);
    const bPrice = getPlaceValuePrice(b);

    if (aPrice === null && bPrice === null) {
      if (anchor) return distanceKm(anchor, a) - distanceKm(anchor, b);
      return String(a.place_name || "").localeCompare(String(b.place_name || ""), "ko-KR");
    }
    if (aPrice === null) return 1;
    if (bPrice === null) return -1;

    const priceDiff = aPrice - bPrice;
    if (priceDiff !== 0) return priceDiff;

    if (anchor) {
      return distanceKm(anchor, a) - distanceKm(anchor, b);
    }

    return String(a.place_name || "").localeCompare(String(b.place_name || ""), "ko-KR");
  };
}

function formatDistanceLabel(anchor, place) {
  if (!anchor || !Number.isFinite(place.latitude) || !Number.isFinite(place.longitude)) return "거리 확인";
  const distance = distanceKm(anchor, place);
  return distance < 1 ? Math.round(distance * 1000) + "m" : distance.toFixed(1) + "km";
}

function routeDistance(places) {
  return places.slice(1).reduce((sum, place, index) => sum + distanceKm(places[index], place), 0);
}

function buildLightningCourse(places) {
  const preferredDistrict = "관악구";
  const fallbackDistrict = "강남구";
  const hasCoords = (place) => place.latitude && place.longitude;
  const preferredCandidates = places.filter((place) => place.district === preferredDistrict && hasCoords(place));
  const fallbackCandidates = places.filter((place) => place.district === fallbackDistrict && hasCoords(place));
  const pool = preferredCandidates.length >= 5
    ? preferredCandidates
    : fallbackCandidates.length >= 5
      ? fallbackCandidates
      : places.filter(hasCoords);
  const courseDistrict = preferredCandidates.length >= 5
    ? preferredDistrict
    : fallbackCandidates.length >= 5
      ? fallbackDistrict
      : pool[0]?.district || preferredDistrict;

  if (!pool.length) {
    return { name: "절약 코스", district: preferredDistrict, places: [], distance: 0, minutes: 0, coursePrice: 0, saving: 0 };
  }

  const latitudes = pool.map((place) => place.latitude);
  const longitudes = pool.map((place) => place.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  const latSpan = maxLat - minLat || 1;
  const lngSpan = maxLng - minLng || 1;

  const normalize = (place) => ({
    x: (place.longitude - minLng) / lngSpan,
    y: (maxLat - place.latitude) / latSpan
  });

  const zTargets = [
    { x: 0.08, y: 0.14 },
    { x: 0.64, y: 0.40 },
    { x: 0.08, y: 0.86 },
    { x: 0.50, y: 0.86 },
    { x: 0.92, y: 0.86 }
  ];

  const route = [];
  const usedIds = new Set();

  zTargets.forEach((target) => {
    const next = pool
      .filter((place) => !usedIds.has(place.id))
      .map((place) => {
        const point = normalize(place);
        const shapeDistance = Math.hypot(point.x - target.x, point.y - target.y);
        const priceScore = Math.min(Number(place.price1) || 30000, 30000) / 30000;
        return { place, score: shapeDistance + priceScore * 0.035 };
      })
      .sort((a, b) => a.score - b.score)[0]?.place;

    if (next) {
      usedIds.add(next.id);
      route.push(next);
    }
  });

  const coursePrice = route.reduce((sum, place) => sum + (place.price1 || 0), 0);
  const normalPrice = Math.round(coursePrice * 1.28);
  const distance = routeDistance(route);

  return {
    name: "번개 코스",
    district: route[0]?.district || courseDistrict,
    places: route,
    distance,
    minutes: Math.max(18, Math.round((distance / 4) * 60 + route.length * 4)),
    coursePrice,
    saving: Math.max(0, normalPrice - coursePrice)
  };
}

function LightningCoursePopup({ course, onSelectPlace, onClose }) {
  const [likedPlaces, setLikedPlaces] = useState({});
  const [toast, setToast] = useState("");

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1400);
  };

  const handleLike = (event, place) => {
    event.stopPropagation();
    setLikedPlaces((current) => {
      const nextLiked = !current[place.id];
      showToast(nextLiked ? "찜했어요" : "찜을 해제했어요");
      return { ...current, [place.id]: nextLiked };
    });
  };

  const handleShare = async (event, place) => {
    event.stopPropagation();
    const shareText = `${place.place_name} - ${place.description || place.address}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: place.place_name,
          text: shareText,
          url: window.location.href
        });
        return;
      } catch {
        return;
      }
    }

    await navigator.clipboard?.writeText(`${shareText}\n${window.location.href}`);
    showToast("링크를 복사했어요");
  };

  const handleRoute = (event, place) => {
    event.stopPropagation();
    const mapLink = getMapLink(place);
    if (mapLink) window.open(mapLink, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="songpa-popup-sheet lightning-popup-sheet" aria-label="알뜰 절약 코스 리스트">

      <div className="songpa-savings-banner lightning-savings-banner" aria-label="알뜰 절약 코스 안내">
        <span aria-hidden="true"><img src={figmaAssets.lightningIcon} alt="" /></span>
        <strong>
          <em>{course.name}</em>
          <small>{course.district} · {course.places.length}곳 · {course.distance.toFixed(1)}km</small>
        </strong>
        <b>{formatWon(course.saving)} 절약</b>
      </div>

      {course.places.map((place, index) => (
          <article
            key={place.id}
            className="songpa-popup-card lightning-popup-card"
            role="button"
            tabIndex={0}
            onClick={() => onSelectPlace(place)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") onSelectPlace(place);
            }}
          >
            <div className="songpa-popup-copy lightning-popup-copy">
              <h2><span>{index + 1}</span>{place.place_name}</h2>
              <p>{place.description || `${place.category} · ${place.menu1 || "가성비 메뉴"}`}</p>
            </div>

            <dl className="songpa-popup-info">
              <div>
                <dt><img src={figmaAssets.pdpAddress} alt="" /></dt>
                <dd>{place.address}</dd>
              </div>
              <div>
                <dt><img src={figmaAssets.pdpPhone} alt="" /></dt>
                <dd>{place.phone || "전화번호 확인 필요"}</dd>
              </div>
            </dl>

            <div className="songpa-popup-menu">
              <h3>{getMenuSectionTitle(place)}</h3>
              <ul>
                <li>
                  <span>{getPrimaryMenuLabel(place)}</span>
                  <b>{getPrimaryPriceText(place)}</b>
                </li>
                {!isCulturePlace(place) && place.menu2 && (
                  <li>
                    <span>{place.menu2}</span>
                    <b>{place.price2Text || formatWon(place.price2)}</b>
                  </li>
                )}
              </ul>
            </div>

            <div className="songpa-popup-actions">
              <button
                type="button"
                className={likedPlaces[place.id] ? "active" : ""}
                onClick={(event) => handleLike(event, place)}
              >
                <img src={figmaAssets.pdpHeart} alt="" />
                찜하기
              </button>
              <button type="button" onClick={(event) => handleShare(event, place)}>
                <img src={figmaAssets.pdpShare} alt="" />
                공유하기
              </button>
              <button type="button" onClick={(event) => handleRoute(event, place)}>
                <img src={figmaAssets.pdpMap} alt="" />
                길찾기
              </button>
            </div>
          </article>
      ))}
      {toast && <div className="songpa-popup-toast">{toast}</div>}
    </section>
  );
}
function SongpaPubPopup({ places, onSelectPlace, onClose }) {
  const [likedPlaces, setLikedPlaces] = useState({});
  const [toast, setToast] = useState("");

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1400);
  };

  const handleLike = (event, place) => {
    event.stopPropagation();
    setLikedPlaces((current) => {
      const nextLiked = !current[place.id];
      showToast(nextLiked ? "찜했어요" : "찜을 해제했어요");
      return { ...current, [place.id]: nextLiked };
    });
  };

  const handleShare = async (event, place) => {
    event.stopPropagation();
    const shareText = `${place.place_name} - ${place.description || place.address}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: place.place_name,
          text: shareText,
          url: window.location.href
        });
        return;
      } catch {
        return;
      }
    }

    await navigator.clipboard?.writeText(`${shareText}\n${window.location.href}`);
    showToast("링크를 복사했어요");
  };

  const handleRoute = (event, place) => {
    event.stopPropagation();
    const mapLink = getMapLink(place);
    if (mapLink) window.open(mapLink, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="songpa-popup-sheet" aria-label="송파구 가성비 술집 팝업">
      <div className="songpa-savings-banner" aria-label="송파 가성비 술집 안내">
        <img src={figmaAssets.mapPopupSoju} alt="" />
        <strong>
          <span>송파</span>
          <em>가성비 술집</em>을 확인하세요!
        </strong>
      </div>

      {places.map((place) => {
        const galleryImages = place.images?.length ? place.images.slice(0, 3) : [placeImagePlaceholder];

        return (
          <article
            key={place.id}
            className="songpa-popup-card"
            role="button"
            tabIndex={0}
            onClick={() => onSelectPlace(place)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") onSelectPlace(place);
            }}
          >
            <div className="songpa-popup-gallery">
              {galleryImages.map((imageUrl, index) => (
                <img
                  key={`${place.id}-${imageUrl}-${index}`}
                  src={imageUrl}
                  alt={`${place.place_name} 이미지 ${index + 1}`}
                  onError={(event) => {
                    event.currentTarget.src = placeImagePlaceholder;
                  }}
                />
              ))}
            </div>

            <div className="songpa-popup-copy">
              <h2>{place.place_name}</h2>
              <p>{place.description || `${place.menu1} 중심의 송파 가성비 술집`}</p>
            </div>

            <dl className="songpa-popup-info">
              <div>
                <dt><img src={figmaAssets.pdpAddress} alt="" /></dt>
                <dd>{place.address}</dd>
              </div>
              <div>
                <dt><img src={figmaAssets.pdpPhone} alt="" /></dt>
                <dd>{place.phone || "전화번호 확인 필요"}</dd>
              </div>
            </dl>

            <div className="songpa-popup-menu">
              <h3>기특 메뉴</h3>
              <ul>
                <li>
                  <span>{place.menu1 || "대표 메뉴"}</span>
                  <b>{getPrimaryPriceText(place)}</b>
                </li>
                {!isCulturePlace(place) && place.menu2 && (
                  <li>
                    <span>{place.menu2}</span>
                    <b>{place.price2Text || formatWon(place.price2)}</b>
                  </li>
                )}
              </ul>
            </div>

            <div className="songpa-popup-actions">
              <button
                type="button"
                className={likedPlaces[place.id] ? "active" : ""}
                onClick={(event) => handleLike(event, place)}
              >
                <img src={figmaAssets.pdpHeart} alt="" />
                찜하기
              </button>
              <button type="button" onClick={(event) => handleShare(event, place)}>
                <img src={figmaAssets.pdpShare} alt="" />
                공유하기
              </button>
              <button type="button" onClick={(event) => handleRoute(event, place)}>
                <img src={figmaAssets.pdpMap} alt="" />
                길찾기
              </button>
            </div>
          </article>
        );
      })}
      {toast && <div className="songpa-popup-toast">{toast}</div>}
    </section>
  );
}

function MemberOnlySongpaPopup({ onClose, onOpenSongpa }) {
  return (
    <div className="map-member-popup-layer" role="presentation" onClick={onClose}>
      <section
        className="map-member-popup"
        role="dialog"
        aria-modal="true"
        aria-label="송파 소주 1,500원 회원 전용 안내"
        onClick={(event) => event.stopPropagation()}
      >
      <header className="map-member-popup-header">
        <span className="map-member-popup-logo" aria-hidden="true">
          <img src={figmaAssets.mapPopupLogoTop} alt="" />
          <img src={figmaAssets.mapPopupLogoBottom} alt="" />
        </span>
        <button id="btn-map-songpa_popup-close" type="button" className="map-member-popup-close" data-event="click_close" data-page="map" data-section="songpa_popup" data-action="close" data-label="songpa_popup" onClick={onClose} aria-label="팝업 닫기">
          <img src={figmaAssets.mapPopupClose} alt="" />
        </button>
      </header>

      <div className="map-member-popup-title">
        <div>
          <strong>송파</strong>
          <img src={figmaAssets.mapPopupSoju} alt="" />
        </div>
        <b>소주 1,500원</b>
      </div>

      <span className="map-member-popup-pill">
        <img src={figmaAssets.mapPopupLock} alt="" />
        회원 전용
      </span>

      <p className="map-member-popup-copy">
        <strong>가성비 술집 정보</strong>
        <span>한눈에 확인하세요!</span>
      </p>

      <ul className="map-member-popup-list">
        {["상호명", "정확한 위치", "최저가 정보"].map((label) => (
          <li key={label}>
            <img src={figmaAssets.mapPopupCheck} alt="" />
            {label}
          </li>
        ))}
      </ul>

      <img className="map-member-popup-character" src={figmaAssets.mapPopupCharacter} alt="기특이 캐릭터" />

      <button
        id="btn-map-songpa_popup-login"
        type="button"
        className="map-member-popup-cta"
        data-event="click_login"
        data-page="map"
        data-section="songpa_popup"
        data-action="login"
        data-label="songpa_popup"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onOpenSongpa?.();
        }}
      >
        회원가입하고 정보 보기
        <img src={figmaAssets.mapPopupChevron} alt="" />
      </button>
      </section>
    </div>
  );
}

export default function MapMainPage({
  initialSongpaOpen = false,
  targetPlace = null,
  onTargetPlaceHandled,
  showMemberPopupOnMount = true,
  onMemberPopupSeen,
  onOpenMyPage,
  onOpenCommunity,
  onOpenGroupbuy,
  onOpenInform,
  onOpenAuth,
  onConfirmVisited,
  isAuthenticated = false,
  likedPlaces = [],
  onToggleLike
}) {
  const [places, setPlaces] = useState([]);
  const [songpaPubs, setSongpaPubs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialSongpaOpen ? "송파술집" : "전체");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [focusedPlace, setFocusedPlace] = useState(null);
  const [searchSelectedPlace, setSearchSelectedPlace] = useState(null);
  const [showMemberPopup, setShowMemberPopup] = useState(showMemberPopupOnMount && !initialSongpaOpen);
  const [searchText, setSearchText] = useState("");
  const [searchSort, setSearchSort] = useState("distance");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [isSearchResultsCollapsed, setIsSearchResultsCollapsed] = useState(false);
  const [showLightningCourse, setShowLightningCourse] = useState(false);
  const [showLightningList, setShowLightningList] = useState(false);
  const [status, setStatus] = useState("통합 DB 불러오는 중");
  const [locateSignal, setLocateSignal] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const getPlaceKey = useCallback((place) => String(place?.place_id || place?.id || place?.place_name || "local-place"), []);

  useEffect(() => {
    Promise.all([loadPlaces(), loadSongpaPubs()])
      .then(([nextPlaces, nextSongpaPubs]) => {
        const taggedSongpaPubs = nextSongpaPubs.map((place) => ({ ...place, isSongpaPub: true }));
        const mergedPlaces = [...nextPlaces, ...taggedSongpaPubs];
        setPlaces(mergedPlaces);
        setSongpaPubs(taggedSongpaPubs);
        setStatus(`${mergedPlaces.length.toLocaleString("ko-KR")}개 업소`);
      })
      .catch(() => {
        setStatus("통합 DB를 불러오지 못했어요");
      });
  }, []);

  useEffect(() => {
    if (!targetPlace) return;

    const normalizedTargetName = normalizeSearch(targetPlace.place_name);
    const normalizedTargetAddress = normalizeSearch(targetPlace.address);
    const matchedPlace = places.find((place) => {
      const placeName = normalizeSearch(place.place_name);
      const address = normalizeSearch(place.address);

      return (
        (normalizedTargetName && placeName.includes(normalizedTargetName)) ||
        (normalizedTargetAddress && address.includes(normalizedTargetAddress))
      );
    });

    const nextPlace = matchedPlace || targetPlace;

    setSelectedCategory("전체");
    setSelectedPlace(null);
    setFocusedPlace(nextPlace);
    setSearchSelectedPlace(null);
    setShowMemberPopup(false);
    setShowLightningCourse(false);
    setShowLightningList(false);
    setSearchText("");
    setShowSortOptions(false);
    onTargetPlaceHandled?.();

    const popupTimer = window.setTimeout(() => {
      setFocusedPlace(null);
      setSelectedPlace(nextPlace);
    }, 650);

    return () => window.clearTimeout(popupTimer);
  }, [onTargetPlaceHandled, places, targetPlace]);

  const regionSearchAnchor = useMemo(() => buildRegionSearchAnchor(searchText, places), [places, searchText]);
  const searchAnchor = useMemo(() => regionSearchAnchor || findStaticSearchAnchor(searchText), [regionSearchAnchor, searchText]);
  const distanceSortAnchor = userLocation || searchAnchor;

  const filteredPlaces = useMemo(() => {
    const base =
      selectedCategory === "송파술집"
        ? songpaPubs
        : selectedCategory === "전체"
          ? places
          : places.filter((place) => place.category === selectedCategory);
    const query = normalizeSearch(searchText);
    const searched = query
      ? base.filter((place) => {
          const haystack = normalizeSearch([
            place.place_name,
            place.category,
            place.address,
            place.menu1,
            place.menu2,
            place.district
          ].join(" "));
          return haystack.includes(query) || searchAnchor?.matchedPlaceIds?.has(String(place.id));
        })
      : base;

    if (query && searchAnchor && searched.length < 12) {
      return sortByDistanceFrom(searchAnchor, base);
    }

    return searched;
  }, [places, searchAnchor, searchText, selectedCategory, songpaPubs]);

  const orderedFilteredPlaces = useMemo(() => {
    if (!filteredPlaces.length) return filteredPlaces;
    const sortable = [...filteredPlaces];

    if (searchSort === "value") {
      return sortable.sort(comparePlacesByValuePrice(distanceSortAnchor));
    }

    const distanceAnchor = distanceSortAnchor || sortable.find((place) => Number.isFinite(place.latitude) && Number.isFinite(place.longitude));
    if (!distanceAnchor) return sortable;

    return sortable.sort((a, b) => distanceKm(distanceAnchor, a) - distanceKm(distanceAnchor, b));
  }, [distanceSortAnchor, filteredPlaces, searchSort]);

  const hasSearchQuery = Boolean(searchText.trim());
  const showSearchPanel = hasSearchQuery || showSortOptions;
  const searchResults = orderedFilteredPlaces;
  const lightningCourse = useMemo(() => buildLightningCourse(places), [places]);
  const activeSearchPlaces = hasSearchQuery ? orderedFilteredPlaces : [];
  const mapPlaces = selectedPlace
    ? orderedFilteredPlaces.some((place) => getPlaceKey(place) === getPlaceKey(selectedPlace))
      ? orderedFilteredPlaces
      : [...orderedFilteredPlaces, selectedPlace]
    : searchSelectedPlace
      ? activeSearchPlaces.some((place) => getPlaceKey(place) === getPlaceKey(searchSelectedPlace))
        ? activeSearchPlaces
        : [searchSelectedPlace, ...activeSearchPlaces]
    : focusedPlace
      ? activeSearchPlaces.length
        ? activeSearchPlaces
        : [focusedPlace]
      : showLightningCourse && lightningCourse.places.length
      ? lightningCourse.places
      : orderedFilteredPlaces;
  const showSongpaPopup = selectedCategory === "송파술집" && !selectedPlace && !focusedPlace && !searchSelectedPlace && songpaPubs.length > 0;
  const selectedPlaceLiked = selectedPlace
    ? likedPlaces.some((place) => getPlaceKey(place) === getPlaceKey(selectedPlace))
    : false;

  const handleSelectCategory = useCallback((category) => {
    setSelectedCategory(category);
    setSelectedPlace(null);
    setFocusedPlace(null);
    setSearchSelectedPlace(null);
    setShowLightningCourse(false);
              setShowLightningList(false);
  }, []);

  const focusSongpaPlace = useCallback((place) => {
    setFocusedPlace(place);
    setSearchSelectedPlace(null);
    setSelectedPlace(null);
    setShowLightningCourse(false);
              setShowLightningList(false);
  }, []);

  const focusLightningPlace = useCallback((place) => {
    setFocusedPlace(place);
    setSearchSelectedPlace(null);
    setSelectedPlace(null);
    setShowLightningList(false);
  }, []);

  const closeSearchPanel = useCallback(() => {
    if (!searchText.trim() && !showSortOptions) return;
    setSearchText("");
    setShowSortOptions(false);
    setIsSearchResultsCollapsed(false);
  }, [searchText, showSortOptions]);

  const handleSearchResultSelect = useCallback((place) => {
    setSearchSelectedPlace(place);
    setFocusedPlace(place);
    setSelectedPlace(null);
    setShowLightningCourse(false);
    setShowLightningList(false);
    setShowSortOptions(false);
  }, []);

  const handleMapPlaceSelect = useCallback((place) => {
    closeSearchPanel();
    if (showLightningCourse) {
      const focusedKey = searchSelectedPlace || focusedPlace;
      if (focusedKey && getPlaceKey(focusedKey) === getPlaceKey(place)) {
        setSelectedPlace(place);
        return;
      }

      setFocusedPlace(place);
      setSelectedPlace(null);
      setShowLightningList(false);
      return;
    }

    const focusedKey = searchSelectedPlace || focusedPlace;
    if (focusedKey && getPlaceKey(focusedKey) === getPlaceKey(place)) {
      setSelectedPlace(place);
      return;
    }

    setSelectedPlace(place);
  }, [closeSearchPanel, focusedPlace, getPlaceKey, searchSelectedPlace, showLightningCourse]);

  const openSongpaFromMemberPopup = useCallback(() => {
    setShowMemberPopup(false);
    onMemberPopupSeen?.();
    setSelectedCategory("송파술집");
    setSelectedPlace(null);
    setFocusedPlace(null);
    setSearchSelectedPlace(null);
    setShowLightningCourse(false);
              setShowLightningList(false);
  }, [onMemberPopupSeen]);

  const closeMemberPopup = useCallback(() => {
    setShowMemberPopup(false);
    onMemberPopupSeen?.();
  }, [onMemberPopupSeen]);

  return (
    <section className="phone-page figma-map-page">
      <button
        id="btn-map-overlay-close"
        type="button"
        className={selectedPlace || showSongpaPopup || showMemberPopup ? "map-pdp-dim active" : "map-pdp-dim"}
        aria-label="상세 화면 닫기"
        data-event="click_close"
        data-page="map"
        data-section="overlay"
        data-action="close"
        data-label="overlay_close"
        onClick={() => {
          if (showMemberPopup) closeMemberPopup();
          setSelectedPlace(null);
          setFocusedPlace(null);
          setSearchSelectedPlace(null);
          if (showSongpaPopup) setSelectedCategory("전체");
        }}
      />

      <KakaoPlacesMap
        places={mapPlaces}
        routePlaces={showLightningCourse && !focusedPlace && !searchSelectedPlace ? lightningCourse.places : []}
        selectedPlace={selectedPlace || searchSelectedPlace || focusedPlace}
        onSelectPlace={handleMapPlaceSelect}
        onMapClick={closeSearchPanel}
        locateSignal={locateSignal}
        searchFocus={hasSearchQuery ? searchAnchor : null}
        onLocationChange={setUserLocation}
      />

      <header className={showSearchPanel ? "figma-map-header search-open" : "figma-map-header"}>
        <div className="figma-gnb">
          <div className="figma-brand">
            <div className="figma-logo-mark">
              <img src={figmaAssets.logoTop} alt="" />
              <img src={figmaAssets.logoBottom} alt="" />
            </div>
            <img className="figma-logo-text" src={figmaAssets.logoText} alt="기특기특" />
          </div>
          <div className="figma-header-icons">
            <button id="btn-map-header-login_social" type="button" aria-label="소셜 로그인" data-event="click_login" data-page="map" data-section="header" data-action="login_social" data-label="social_login" onClick={() => onOpenAuth?.("login")}>
              <img src={figmaAssets.signUpIcon} alt="" />
            </button>
            <button id="btn-map-header-login_email" type="button" aria-label="아이디 로그인" data-event="click_login" data-page="map" data-section="header" data-action="login_email" data-label="email_login" onClick={() => onOpenAuth?.("id-login")}>
              <img src={figmaAssets.loginIcon} alt="" />
            </button>
          </div>
        </div>

        <div className="figma-search">
          <img src={figmaAssets.searchIcon} alt="" />
          <input
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value);
              setSelectedPlace(null);
              setFocusedPlace(null);
              setSearchSelectedPlace(null);
              setShowLightningCourse(false);
              setShowLightningList(false);
              setShowSortOptions(false);
              setIsSearchResultsCollapsed(false);
            }}
            placeholder="지역, 매장, 메뉴를 검색해보세요"
          />
          <button
            id="btn-map-search-sort_toggle"
            type="button"
            className={showSortOptions ? "figma-search-filter active" : "figma-search-filter"}
            aria-label="검색 결과 정렬"
            data-event="click_sort_toggle"
            data-page="map"
            data-section="search"
            data-action="sort_toggle"
            data-label="sort_toggle"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setShowSortOptions((open) => !open);
              setIsSearchResultsCollapsed(false);
            }}
          >
            <img src={figmaAssets.filterIcon} alt="" />
          </button>
        </div>

        {showSearchPanel && (
          <section className={isSearchResultsCollapsed ? "figma-search-results is-collapsed" : "figma-search-results"} onMouseDown={(event) => event.stopPropagation()} onClick={(event) => event.stopPropagation()}>
            <div className="figma-search-results-head">
              <button
                id="btn-map-search-results-toggle"
                type="button"
                className="figma-search-results-toggle"
                data-event="click_search_results_toggle"
                data-page="map"
                data-section="search_results"
                data-action={isSearchResultsCollapsed ? "expand" : "collapse"}
                data-label="search_results_toggle"
                onClick={() => setIsSearchResultsCollapsed((collapsed) => !collapsed)}
              >
                <strong>검색 결과 {orderedFilteredPlaces.length.toLocaleString("ko-KR")}개</strong>
                <span>{isSearchResultsCollapsed ? "펼치기" : "접기"}<img src={searchToggleIcon} alt="" /></span>
              </button>
              {!isSearchResultsCollapsed && <div className="figma-search-sort-options" aria-label="검색 결과 정렬">
                <button
                  id="btn-map-search-sort_distance"
                  type="button"
                  className={searchSort === "distance" ? "active" : ""}
                  data-event="click_sort_distance"
                  data-page="map"
                  data-section="search_results"
                  data-action="sort_distance"
                  data-label="distance"
                  onClick={() => {
                    setSearchSort("distance");
                  }}
                >
                  <img className="figma-search-sort-icon" src={figmaAssets.sortDistanceIcon[searchSort === "distance" ? "white" : "purple"]} alt="" />
                  <span>거리순</span>
                </button>
                <button
                  id="btn-map-search-sort_value"
                  type="button"
                  className={searchSort === "value" ? "active" : ""}
                  data-event="click_sort_value"
                  data-page="map"
                  data-section="search_results"
                  data-action="sort_value"
                  data-label="value"
                  onClick={() => {
                    setSearchSort("value");
                  }}
                >
                  <img className="figma-search-sort-icon" src={figmaAssets.sortValueIcon[searchSort === "value" ? "white" : "purple"]} alt="" />
                  <span>가성비순</span>
                </button>
              </div>}
            </div>
            {!isSearchResultsCollapsed && (searchResults.length ? (
              searchResults.map((place) => (
                <button
                  key={place.id}
                  id={`btn-map-search_result-open_${place.id}`}
                  data-event="click_search_result"
                  data-page="map"
                  data-section="search_results"
                  data-action="open_detail"
                  data-label={String(place.id)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleSearchResultSelect(place);
                  }}
                >
                  <span>{place.place_name}</span>
                  <small>{place.category} · {place.district}</small>
                  <em className="figma-search-result-metrics">
                    <b>{formatDistanceLabel(distanceSortAnchor, place)}</b>
                    <b>{formatValuePriceLabel(place)}</b>
                  </em>
                </button>
              ))
            ) : (
              <p>검색 결과가 없어요</p>
            ))}
          </section>
        )}

        <nav className="figma-category-row" aria-label="카테고리 필터">
          {categories.map((category) => {
            const active = selectedCategory === category.value;
            const icon = category.iconKey
              ? figmaAssets.categoryIcons[category.iconKey]?.[active ? "white" : "purple"]
              : "";

            return (
              <button
                key={category.label}
                id={`btn-map-category-${getCategoryTrackingLabel(category.value)}`}
                className={active ? "active" : ""}
                data-event="click_category"
                data-page="map"
                data-section="category_filter"
                data-action={`category_${getCategoryTrackingLabel(category.value)}`}
                data-label={getCategoryTrackingLabel(category.value)}
                onClick={() => {
                  closeSearchPanel();
                  handleSelectCategory(category.value);
                }}
              >
                {icon && <img className="category-filter-icon" src={icon} alt="" />}
                {category.label}
              </button>
            );
          })}
        </nav>
      </header>

      <button
        id="btn-map-floating-mylocation"
        className={showSearchPanel ? "figma-current-location search-active" : "figma-current-location"}
        aria-label="현재 위치"
        data-event="click_my_location"
        data-page="map"
        data-section="floating_controls"
        data-action="my_location"
        data-label="my_location"
        onClick={() => {
          setSelectedPlace(null);
          setFocusedPlace(null);
          setSearchSelectedPlace(null);
          setShowSortOptions(false);
          setIsSearchResultsCollapsed(true);
          setSelectedCategory("전체");
          setShowLightningCourse(false);
          setShowLightningList(false);
          setLocateSignal((signal) => signal + 1);
        }}
      >
        <img src={figmaAssets.currentLocation} alt="" />
      </button>

      <div className="figma-map-status">{status}</div>

      {!selectedPlace && !showSongpaPopup && !showMemberPopup && !showLightningCourse && (
        <button
          id="btn-map-floating-lightning_course"
          className="lightning-course-button"
          data-event="click_lightning_course"
          data-page="map"
          data-section="floating_controls"
          data-action="lightning_course"
          data-label="lightning_course"
          onClick={() => {
            setShowLightningCourse(true);
            setShowLightningList(false);
          }}
        >
          <span><img src={figmaAssets.lightningIcon} alt="" /></span>
          <strong>번개 코스</strong>
          <small>지도에서 코스 선 먼저 보기</small>
        </button>
      )}

      {showSongpaPopup && (
        <SongpaPubPopup
          places={orderedFilteredPlaces}
          onSelectPlace={focusSongpaPlace}
          onClose={() => setSelectedCategory("전체")}
        />
      )}

      {showMemberPopup && (
        <MemberOnlySongpaPopup
          onClose={closeMemberPopup}
          onOpenSongpa={() => {
            closeMemberPopup();
            if (onOpenAuth) onOpenAuth("login", "course", "songpa-popup");
            else openSongpaFromMemberPopup();
          }}
        />
      )}

      {showLightningCourse && !showLightningList && !selectedPlace && (
        <section className="lightning-course-sheet">
          <div>
            <strong><img src={figmaAssets.lightningIcon} alt="" />{lightningCourse.name}</strong>
            <p>{lightningCourse.district} · {lightningCourse.places.length}곳 · {lightningCourse.distance.toFixed(1)}km</p>
          </div>
          <b>{formatWon(lightningCourse.saving)} 절약</b>
          <button id="btn-map-lightning_sheet-open_list" type="button" data-event="click_lightning_list" data-page="map" data-section="lightning_sheet" data-action="open_list" data-label="lightning_list" onClick={() => setShowLightningList(true)}>리스트 보기</button>
        </section>
      )}

      {showLightningCourse && showLightningList && !selectedPlace && (
        <>
          <button
            type="button"
            className="lightning-popup-backdrop"
            aria-label="번개코스 리스트 닫기"
            onClick={() => setShowLightningList(false)}
          />
          <LightningCoursePopup
            course={lightningCourse}
            onSelectPlace={focusLightningPlace}
            onClose={() => setShowLightningList(false)}
          />
        </>
      )}

      {selectedPlace && (
        <MapPdpSheet
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          onOpenInform={() => {
            if (!isAuthenticated) {
              onOpenAuth?.("login", "course", "map-inform");
              return;
            }
            onOpenInform?.();
          }}
          onConfirmVisited={onConfirmVisited}
          isAuthenticated={isAuthenticated}
          onRequireAuth={() => onOpenAuth?.("login", "course", "map-action")}
          isLiked={selectedPlaceLiked}
          onToggleLike={onToggleLike}
        />
      )}

      {!selectedPlace && !showSongpaPopup && !showLightningList && (
        <nav className="figma-bottom-nav">
          <button id="btn-map-bottom_nav-map" className="active" data-event="click_nav_map" data-page="map" data-section="bottom_nav" data-action="nav_map" data-label="map">
            <img src={figmaAssets.navMap} alt="" />
            <span>지도</span>
          </button>
          <button id="btn-map-bottom_nav-community" type="button" data-event="click_nav_community" data-page="map" data-section="bottom_nav" data-action="nav_community" data-label="community" onClick={onOpenCommunity}>
            <img src={figmaAssets.navCommunity} alt="" />
            <span>커뮤니티</span>
          </button>
          <button id="btn-map-bottom_nav-groupbuy" type="button" data-event="click_nav_groupbuy" data-page="map" data-section="bottom_nav" data-action="nav_groupbuy" data-label="groupbuy" onClick={onOpenGroupbuy}>
            <img src={figmaAssets.navBuy} alt="" />
            <span>공동구매</span>
          </button>
          <button id="btn-map-bottom_nav-mypage" type="button" data-event="click_nav_mypage" data-page="map" data-section="bottom_nav" data-action="nav_mypage" data-label="mypage" onClick={onOpenMyPage}>
            <img src={figmaAssets.navMy} alt="" />
            <span>마이페이지</span>
          </button>
        </nav>
      )}
    </section>
  );
}
