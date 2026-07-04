import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { figmaAssets } from "../data/figmaAssets.js";

let kakaoLoader;

function loadKakaoMap(appKey) {
  if (!appKey) {
    return Promise.reject(new Error("VITE_KAKAO_MAP_KEY is missing"));
  }
  if (window.kakao?.maps) return Promise.resolve(window.kakao);

  if (!kakaoLoader) {
    kakaoLoader = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(appKey)}&autoload=false`;
      script.async = true;
      script.onload = () => {
        if (!window.kakao?.maps?.load) {
          kakaoLoader = null;
          reject(new Error("Kakao Maps SDK loaded without maps object. Check JavaScript key and allowed web domains."));
          return;
        }
        window.kakao.maps.load(() => resolve(window.kakao));
      };
      script.onerror = () => {
        kakaoLoader = null;
        reject(new Error("Failed to load Kakao Maps SDK. Check VITE_KAKAO_MAP_KEY and Kakao allowed web domains."));
      };
      document.head.appendChild(script);
    });
  }

  return kakaoLoader;
}

function getBounds(places) {
  const lats = places.map((place) => place.latitude);
  const lngs = places.map((place) => place.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latPadding = minLat === maxLat ? 0.002 : 0;
  const lngPadding = minLng === maxLng ? 0.002 : 0;

  return {
    minLat: minLat - latPadding,
    maxLat: maxLat + latPadding,
    minLng: minLng - lngPadding,
    maxLng: maxLng + lngPadding
  };
}

function project(place, bounds) {
  const lngRange = bounds.maxLng - bounds.minLng || 0.01;
  const latRange = bounds.maxLat - bounds.minLat || 0.01;
  return {
    left: `${((place.longitude - bounds.minLng) / lngRange) * 100}%`,
    top: `${((bounds.maxLat - place.latitude) / latRange) * 100}%`
  };
}

const defaultCurrentLocation = {
  latitude: 37.5153,
  longitude: 127.1025
};

function getCategoryKey(place) {
  if (place.isSongpaPub) return "주점";
  const category = place.category || "";
  if (category.includes("식당")) return "식당";
  if (category.includes("주점")) return "주점";
  if (category.includes("카페")) return "카페";
  if (category.includes("문화")) return "문화생활";
  if (category.includes("미용")) return "미용";
  if (category.includes("세탁") || category.includes("목욕")) return "세탁&목욕";
  return "기타";
}

function getCategoryIcon(place, tone = "white") {
  return figmaAssets.categoryIcons[getCategoryKey(place)]?.[tone] || figmaAssets.categoryIcons.기타[tone];
}

function MarkerContent({ place, routeIndex, active }) {
  if (routeIndex >= 0) return <span>{routeIndex + 1}</span>;

  return <img className="figma-map-marker-icon" src={getCategoryIcon(place, active ? "purple" : "white")} alt="" />;
}

function CurrentLocationMarker({ style }) {
  return (
    <div className="figma-current-location-marker" style={style} aria-label="내 현재 위치">
      <span className="current-location-direction">
        <span className="current-location-arrow" />
        <span className="current-location-dot" />
      </span>
    </div>
  );
}

function buildDistrictClusters(places) {
  const map = new Map();

  places.forEach((place) => {
    const key = place.district || "지역";
    const current = map.get(key) || {
      district: key,
      count: 0,
      latitudeSum: 0,
      longitudeSum: 0,
      places: []
    };

    current.count += 1;
    current.latitudeSum += place.latitude;
    current.longitudeSum += place.longitude;
    current.places.push(place);
    map.set(key, current);
  });

  return [...map.values()].map((cluster) => ({
    district: cluster.district,
    count: cluster.count,
    latitude: cluster.latitudeSum / cluster.count,
    longitude: cluster.longitudeSum / cluster.count,
    places: cluster.places
  }));
}

export default function KakaoPlacesMap({ places, routePlaces = [], selectedPlace, onSelectPlace, onMapClick, locateSignal = 0, searchFocus = null, onLocationChange }) {
  const mapRef = useRef(null);
  const overlaysRef = useRef([]);
  const currentLocationOverlayRef = useRef(null);
  const searchFocusOverlayRef = useRef(null);
  const polylineRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const zoomChangedHandlerRef = useRef(null);
  const clickHandlerRef = useRef(null);
  const skipAutoFitRef = useRef(false);
  const initialLocationFitDoneRef = useRef(false);
  const locationRequestIdRef = useRef(0);
  const [error, setError] = useState("");
  const [currentLocation, setCurrentLocation] = useState(defaultCurrentLocation);
  const [isLocating, setIsLocating] = useState(false);
  const [locationReady, setLocationReady] = useState(false);
  const [mapLevel, setMapLevel] = useState(5);
  const appKey = import.meta.env.VITE_KAKAO_MAP_KEY;
  const visiblePlaces = useMemo(() => places.slice(0, 100), [places]);
  const showDistrictClusters = false;

  const requestCurrentLocation = useCallback((options = {}) => {
    if (!navigator.geolocation) {
      setIsLocating(false);
      return;
    }

    const requestId = locationRequestIdRef.current + 1;
    locationRequestIdRef.current = requestId;
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (locationRequestIdRef.current !== requestId) return;
        const nextLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setCurrentLocation(nextLocation);
        setLocationReady(true);
        onLocationChange?.(nextLocation);

        if (options.centerMap && mapInstanceRef.current && window.kakao?.maps) {
          const target = new window.kakao.maps.LatLng(nextLocation.latitude, nextLocation.longitude);
          mapInstanceRef.current.setLevel(5);
          mapInstanceRef.current.setCenter(target);
          setMapLevel(5);
          initialLocationFitDoneRef.current = true;
        }
        setIsLocating(false);
      },
      () => {
        if (locationRequestIdRef.current !== requestId) return;
        setIsLocating(false);
      },
      { enableHighAccuracy: true, maximumAge: options.maximumAge ?? 15000, timeout: options.timeout ?? 8000 }
    );
  }, [onLocationChange]);

  useEffect(() => {
    requestCurrentLocation({ maximumAge: 30000, timeout: 8000 });
  }, [requestCurrentLocation]);

  useEffect(() => {
    if (!mapRef.current || (!visiblePlaces.length && !searchFocus)) return undefined;
    if (!appKey) {
      setError("카카오맵 환경변수 VITE_KAKAO_MAP_KEY를 설정해주세요.");
      return undefined;
    }

    let cancelled = false;

    loadKakaoMap(appKey)
      .then((kakao) => {
        if (cancelled) return;

        const first = visiblePlaces[0] || searchFocus;
        const map =
          mapInstanceRef.current ||
          new kakao.maps.Map(mapRef.current, {
            center: new kakao.maps.LatLng(first.latitude, first.longitude),
            level: 5
          });
        const isNewMap = !mapInstanceRef.current;
        mapInstanceRef.current = map;

        map.relayout();

        if (isNewMap && !zoomChangedHandlerRef.current) {
          zoomChangedHandlerRef.current = () => {
            window.requestAnimationFrame(() => {
              setMapLevel(map.getLevel());
            });
          };
          kakao.maps.event.addListener(map, "zoom_changed", zoomChangedHandlerRef.current);
        }

        if (clickHandlerRef.current) {
          kakao.maps.event.removeListener(map, "click", clickHandlerRef.current);
        }
        clickHandlerRef.current = () => onMapClick?.();
        kakao.maps.event.addListener(map, "click", clickHandlerRef.current);

        overlaysRef.current.forEach((overlay) => overlay.setMap(null));
        overlaysRef.current = [];
        if (currentLocationOverlayRef.current) currentLocationOverlayRef.current.setMap(null);
        if (searchFocusOverlayRef.current) searchFocusOverlayRef.current.setMap(null);
        if (polylineRef.current) polylineRef.current.setMap(null);

        const bounds = new kakao.maps.LatLngBounds();
        const currentPosition = new kakao.maps.LatLng(currentLocation.latitude, currentLocation.longitude);

        const currentLocationMarker = document.createElement("div");
        currentLocationMarker.className = "figma-current-location-marker is-map-overlay";
        currentLocationMarker.setAttribute("aria-label", "내 현재 위치");
        currentLocationMarker.innerHTML = '<span class="current-location-direction"><span class="current-location-arrow"></span><span class="current-location-dot"></span></span>';

        currentLocationOverlayRef.current = new kakao.maps.CustomOverlay({
          position: currentPosition,
          yAnchor: 0.78,
          content: currentLocationMarker
        });
        currentLocationOverlayRef.current.setMap(map);

        const routePath = routePlaces.map((place) => {
          const latLng = new kakao.maps.LatLng(place.latitude, place.longitude);
          bounds.extend(latLng);
          return latLng;
        });

        if (routePath.length > 1) {
          polylineRef.current = new kakao.maps.Polyline({
            path: routePath,
            strokeWeight: 3,
            strokeColor: "#5B25EB",
            strokeOpacity: 0.9,
            strokeStyle: "solid",
            zIndex: 10
          });
          polylineRef.current.setMap(map);
        }

        if (searchFocus) {
          const searchPosition = new kakao.maps.LatLng(searchFocus.latitude, searchFocus.longitude);
          bounds.extend(searchPosition);
          const focusMarker = document.createElement("div");
          focusMarker.className = "figma-search-focus-marker";
          focusMarker.textContent = searchFocus.name || "검색 위치";
          searchFocusOverlayRef.current = new kakao.maps.CustomOverlay({
            position: searchPosition,
            yAnchor: 1.1,
            content: focusMarker
          });
          searchFocusOverlayRef.current.setMap(map);
        }

        if (showDistrictClusters) {
          districtClusters.forEach((cluster) => {
            const position = new kakao.maps.LatLng(cluster.latitude, cluster.longitude);
            bounds.extend(position);

            const clusterButton = document.createElement("button");
            clusterButton.type = "button";
            clusterButton.id = `btn-map-cluster-open_${String(cluster.district || "district").replace(/[^a-zA-Z0-9]+/g, "_").toLowerCase()}`;
            clusterButton.className = "figma-map-cluster";
            clusterButton.dataset.event = "click_map_cluster";
            clusterButton.dataset.page = "map";
            clusterButton.dataset.section = "map_cluster";
            clusterButton.dataset.action = "open_cluster";
            clusterButton.dataset.label = String(cluster.district || "district").replace(/[^a-zA-Z0-9]+/g, "_").toLowerCase();
            clusterButton.title = cluster.district;
            clusterButton.innerHTML = `<strong>${cluster.count}</strong><span>${cluster.district}</span>`;
            clusterButton.addEventListener("click", () => {
              skipAutoFitRef.current = true;
              const nextLevel = Math.max(3, map.getLevel() - 3);
              map.setLevel(nextLevel);
              map.setCenter(position);
              setMapLevel(nextLevel);
            });

            const overlay = new kakao.maps.CustomOverlay({
              position,
              yAnchor: 0.62,
              content: clusterButton
            });
            overlay.setMap(map);
            overlaysRef.current.push(overlay);
          });
        } else {
          visiblePlaces.forEach((place) => {
            const position = new kakao.maps.LatLng(place.latitude, place.longitude);
            bounds.extend(position);
            const routeIndex = routePlaces.findIndex((routePlace) => routePlace.id === place.id);

            const marker = document.createElement("button");
            marker.type = "button";
            marker.id = `btn-map-marker-open_${place.id}`;
            marker.className = `figma-map-marker ${routeIndex >= 0 ? "route" : ""} ${selectedPlace?.id === place.id ? "active" : ""}`;
            marker.dataset.event = "click_map_marker";
            marker.dataset.page = "map";
            marker.dataset.section = "map_marker";
            marker.dataset.action = "open_detail";
            marker.dataset.label = String(place.id);
            marker.title = place.place_name;
            marker.innerHTML =
              routeIndex >= 0
                ? `<span>${routeIndex + 1}</span>`
                : `<img class="figma-map-marker-icon" src="${getCategoryIcon(place, selectedPlace?.id === place.id ? "purple" : "white")}" alt="" />`;
            marker.addEventListener("click", (event) => {
              event.preventDefault();
              event.stopPropagation();
              onSelectPlace(place, { source: "kakao_marker" });
            });

            const overlay = new kakao.maps.CustomOverlay({
              position,
              yAnchor: 0.65,
              content: marker
            });
            overlay.setMap(map);
            overlaysRef.current.push(overlay);
          });
        }

        const shouldSkipAutoFit = skipAutoFitRef.current;
        skipAutoFitRef.current = false;

        if (shouldSkipAutoFit) {
          return;
        }

        if (routePath.length > 1 && !selectedPlace && !searchFocus) {
          map.setBounds(bounds, 82, 34, 220, 34);
        } else if (selectedPlace) {
          const target = new kakao.maps.LatLng(selectedPlace.latitude, selectedPlace.longitude);
          map.setLevel(2);
          map.setCenter(target);
        } else if (searchFocus) {
          const target = new kakao.maps.LatLng(searchFocus.latitude, searchFocus.longitude);
          map.setLevel(4);
          map.setCenter(target);
        } else if (locationReady && (isLocating || !initialLocationFitDoneRef.current)) {
          map.setLevel(5);
          map.setCenter(currentPosition);
          setMapLevel(5);
          initialLocationFitDoneRef.current = true;
        } else if (locationReady) {
          return;
        } else {
          map.setBounds(bounds, 70, 42, 140, 42);
        }
      })
      .catch((nextError) => setError(nextError.message));

    return () => {
      cancelled = true;
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
      overlaysRef.current = [];
      if (currentLocationOverlayRef.current) currentLocationOverlayRef.current.setMap(null);
      if (mapInstanceRef.current && window.kakao?.maps && clickHandlerRef.current) {
        window.kakao.maps.event.removeListener(mapInstanceRef.current, "click", clickHandlerRef.current);
        clickHandlerRef.current = null;
      }
      if (mapInstanceRef.current && window.kakao?.maps && zoomChangedHandlerRef.current) {
        window.kakao.maps.event.removeListener(mapInstanceRef.current, "zoom_changed", zoomChangedHandlerRef.current);
        zoomChangedHandlerRef.current = null;
      }
    };
  }, [appKey, visiblePlaces, showDistrictClusters, routePlaces, selectedPlace, onSelectPlace, onMapClick, currentLocation, isLocating, searchFocus, locationReady]);

  useEffect(() => {
    if (searchFocus) setIsLocating(false);
  }, [searchFocus]);

  useEffect(() => {
    if (!mapRef.current || !mapInstanceRef.current || !window.kakao?.maps) return undefined;

    let frame = 0;
    const relayout = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        mapInstanceRef.current?.relayout();
      });
    };

    relayout();
    window.addEventListener("resize", relayout);
    window.visualViewport?.addEventListener("resize", relayout);

    const observer = new ResizeObserver(relayout);
    observer.observe(mapRef.current);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", relayout);
      window.visualViewport?.removeEventListener("resize", relayout);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!selectedPlace || !mapInstanceRef.current || !window.kakao?.maps) return;
    const target = new window.kakao.maps.LatLng(selectedPlace.latitude, selectedPlace.longitude);
    mapInstanceRef.current.setLevel(2);
    mapInstanceRef.current.panTo(target);
  }, [selectedPlace]);

  useEffect(() => {
    if (!locateSignal || !mapInstanceRef.current || !window.kakao?.maps) return;
    setIsLocating(true);
    initialLocationFitDoneRef.current = false;
    skipAutoFitRef.current = false;
    requestCurrentLocation({ centerMap: true, maximumAge: 0, timeout: 10000 });
  }, [locateSignal, requestCurrentLocation]);

  if (!appKey || error) {
    const fallbackPoints = locationReady ? [currentLocation, ...visiblePlaces] : searchFocus ? [...visiblePlaces, searchFocus] : visiblePlaces;
    const bounds = fallbackPoints.length ? getBounds(fallbackPoints) : null;

    return (
      <div className="figma-map-fallback" aria-label="지도 대체 화면">
        <img src={figmaAssets.mapSample} alt="기특기특 지도" />
        {bounds && routePlaces.length > 1 && (
          <svg className="figma-route-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              points={routePlaces
                .map((place) => {
                  const point = project(place, bounds);
                  return `${Number.parseFloat(point.left)},${Number.parseFloat(point.top)}`;
                })
                .join(" ")}
            />
          </svg>
        )}
        {bounds &&
          <CurrentLocationMarker style={project(currentLocation, bounds)} />}
        {bounds && searchFocus && (
          <div className="figma-search-focus-marker is-fallback" style={project(searchFocus, bounds)}>{searchFocus.name || "검색 위치"}</div>
        )}
        {bounds &&
          visiblePlaces.map((place) => (
            <button
              key={place.id}
              id={`btn-map-marker-open_${place.id}`}
              className={`figma-map-marker ${routePlaces.some((routePlace) => routePlace.id === place.id) ? "route" : ""} ${selectedPlace?.id === place.id ? "active" : ""}`}
              style={project(place, bounds)}
              data-event="click_map_marker"
              data-page="map"
              data-section="map_marker"
              data-action="open_detail"
              data-label={String(place.id)}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onSelectPlace(place, { source: "fallback_marker" });
              }}
              title={place.place_name}
            >
              <MarkerContent
                place={place}
                routeIndex={routePlaces.findIndex((routePlace) => routePlace.id === place.id)}
                active={selectedPlace?.id === place.id}
              />
            </button>
          ))}
        <p className="figma-map-alert">{error || "카카오맵 SDK를 불러오지 못했어요"}</p>
      </div>
    );
  }

  const handleZoom = (direction) => {
    if (!mapInstanceRef.current) return;
    skipAutoFitRef.current = true;
    const nextLevel = Math.max(1, Math.min(10, mapInstanceRef.current.getLevel() + direction));
    mapInstanceRef.current.setLevel(nextLevel);
    setMapLevel(nextLevel);
  };

  return (
    <>
      <div ref={mapRef} className="figma-kakao-map" aria-label="기특기특 카카오맵" />
      <div className="figma-map-zoom-controls" aria-label="지도 확대 축소">
        <button id="btn-map-zoom-zoom_in" type="button" data-event="click_zoom_in" data-page="map" data-section="zoom_controls" data-action="zoom_in" data-label="zoom_in" onClick={() => handleZoom(-1)} aria-label="지도 확대">
          <img src={figmaAssets.zoomIn} alt="" />
        </button>
        <button id="btn-map-zoom-zoom_out" type="button" data-event="click_zoom_out" data-page="map" data-section="zoom_controls" data-action="zoom_out" data-label="zoom_out" onClick={() => handleZoom(1)} aria-label="지도 축소">
          <img src={figmaAssets.zoomOut} alt="" />
        </button>
      </div>
    </>
  );
}
