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
      : `${window.location.origin}${window.location.pathname}#${pageId}`;

  if (gaInitialized) {
    ReactGA.send({ hitType: "pageview", page: path, title: pageTitle, location });
  }

  if (contentsquareInitialized) {
    window._uxa = window._uxa || [];
    window._uxa.push(["trackPageview", path]);
  }

  window.dataLayer?.push({
    event: "gtgt_page_view",
    page_id: pageId,
    page_name: pageName || pageId,
    page_title: pageTitle,
    page_path: path,
    page_location: location,
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
