const clickableSelector = [
  "button",
  "a[href]",
  "[role='button']",
  "input[type='button']",
  "input[type='submit']",
  "input[type='checkbox']",
  "input[type='radio']",
  "select",
].join(",");

const koreanActionAliases = [
  ["회원가입", "signup"],
  ["로그인", "login"],
  ["구글", "google_login"],
  ["카카오", "kakao_login"],
  ["시작", "start"],
  ["뒤로", "back"],
  ["닫기", "close"],
  ["홈", "home"],
  ["마이페이지", "mypage"],
  ["지도", "map"],
  ["커뮤니티", "community"],
  ["공동구매", "groupbuy"],
  ["내 위치", "my_location"],
  ["현재 위치", "my_location"],
  ["확대", "zoom_in"],
  ["축소", "zoom_out"],
  ["검색", "search"],
  ["정렬", "sort"],
  ["거리순", "sort_distance"],
  ["가성비순", "sort_value"],
  ["카테고리", "category"],
  ["상세", "open_detail"],
  ["방문완료", "visit_complete"],
  ["방문 완료", "visit_complete"],
  ["공유", "share"],
  ["리뷰", "review"],
  ["제보", "report"],
  ["글쓰기", "write"],
  ["게시", "publish"],
  ["등록", "submit"],
  ["참여", "participate"],
  ["찜", "favorite"],
  ["좋아요", "like"],
  ["저장", "save"],
  ["댓글", "comment"],
  ["사진", "photo"],
  ["위치", "location"],
  ["리스트", "list"],
  ["번개", "lightning_course"],
  ["설정", "settings"],
  ["로그아웃", "logout"],
  ["삭제", "delete"],
  ["수정", "edit"],
  ["소비", "spending"],
  ["금액", "amount"],
  ["전체", "all"],
];

const classActionAliases = [
  ["current-location", "my_location"],
  ["zoom-in", "zoom_in"],
  ["zoom-out", "zoom_out"],
  ["search-filter", "sort"],
  ["category", "category"],
  ["bottom-nav", "nav"],
  ["heart", "favorite"],
  ["like", "like"],
  ["share", "share"],
  ["buy", "participate"],
  ["posting", "write"],
  ["comment", "comment"],
  ["review", "review"],
  ["report", "report"],
  ["back", "back"],
  ["close", "close"],
  ["login", "login"],
  ["signup", "signup"],
  ["popup", "popup"],
  ["card", "open_detail"],
];

function normalizeIdPart(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, " ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 44);
}

function getReadableSource(element) {
  const explicitLabel =
    element.dataset.label ||
    element.dataset.gtmLabel ||
    element.dataset.action ||
    element.getAttribute("aria-label") ||
    element.getAttribute("title");
  if (explicitLabel) return explicitLabel;

  const text = element.textContent?.replace(/\s+/g, " ").trim();
  if (text) return text;

  const imgAlt = element.querySelector?.("img[alt]")?.getAttribute("alt");
  if (imgAlt) return imgAlt;

  return element.className || element.tagName.toLowerCase();
}

function translateAction(value) {
  const raw = String(value || "").toLowerCase();
  const normalized = normalizeIdPart(raw);
  if (normalized) return normalized;

  const matchedKorean = koreanActionAliases.find(([keyword]) => raw.includes(keyword));
  if (matchedKorean) return matchedKorean[1];

  const matchedClass = classActionAliases.find(([keyword]) => raw.includes(keyword));
  if (matchedClass) return matchedClass[1];

  return "";
}

function resolvePage(pageName) {
  const pageFromShell =
    document.querySelector(".app-shell")?.dataset.pageName ||
    document.querySelector(".app-shell")?.dataset.pageId;
  return normalizeIdPart(pageFromShell || pageName) || "unknown_page";
}

function resolveSection(element) {
  const explicitSection =
    element.dataset.section ||
    element.dataset.gtmSection ||
    element.closest("[data-section]")?.dataset.section ||
    element.closest("[data-gtm-section]")?.dataset.gtmSection;
  if (explicitSection) return normalizeIdPart(explicitSection) || "main";

  const sectionNode = element.closest("header, nav, footer, section, article, form, aside");
  const className = String(sectionNode?.className || element.className || "").toLowerCase();
  const knownSection = [
    ["bottom-nav", "bottom_nav"],
    ["header", "header"],
    ["gnb", "header"],
    ["search", "search"],
    ["category", "category"],
    ["popup", "popup"],
    ["sheet", "sheet"],
    ["card", "card"],
    ["comment", "comment"],
    ["action", "action_buttons"],
    ["form", "form"],
    ["nav", "navigation"],
  ].find(([keyword]) => className.includes(keyword));

  return knownSection?.[1] || normalizeIdPart(sectionNode?.className || "main") || "main";
}

function resolveAction(element) {
  const explicitAction = element.dataset.action || element.dataset.gtmAction;
  if (explicitAction) return normalizeIdPart(explicitAction) || "click";

  const sources = [
    element.id,
    element.getAttribute("aria-label"),
    element.getAttribute("title"),
    element.textContent,
    element.className,
    element.querySelector?.("img[alt]")?.getAttribute("alt"),
  ].filter(Boolean);

  for (const source of sources) {
    const action = translateAction(source);
    if (action) return action;
  }

  return "click";
}

function resolveLabel(element, action) {
  const explicitLabel = element.dataset.label || element.dataset.gtmLabel;
  if (explicitLabel) return normalizeIdPart(explicitLabel) || action;

  const translated = translateAction(getReadableSource(element));
  return translated || action;
}

function assignClickIds(pageName) {
  const normalizedPage = resolvePage(pageName);
  const counters = new Map();

  document.querySelectorAll(clickableSelector).forEach((element) => {
    if (element.disabled || element.getAttribute("aria-disabled") === "true") return;

    const section = resolveSection(element);
    const action = resolveAction(element);
    const label = resolveLabel(element, action);
    const key = `${normalizedPage}-${section}-${action}`;
    const nextIndex = (counters.get(key) || 0) + 1;
    counters.set(key, nextIndex);
    const suffix = nextIndex > 1 ? `-${String(nextIndex).padStart(2, "0")}` : "";

    if (!element.id) {
      element.id = `btn-${key}${suffix}`;
      element.dataset.gtmAutoId = "true";
    }

    if (!element.dataset.event) element.dataset.event = `click_${action}`;
    if (!element.dataset.page) element.dataset.page = normalizedPage;
    if (!element.dataset.section) element.dataset.section = section;
    if (!element.dataset.action) element.dataset.action = action;
    if (!element.dataset.label) element.dataset.label = label;
  });
}

export function installGtmClickIds(pageName) {
  assignClickIds(pageName);

  const observer = new MutationObserver(() => {
    window.requestAnimationFrame(() => assignClickIds(pageName));
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
}
