import ReactGA from "react-ga4";
import TagManager from "react-gtm-module";
import Hotjar from "@hotjar/browser";

const fallbackGaMeasurementId = "G-R566ZLV2FF";
const fallbackGtmId = "GTM-NKGKGRC7";
const fallbackContentsquareId = "7b7e7d0d2b366";

let gaInitialized = false;
let gtmInitialized = false;
let hotjarInitialized = false;
let contentsquareInitialized = false;
let campaignLandingTracked = false;

function getAnalyticsConfig() {
  return {
    gaMeasurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID || fallbackGaMeasurementId,
    gtmId: import.meta.env.VITE_GTM_ID || fallbackGtmId,
    hotjarId: import.meta.env.VITE_HOTJAR_ID || "",
    hotjarVersion: Number(import.meta.env.VITE_HOTJAR_VERSION || 6),
    contentsquareId: import.meta.env.VITE_CONTENTSQUARE_ID || fallbackContentsquareId,
  };
}

function initializeContentsquare(contentsquareId) {
  if (!contentsquareId || contentsquareInitialized || typeof document === "undefined") return;
  const selector = `script[data-contentsquare-id="${contentsquareId}"]`;
  if (document.querySelector(selector)) {
    contentsquareInitialized = true;
    return;
  }

  window._uxa = window._uxa || [];

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://t.contentsquare.net/uxa/${contentsquareId}.js`;
  script.dataset.contentsquareId = contentsquareId;
  document.head.appendChild(script);
  contentsquareInitialized = true;
}

function sendGaPageView({ pageId, pageName, pageTitle, path, location }) {
  ReactGA.send({
    hitType: "pageview",
    page: path,
    title: pageTitle,
    location,
    page_id: pageId,
    page_name: pageName || pageId,
  });
}

export function initializeAnalytics() {
  const { gaMeasurementId, gtmId, hotjarId, hotjarVersion, contentsquareId } = getAnalyticsConfig();

  if (gaMeasurementId && !gaInitialized) {
    ReactGA.initialize(gaMeasurementId, {
      gtagOptions: {
        send_page_view: false,
      },
    });
    gaInitialized = true;
  }

  if (gtmId && !gtmInitialized) {
    TagManager.initialize({ gtmId });
    gtmInitialized = true;
  }

  if (hotjarId && /^\d+$/.test(String(hotjarId)) && !hotjarInitialized) {
    Hotjar.init(Number(hotjarId), hotjarVersion);
    hotjarInitialized = true;
  }

  initializeContentsquare(contentsquareId);
}

export function trackPageView(pageId, pageName, pageTitle = pageName || pageId) {
  const path = `/${pageId}`;
  const location =
    typeof window === "undefined"
      ? path
      : `${window.location.origin}${window.location.pathname}${window.location.search}#${pageId}`;

  if (gaInitialized) sendGaPageView({ pageId, pageName, pageTitle, path, location });

  if (hotjarInitialized) Hotjar.stateChange(path);

  window.dataLayer?.push({
    event: "gtgt_page_view",
    page_id: pageId,
    page_name: pageName || pageId,
    page_title: pageTitle,
    page_path: path,
    page_location: location,
  });

  if (contentsquareInitialized) {
    window._uxa = window._uxa || [];
    window._uxa.push(["trackPageview", path]);
  }
}

function normalizeParamValue(value) {
  return value ? String(value).trim().toLowerCase() : "";
}

function getSearchParams() {
  if (typeof window === "undefined") return new URLSearchParams();

  const params = new URLSearchParams(window.location.search);
  const hashQueryIndex = window.location.hash.indexOf("?");

  if (hashQueryIndex >= 0) {
    const hashParams = new URLSearchParams(window.location.hash.slice(hashQueryIndex + 1));
    hashParams.forEach((value, key) => {
      if (!params.has(key)) params.set(key, value);
    });
  }

  return params;
}

function inferTrafficPlatform(params) {
  const utmSource = normalizeParamValue(params.get("utm_source"));
  const referrer = normalizeParamValue(typeof document === "undefined" ? "" : document.referrer);

  if (params.has("ttclid") || utmSource.includes("tiktok") || referrer.includes("tiktok")) return "tiktok";
  if (params.has("fbclid") || utmSource.includes("meta") || utmSource.includes("facebook") || utmSource.includes("instagram")) {
    return "meta";
  }
  if (params.has("gclid") || params.has("gbraid") || params.has("wbraid") || utmSource.includes("google")) return "google";

  return utmSource || "direct_or_unknown";
}

export function trackCampaignLanding() {
  if (campaignLandingTracked || typeof window === "undefined") return;

  const params = getSearchParams();
  const attribution = {
    traffic_platform: inferTrafficPlatform(params),
    utm_source: normalizeParamValue(params.get("utm_source")),
    utm_medium: normalizeParamValue(params.get("utm_medium")),
    utm_campaign: normalizeParamValue(params.get("utm_campaign")),
    utm_content: normalizeParamValue(params.get("utm_content")),
    utm_term: normalizeParamValue(params.get("utm_term")),
    click_id_type: params.has("ttclid")
      ? "ttclid"
      : params.has("fbclid")
        ? "fbclid"
        : params.has("gclid")
          ? "gclid"
          : params.has("gbraid")
            ? "gbraid"
            : params.has("wbraid")
              ? "wbraid"
              : "none",
    page_location: window.location.href,
    page_referrer: typeof document === "undefined" ? "" : document.referrer,
  };

  const storageKey = `gtgt_campaign_landing:${window.location.href}`;
  try {
    if (window.sessionStorage.getItem(storageKey)) return;
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    // Continue without storage; private/in-app browsers may block sessionStorage.
  }

  campaignLandingTracked = true;

  if (gaInitialized) ReactGA.event("gtgt_campaign_landing", attribution);

  window.dataLayer?.push({
    event: "gtgt_campaign_landing",
    ...attribution,
  });
}

export function trackClick({ id, eventName, page, pageId, section, action, label }) {
  window.dataLayer?.push({
    event: eventName || "gtgt_click",
    click_id: id,
    page_id: pageId || page,
    click_page: page || pageId,
    click_section: section || "unknown",
    click_action: action || "click",
    click_label: label || action || id,
  });
}
