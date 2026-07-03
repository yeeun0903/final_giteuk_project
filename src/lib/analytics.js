import ReactGA from "react-ga4";
import TagManager from "react-gtm-module";
import Hotjar from "@hotjar/browser";

let gaInitialized = false;
let gtmInitialized = false;
let hotjarInitialized = false;

export function initializeAnalytics() {
  const gaMeasurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
  const gtmId = import.meta.env.VITE_GTM_ID;
  const hotjarId = import.meta.env.VITE_HOTJAR_ID;
  const hotjarVersion = Number(import.meta.env.VITE_HOTJAR_VERSION || 6);

  if (gaMeasurementId && !gaInitialized) {
    ReactGA.initialize(gaMeasurementId);
    gaInitialized = true;
  }

  if (gtmId && !gtmInitialized) {
    TagManager.initialize({ gtmId });
    gtmInitialized = true;
  }

  if (hotjarId && !hotjarInitialized) {
    Hotjar.init(Number(hotjarId), hotjarVersion);
    hotjarInitialized = true;
  }
}

export function trackPageView(pageId, pageName) {
  const path = `/${pageId}`;

  if (gaInitialized) {
    ReactGA.send({ hitType: "pageview", page: path, title: pageName || pageId });
  }

  window.dataLayer?.push({
    event: "gtgt_page_view",
    page_id: pageId,
    page_name: pageName || pageId,
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
