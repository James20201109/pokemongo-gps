const librarySource = window.coordinateLibraries;
const eventSource = window.coordinateEvents || {};
const friendDirectory = window.friendDirectory || [];
const countryNames = {
  adidas: "POKÉMON GO × ADIDAS",
  events: "GLOBAL EVENT ARTICLES",
  friends: "STATIC FRIEND DIRECTORY",
  lego: "LEGO GLOBAL EVENT",
  indonesia: "INDONESIA LIMITED EVENT",
  pokexciting: "POKÉXCITING ASIA TOUR",
  india: "INDIA LIMITED EVENT",
  spain: "SPAIN LIMITED EVENT",
  asiaLimited: "ASIA LIMITED EVENT",
  europe: "EUROPE MUSEUM EVENT",
  copied: "COPIED COORDINATES",
  japan: "JAPAN",
  korea: "KOREA",
  uk: "UNITED KINGDOM",
  us: "UNITED STATES",
  hot2026: "GLOBAL HOTSPOTS 2026",
  hot2025: "GLOBAL HOTSPOTS 2025",
  raid: "GLOBAL RAID CLOCK"
};

const elements = {
  tabs: [...document.querySelectorAll(".country-tab")],
  friendsTab: document.querySelector('[data-country="friends"]'),
  articleTabs: document.querySelector("#article-country-tabs"),
  articleTabZone: document.querySelector("#article-tab-zone"),
  activeTabs: document.querySelector("#active-country-tabs"),
  expiredTabs: document.querySelector("#expired-country-tabs"),
  expiredTabZone: document.querySelector("#expired-tab-zone"),
  expiredTabCount: document.querySelector("#expired-tab-count"),
  search: document.querySelector("#search-input"),
  clearSearch: document.querySelector("#clear-search"),
  copyAll: document.querySelector("#copy-all"),
  shareView: document.querySelector("#share-view"),
  clearCopied: document.querySelector("#clear-copied"),
  copiedCount: document.querySelector("#copied-count"),
  copiedTabCount: document.querySelector("#copied-tab-count"),
  library: document.querySelector("#coordinate-library"),
  empty: document.querySelector("#empty-state"),
  emptyTitle: document.querySelector("#empty-title"),
  emptyDescription: document.querySelector("#empty-description"),
  totalCount: document.querySelector("#total-count"),
  visibleCount: document.querySelector("#visible-count"),
  resultCount: document.querySelector("#result-count"),
  groupCount: document.querySelector("#group-count"),
  countryLabel: document.querySelector("#country-label"),
  eventBanner: document.querySelector("#country-event-banner"),
  eventLabel: document.querySelector("#country-event-label"),
  eventTitle: document.querySelector("#country-event-title"),
  eventPeriod: document.querySelector("#country-event-period"),
  eventDescription: document.querySelector("#country-event-description"),
  eventSourceLink: document.querySelector("#country-event-source"),
  converterForm: document.querySelector("#converter-form"),
  coordInput: document.querySelector("#coord-input"),
  converterOutput: document.querySelector("#converter-output"),
  toast: document.querySelector("#toast"),
  toastTitle: document.querySelector("#toast-title"),
  toastLabel: document.querySelector("#toast-label"),
  toastUndo: document.querySelector("#toast-undo"),
  officialSitesOpen: document.querySelector("#official-sites-open"),
  officialSitesModal: document.querySelector("#official-sites-modal"),
  officialSitesClose: document.querySelector("#official-sites-close"),
  imageModal: document.querySelector("#image-modal"),
  imageModalContent: document.querySelector("#image-modal-content"),
  imageModalCaption: document.querySelector("#image-modal-caption"),
  imageModalClose: document.querySelector("#image-modal-close"),
  friendQrModal: document.querySelector("#friend-qr-modal"),
  friendQrClose: document.querySelector("#friend-qr-close"),
  friendQrTitle: document.querySelector("#friend-qr-title"),
  friendQrCanvas: document.querySelector("#friend-qr-canvas"),
  friendQrCode: document.querySelector("#friend-qr-code"),
  friendQrCopy: document.querySelector("#friend-qr-copy"),
  trashFilterOpen: document.querySelector("#trash-filter-open"),
  trashFilterModal: document.querySelector("#trash-filter-modal"),
  trashFilterClose: document.querySelector("#trash-filter-close"),
  trashFilterContent: document.querySelector("#trash-filter-content"),
  trashFilterCopy: document.querySelector("#trash-filter-copy"),
  newsOpen: document.querySelector("#news-open"),
  newsModal: document.querySelector("#news-modal"),
  newsClose: document.querySelector("#news-close"),
  newsSections: document.querySelector("#news-sections"),
  sparkleAlertOpen: document.querySelector("#sparkle-alert-open"),
  sparkleAlertModal: document.querySelector("#sparkle-alert-modal"),
  sparkleAlertClose: document.querySelector("#sparkle-alert-close"),
  sparkleAlertSave: document.querySelector("#sparkle-alert-save"),
  sparkleAlertEnabled: document.querySelector("#sparkle-alert-enabled"),
  sparkleAlertCount: document.querySelector("#sparkle-alert-count"),
  gymCounterOpen: document.querySelector("#gym-counter-open"),
  gymCounterModal: document.querySelector("#gym-counter-modal"),
  gymCounterClose: document.querySelector("#gym-counter-close"),
  gymCounterBadge: document.querySelector("#gym-counter-badge"),
  gymCounterTotal: document.querySelector("#gym-counter-total"),
  gymCounterNormal: document.querySelector("#gym-counter-normal"),
  gymCounterShiny: document.querySelector("#gym-counter-shiny"),
  gymCounterNormalBackground: document.querySelector("#gym-counter-normal-background"),
  gymCounterShinyBackground: document.querySelector("#gym-counter-shiny-background"),
  gymCounterPerfectIv: document.querySelector("#gym-counter-perfect-iv"),
  gymCounterFeedback: document.querySelector("#gym-counter-feedback"),
  gymCounterUndo: document.querySelector("#gym-counter-undo"),
  gymCounterReset: document.querySelector("#gym-counter-reset"),
  backToTop: document.querySelector("#back-to-top")
};

let activeCountry = "copied";
let pendingSharedGroup = "";
let visibleCoordinates = [];
let visibleCoordinateKeys = [];
let toastTimer;
let pendingUndoKey = null;
let pendingUndoLabel = "";
let pendingRemovalKey = null;
let pendingRemovalButton = null;
let pendingRemovalTimer = null;
const sparkleAlertStorageKey = "geo-pulse-sparkle-alert-v1";
const sparkleAlertHistoryKey = "geo-pulse-sparkle-alert-history-v1";
const copiedStorageKey = "geo-pulse-copied-coordinates-v1";
const activeTabStorageKey = "geo-pulse-active-tab-v1";
const friendsUnlockedStorageKey = "geo-pulse-friends-unlocked-v1";
const expandedGroupsStorageKey = "geo-pulse-expanded-groups-v1";
const gymCounterStorageKey = "geo-pulse-gym-counter-v1";
let friendsUnlocked = false;
let friendUnlockClicks = 0;
let friendUnlockTimer;
const gymCounterLabels = {
  normal: "普色",
  shiny: "純異色",
  normalBackground: "普色背卡",
  shinyBackground: "異色背卡",
  perfectIv: "IV100"
};
const gymCounterTotalKeys = ["normal", "shiny", "normalBackground", "shinyBackground"];
const collapsibleJapanGroups = new Set([
  "北海道", "青森", "岩手", "宮城", "秋田", "山形", "福島",
  "茨城", "栃木", "埼玉", "千葉", "東京", "東京 v2", "神奈川",
  "新潟", "富山", "石川", "福井", "岐阜", "靜岡", "愛知", "三重",
  "滋賀", "京都", "大阪", "兵庫", "奈良", "和歌山", "鳥取", "島根",
  "岡山", "山口", "德島", "香川", "愛媛", "高知", "福岡", "佐賀",
  "長崎", "宮崎", "鹿兒島", "沖繩", "棒球相關活動"
]);
const stampedJapanGroups = new Set(
  [...collapsibleJapanGroups].filter((name) => name !== "棒球相關活動").concat("日本蓋章", "長崎蓋章")
);

function loadExpandedGroups() {
  try {
    const saved = JSON.parse(localStorage.getItem(expandedGroupsStorageKey) || "[]");
    return new Set(Array.isArray(saved) ? saved : []);
  } catch {
    return new Set();
  }
}

const expandedGroups = loadExpandedGroups();

function saveExpandedGroups() {
  try {
    localStorage.setItem(expandedGroupsStorageKey, JSON.stringify([...expandedGroups]));
  } catch {
    // 瀏覽器禁止儲存時，仍保留本次頁面開啟期間的展開狀態。
  }
}

function loadCopiedKeys() {
  try {
    const saved = JSON.parse(localStorage.getItem(copiedStorageKey) || "[]");
    return new Set(Array.isArray(saved) ? saved : []);
  } catch {
    return new Set();
  }
}

const copiedKeys = loadCopiedKeys();

function loadGymCounter() {
  const empty = { normal: 0, shiny: 0, normalBackground: 0, shinyBackground: 0, perfectIv: 0, history: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(gymCounterStorageKey) || "null");
    if (!saved || typeof saved !== "object") return empty;
    Object.keys(gymCounterLabels).forEach((key) => {
      const value = Number(saved[key]);
      empty[key] = Number.isInteger(value) && value >= 0 ? value : 0;
    });
    empty.history = Array.isArray(saved.history)
      ? saved.history.filter((item) => gymCounterLabels[item?.key] && [1, -1].includes(item.delta)).slice(-100)
      : [];
    return empty;
  } catch {
    return empty;
  }
}

const gymCounter = loadGymCounter();
let gymCounterResetArmed = false;
let gymCounterResetTimer;

function gymCounterTotal() {
  return gymCounterTotalKeys.reduce((total, key) => total + gymCounter[key], 0);
}

function saveGymCounter() {
  try {
    localStorage.setItem(gymCounterStorageKey, JSON.stringify(gymCounter));
  } catch {
    // 瀏覽器禁止儲存時，計數器仍可在本次頁面開啟期間使用。
  }
}

function renderGymCounter(message = "") {
  const total = gymCounterTotal();
  elements.gymCounterTotal.textContent = total.toLocaleString("zh-TW");
  elements.gymCounterBadge.textContent = total > 999 ? "999+" : String(total);
  elements.gymCounterNormal.textContent = gymCounter.normal.toLocaleString("zh-TW");
  elements.gymCounterShiny.textContent = gymCounter.shiny.toLocaleString("zh-TW");
  elements.gymCounterNormalBackground.textContent = gymCounter.normalBackground.toLocaleString("zh-TW");
  elements.gymCounterShinyBackground.textContent = gymCounter.shinyBackground.toLocaleString("zh-TW");
  elements.gymCounterPerfectIv.textContent = gymCounter.perfectIv.toLocaleString("zh-TW");
  elements.gymCounterUndo.disabled = gymCounter.history.length === 0;
  elements.gymCounterModal.querySelectorAll("[data-counter-key]").forEach((row) => {
    row.querySelector('[data-counter-change="-1"]').disabled = gymCounter[row.dataset.counterKey] === 0;
  });
  if (message) elements.gymCounterFeedback.textContent = message;
}

function changeGymCounter(key, delta, recordHistory = true) {
  if (!gymCounterLabels[key] || ![1, -1].includes(delta)) return;
  if (delta < 0 && gymCounter[key] === 0) return;
  gymCounter[key] += delta;
  if (recordHistory) gymCounter.history.push({ key, delta });
  gymCounter.history = gymCounter.history.slice(-100);
  saveGymCounter();
  const verb = delta > 0 ? "新增" : "減少";
  renderGymCounter(`${verb}：${gymCounterLabels[key]} · ${gymCounter[key]}`);
}

function openGymCounterModal() {
  renderGymCounter();
  if (typeof elements.gymCounterModal.showModal === "function") {
    elements.gymCounterModal.showModal();
  } else {
    elements.gymCounterModal.setAttribute("open", "");
  }
}

function closeGymCounterModal() {
  elements.gymCounterModal.close?.();
  elements.gymCounterModal.removeAttribute("open");
}

function undoGymCounter() {
  const last = gymCounter.history.pop();
  if (!last) return;
  gymCounter[last.key] = Math.max(0, gymCounter[last.key] - last.delta);
  saveGymCounter();
  renderGymCounter(`已復原：${gymCounterLabels[last.key]}`);
}

function resetGymCounter() {
  if (!gymCounterResetArmed) {
    gymCounterResetArmed = true;
    elements.gymCounterReset.textContent = "再次點擊確認重置";
    elements.gymCounterReset.classList.add("confirming");
    elements.gymCounterFeedback.textContent = "請再次點擊重置按鈕確認清除全部紀錄";
    clearTimeout(gymCounterResetTimer);
    gymCounterResetTimer = setTimeout(() => {
      gymCounterResetArmed = false;
      elements.gymCounterReset.textContent = "重置全部";
      elements.gymCounterReset.classList.remove("confirming");
    }, 4000);
    return;
  }
  clearTimeout(gymCounterResetTimer);
  Object.keys(gymCounterLabels).forEach((key) => { gymCounter[key] = 0; });
  gymCounter.history = [];
  gymCounterResetArmed = false;
  elements.gymCounterReset.textContent = "重置全部";
  elements.gymCounterReset.classList.remove("confirming");
  saveGymCounter();
  renderGymCounter("全部紀錄已重置");
}

function saveCopiedKeys() {
  try {
    localStorage.setItem(copiedStorageKey, JSON.stringify([...copiedKeys]));
  } catch {
    // 頁面仍可使用；瀏覽器禁止儲存時只保留本次開啟期間的狀態。
  }
}

function updateCopiedCounter() {
  elements.copiedCount.textContent = copiedKeys.size;
  elements.copiedTabCount.textContent = copiedKeys.size;
  elements.clearCopied.disabled = copiedKeys.size === 0;
}

const libraries = {
  adidas: librarySource.adidas,
  events: librarySource.events,
  friends: [],
  lego: librarySource.lego,
  indonesia: librarySource.indonesia,
  pokexciting: librarySource.pokexciting,
  india: librarySource.india,
  spain: librarySource.spain,
  asiaLimited: librarySource.asiaLimited,
  europe: librarySource.europe,
  japan: librarySource.japan,
  korea: librarySource.korea,
  uk: librarySource.uk,
  us: librarySource.us,
  hot2026: librarySource.hot2026,
  hot2025: librarySource.hot2025,
  raid: librarySource.raid
};

function loadFriendsUnlocked() {
  try {
    return localStorage.getItem(friendsUnlockedStorageKey) === "1";
  } catch {
    return false;
  }
}

friendsUnlocked = loadFriendsUnlocked();

function loadActiveCountry() {
  const params = new URLSearchParams(window.location.search);
  const sharedCountry = params.get("tab") || "";
  const validSharedCountry = sharedCountry === "copied" || Object.hasOwn(libraries, sharedCountry);
  if (validSharedCountry && sharedCountry === "friends" && !friendsUnlocked) {
    const safeUrl = new URL(window.location.href);
    safeUrl.searchParams.set("tab", "copied");
    safeUrl.searchParams.delete("group");
    window.history.replaceState(null, "", safeUrl);
    return "copied";
  }
  if (validSharedCountry && (sharedCountry !== "friends" || friendsUnlocked)) {
    pendingSharedGroup = params.get("group") || "";
    return sharedCountry;
  }
  try {
    const saved = localStorage.getItem(activeTabStorageKey);
    if (saved === "friends" && !friendsUnlocked) return "copied";
    return saved && (saved === "copied" || Object.hasOwn(libraries, saved)) ? saved : "copied";
  } catch {
    return "copied";
  }
}

activeCountry = loadActiveCountry();

function coordinateValue(coordinate) {
  return typeof coordinate === "string" ? coordinate : coordinate.value;
}

function coordinateKey(country, groupName, coordinate) {
  const name = typeof coordinate === "object" ? coordinate.name : "";
  return `${country}|${groupName}|${name}|${coordinateValue(coordinate)}`;
}

function normalizedTrainerCode(code = "") {
  return String(code).replace(/\D/g, "").slice(0, 12);
}

function formattedTrainerCode(code = "") {
  const normalized = normalizedTrainerCode(code);
  return normalized.length === 12 ? normalized.replace(/(\d{4})(?=\d)/g, "$1 ") : "尚未提供訓練家編號";
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isExpired(endDate) {
  if (!endDate) return false;
  return Date.now() > new Date(`${endDate}T23:59:59`).getTime();
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function taipeiMinutes(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Taipei",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return Number(values.hour) * 60 + Number(values.minute);
}

function isRaidActive(start, end, date = new Date()) {
  if (!start || !end) return false;
  const current = taipeiMinutes(date);
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  return endMinutes <= startMinutes
    ? current >= startMinutes || current < endMinutes
    : current >= startMinutes && current < endMinutes;
}

function localTime(timeZone, date = new Date()) {
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      timeZone,
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).format(date);
  } catch {
    return "--:--";
  }
}

function localMinutes(timeZone, date = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return Number(values.hour) * 60 + Number(values.minute);
  } catch {
    return -1;
  }
}

function raidTimeStatus(timeZone, date = new Date()) {
  const current = localMinutes(timeZone, date);
  if (current >= 14 * 60 && current < 17 * 60) return "peak";
  if (current >= 9 * 60 && current < 21 * 60) return "open";
  return "closed";
}

function raidCountdown(timeZone, date = new Date()) {
  const current = localMinutes(timeZone, date);
  const startMinutes = 9 * 60;
  const endMinutes = 21 * 60 + 30;
  if (current < startMinutes || current >= endMinutes) return "0";
  const remainingHalfHours = Math.ceil((endMinutes - current) / 30);
  const remainingHours = remainingHalfHours * 0.5;
  return Number.isInteger(remainingHours) ? String(remainingHours) : remainingHours.toFixed(1);
}

function moonlightStatus(timeZone, date = new Date()) {
  const current = localMinutes(timeZone, date);
  if (current < 0) return "idle";
  const starts = [12 * 60, 13 * 60, 19 * 60, 20 * 60];
  if (starts.some((start) => current >= start && current < start + 5)) return "live";
  if (starts.some((start) => current >= start - 10 && current < start)) return "soon";
  return "idle";
}

function sparkleStatus(timeZone, date = new Date()) {
  const current = localMinutes(timeZone, date);
  if (current < 0) return "idle";
  const starts = [18 * 60, 18 * 60 + 30, 19 * 60, 19 * 60 + 30];
  if (starts.some((start) => current >= start && current < start + 5)) return "live";
  if (starts.some((start) => current >= start - 10 && current < start)) return "soon";
  return "idle";
}

function loadSparkleAlertEnabled() {
  try {
    return localStorage.getItem(sparkleAlertStorageKey) === "true";
  } catch {
    return false;
  }
}

function loadSparkleAlertHistory() {
  try {
    const values = JSON.parse(localStorage.getItem(sparkleAlertHistoryKey) || "[]");
    return new Set(Array.isArray(values) ? values : []);
  } catch {
    return new Set();
  }
}

let sparkleAlertEnabled = loadSparkleAlertEnabled();
let sparkleAlertHistory = loadSparkleAlertHistory();

function zonedDateKey(timeZone, date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function sparkleAlertOccurrence(date = new Date()) {
  const timeZone = "Asia/Kolkata";
  const dateKey = zonedDateKey(timeZone, date);
  if (dateKey < "2026-11-06" || dateKey > "2026-11-08") return null;
  const current = localMinutes(timeZone, date);
  const starts = [18 * 60, 18 * 60 + 30, 19 * 60, 19 * 60 + 30];
  const start = starts.find((value) => current >= value - 10 && current < value + 5);
  if (start === undefined) return null;
  const time = `${String(Math.floor(start / 60)).padStart(2, "0")}:${String(start % 60).padStart(2, "0")}`;
  return {
    key: `${dateKey}|${time}`,
    time,
    state: current < start ? "即將開始" : "活動進行中"
  };
}

function updateSparkleAlertButton() {
  elements.sparkleAlertCount.textContent = sparkleAlertEnabled ? "1" : "0";
  elements.sparkleAlertOpen.classList.toggle("enabled", sparkleAlertEnabled);
}

function openSparkleAlertModal() {
  elements.sparkleAlertEnabled.checked = sparkleAlertEnabled;
  if (typeof elements.sparkleAlertModal.showModal === "function") elements.sparkleAlertModal.showModal();
  else elements.sparkleAlertModal.setAttribute("open", "");
}

function closeSparkleAlertModal() {
  elements.sparkleAlertModal.close?.();
  elements.sparkleAlertModal.removeAttribute("open");
}

function saveSparkleAlert() {
  sparkleAlertEnabled = elements.sparkleAlertEnabled.checked;
  try {
    localStorage.setItem(sparkleAlertStorageKey, String(sparkleAlertEnabled));
  } catch {
    // 無法使用儲存空間時，仍保留本次瀏覽期間設定。
  }
  updateSparkleAlertButton();
  closeSparkleAlertModal();
  checkSparkleAlert();
}

function checkSparkleAlert(date = new Date()) {
  if (!sparkleAlertEnabled) return;
  const occurrence = sparkleAlertOccurrence(date);
  if (!occurrence || sparkleAlertHistory.has(occurrence.key)) return;
  sparkleAlertHistory.add(occurrence.key);
  if (sparkleAlertHistory.size > 24) sparkleAlertHistory = new Set([...sparkleAlertHistory].slice(-16));
  try {
    localStorage.setItem(sparkleAlertHistoryKey, JSON.stringify([...sparkleAlertHistory]));
  } catch {
    // 儲存失敗時，仍避免在本次瀏覽期間重複提醒。
  }
  window.alert(`Sparkle O’Clock 活動提醒\n\n印度｜${occurrence.time}｜${occurrence.state}\n洛迪花園：28.592900, 77.220600`);
}

function allCoordinates() {
  return Object.values(libraries).flatMap((groups) => groups.flatMap((group) => group.coordinates));
}

function copiedGroups() {
  const groups = [];
  Object.entries(libraries).forEach(([country, countryGroups]) => {
    countryGroups.forEach((group) => {
      const coordinates = group.coordinates.flatMap((coordinate) => {
        const key = coordinateKey(country, group.name, coordinate);
        if (!copiedKeys.has(key)) return [];
        const copiedCoordinate = typeof coordinate === "string"
          ? { name: group.name, area: group.region || countryNames[country], value: coordinate }
          : { ...coordinate };
        copiedCoordinate._copiedKey = key;
        return [copiedCoordinate];
      });
      if (!coordinates.length) return;
      groups.push({
        region: `${countryNames[country]} · ${group.region || "座標資料"}`,
        name: group.name,
        coordinates,
        endDate: group.event?.endDate || eventSource[country]?.endDate
      });
    });
  });
  return groups;
}

async function copyText(text, label) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  pendingUndoKey = null;
  elements.toast.classList.remove("undoable");
  elements.toastUndo.hidden = true;
  elements.toastTitle.textContent = "COPIED";
  elements.toastLabel.textContent = label;
  elements.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 1800);
}

function shareUrl(country, group = "") {
  const url = new URL(window.location.href);
  url.searchParams.set("tab", country);
  if (group) url.searchParams.set("group", group);
  else url.searchParams.delete("group");
  url.hash = "";
  return url.toString();
}

function updateShareUrl(country, group = "") {
  if (country === "friends") return;
  window.history.replaceState(null, "", shareUrl(country, group));
}

async function shareLink(country, group = "") {
  const title = group ? `${group}｜Pokémon GO 資訊` : `${countryNames[country]}｜Pokémon GO 資訊`;
  const url = shareUrl(country, group);
  if (navigator.share) {
    try {
      await navigator.share({ title, text: group ? `開啟「${group}」區塊` : "開啟這個座標頁籤", url });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }
  await copyText(url, group ? `${group} 分享網址` : "頁籤分享網址");
}

function focusSharedGroup(groupName) {
  if (!groupName) return;
  requestAnimationFrame(() => {
    const target = [...elements.library.querySelectorAll(".region-block")]
      .find((section) => section.dataset.shareId === groupName);
    if (!target) return;
    const archive = target.closest(".completed-events");
    if (archive) archive.open = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    target.classList.add("share-target");
    window.setTimeout(() => target.classList.remove("share-target"), 2400);
  });
}

function offerUndo(key, label) {
  pendingUndoKey = key;
  pendingUndoLabel = label;
  elements.toastTitle.textContent = "紀錄已移除";
  elements.toastLabel.textContent = "2 秒內點擊此處還原";
  elements.toastUndo.hidden = false;
  elements.toast.classList.add("show", "undoable");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    pendingUndoKey = null;
    elements.toast.classList.remove("show", "undoable");
    elements.toastUndo.hidden = true;
  }, 2000);
}

function restorePendingUndo() {
  if (!pendingUndoKey) return;
  copiedKeys.add(pendingUndoKey);
  saveCopiedKeys();
  pendingUndoKey = null;
  elements.toast.classList.remove("undoable");
  elements.toastUndo.hidden = true;
  elements.toastTitle.textContent = "已還原";
  elements.toastLabel.textContent = pendingUndoLabel;
  updateCopiedCounter();
  render();
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 1200);
}

function cancelRemovalConfirmation() {
  clearTimeout(pendingRemovalTimer);
  pendingRemovalButton?.classList.remove("confirm-remove");
  pendingRemovalKey = null;
  pendingRemovalButton = null;
}

function armRemovalConfirmation(key, button, label) {
  cancelRemovalConfirmation();
  pendingRemovalKey = key;
  pendingRemovalButton = button;
  button.classList.add("confirm-remove");
  elements.toastTitle.textContent = "再次點擊以移除";
  elements.toastLabel.textContent = `${label} · 1.5 秒內連續點擊`;
  elements.toast.classList.add("show");
  clearTimeout(toastTimer);
  pendingRemovalTimer = setTimeout(() => {
    cancelRemovalConfirmation();
    elements.toast.classList.remove("show");
  }, 1500);
}

function openImageModal(image, alt, caption) {
  elements.imageModalContent.src = image;
  elements.imageModalContent.alt = alt;
  elements.imageModalCaption.textContent = caption;
  if (typeof elements.imageModal.showModal === "function") {
    elements.imageModal.showModal();
  } else {
    elements.imageModal.setAttribute("open", "");
  }
}

function openOfficialSitesModal() {
  if (typeof elements.officialSitesModal.showModal === "function") {
    elements.officialSitesModal.showModal();
  } else {
    elements.officialSitesModal.setAttribute("open", "");
  }
}

function closeOfficialSitesModal() {
  if (typeof elements.officialSitesModal.close === "function") elements.officialSitesModal.close();
  else elements.officialSitesModal.removeAttribute("open");
}

function closeImageModal() {
  elements.imageModal.close?.();
  elements.imageModal.removeAttribute("open");
}

function openTrashFilterModal() {
  if (typeof elements.trashFilterModal.showModal === "function") {
    elements.trashFilterModal.showModal();
  } else {
    elements.trashFilterModal.setAttribute("open", "");
  }
}

function closeTrashFilterModal() {
  elements.trashFilterModal.close?.();
  elements.trashFilterModal.removeAttribute("open");
}

function eventStartDate(event) {
  if (event.startDate) return event.startDate;
  const match = event.period?.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
  if (!match) return "";
  return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
}

function eventTimeValue(date, endOfDay = false) {
  if (!date) return NaN;
  return new Date(`${date}T${endOfDay ? "23:59:59" : "00:00:00"}+08:00`).getTime();
}

function eventNewsStatus(event, now = Date.now()) {
  if (event.periods?.length) {
    const periods = event.periods
      .map((period) => ({ start: Date.parse(period.startDateTime), end: Date.parse(period.endDateTime) }))
      .filter((period) => Number.isFinite(period.start) && Number.isFinite(period.end));
    if (periods.some((period) => now >= period.start && now <= period.end)) return "active";
    if (periods.some((period) => now < period.start)) return "upcoming";
    if (periods.length) return "expired";
  }
  const start = event.startDateTime ? Date.parse(event.startDateTime) : eventTimeValue(eventStartDate(event));
  const end = event.endDateTime ? Date.parse(event.endDateTime) : eventTimeValue(event.endDate, true);
  if (Number.isFinite(end) && now > end) return "expired";
  if (Number.isFinite(start) && now < start) return "upcoming";
  return "active";
}

function libraryIsExpired(country) {
  if (["copied", "hot2026", "hot2025", "raid"].includes(country)) return false;
  const countryEvent = eventSource[country];
  if (countryEvent?.endDate) return eventNewsStatus(countryEvent) === "expired";
  const groups = libraries[country] || [];
  return groups.length > 0 && groups.every((group) => {
    const event = group.event || (group.endDate ? { endDate: group.endDate } : null);
    return event?.endDate && eventNewsStatus(event) === "expired";
  });
}

function organizeCountryTabs() {
  let expiredCount = 0;
  elements.tabs.forEach((tab) => {
    const expired = libraryIsExpired(tab.dataset.country);
    tab.classList.toggle("archived-tab", expired);
    if (tab.dataset.country === "events") {
      elements.articleTabs.appendChild(tab);
      elements.articleTabZone.classList.toggle("is-expired", expired);
      return;
    }
    (expired ? elements.expiredTabs : elements.activeTabs).appendChild(tab);
    if (expired) expiredCount += 1;
  });
  elements.expiredTabCount.textContent = String(expiredCount).padStart(2, "0");
  elements.expiredTabZone.hidden = expiredCount === 0;
  if (activeCountry !== "events" && libraryIsExpired(activeCountry)) elements.expiredTabZone.open = true;
}

function newsItems() {
  const items = [];
  Object.entries(libraries).forEach(([country, groups]) => {
    groups.forEach((group) => {
      if (!group.event?.endDate) return;
      items.push({
        country,
        groupName: group.name,
        region: group.region,
        title: group.name,
        period: group.event.period || group.event.endDate,
        event: group.event
      });
    });
  });
  Object.entries(eventSource).forEach(([country, event]) => {
    if (!event?.endDate) return;
    items.push({ country, groupName: "", region: countryNames[country], title: event.title, period: event.period, event });
  });
  return items;
}

function navigateToNewsItem(item) {
  closeNewsModal();
  elements.search.value = "";
  const groupKey = item.groupName ? `${item.country}|${item.groupName}` : "";
  if (item.country === "japan" && collapsibleJapanGroups.has(item.groupName)) {
    expandedGroups.add(groupKey);
    saveExpandedGroups();
  }
  switchCountry(item.country);
  requestAnimationFrame(() => {
    const target = groupKey
      ? [...document.querySelectorAll(".region-block")].find((section) => section.dataset.groupKey === groupKey)
      : elements.eventBanner;
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    target.classList.add("news-target");
    setTimeout(() => target.classList.remove("news-target"), 1900);
  });
}

function renderNews() {
  const categories = [
    { key: "active", title: "活動期間", label: "LIVE" },
    { key: "upcoming", title: "活動將近", label: "UPCOMING" },
    { key: "expired", title: "已過期", label: "EXPIRED" }
  ];
  const items = newsItems().map((item) => ({ ...item, status: eventNewsStatus(item.event) }));
  const fragment = document.createDocumentFragment();
  categories.forEach((category) => {
    const categoryItems = items.filter((item) => item.status === category.key).sort((a, b) => {
      const aDate = category.key === "upcoming" ? eventTimeValue(eventStartDate(a.event)) : eventTimeValue(a.event.endDate, true);
      const bDate = category.key === "upcoming" ? eventTimeValue(eventStartDate(b.event)) : eventTimeValue(b.event.endDate, true);
      return category.key === "expired" ? bDate - aDate : aDate - bDate;
    });
    const section = document.createElement("section");
    section.className = "news-group";
    section.innerHTML = `<header><h3>${category.title}</h3><span>${String(categoryItems.length).padStart(2, "0")}</span></header>`;
    const list = document.createElement("div");
    list.className = "news-list";
    if (!categoryItems.length) {
      list.innerHTML = `<p class="news-empty">目前沒有活動</p>`;
    } else {
      categoryItems.forEach((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `news-item ${category.key}`;
        button.innerHTML = `<strong>${item.title}</strong><small>${item.region} · ${item.period}</small><em>${category.label} ↗</em>`;
        button.addEventListener("click", () => navigateToNewsItem(item));
        list.appendChild(button);
      });
    }
    section.appendChild(list);
    fragment.appendChild(section);
  });
  elements.newsSections.replaceChildren(fragment);
}

function openNewsModal() {
  renderNews();
  if (typeof elements.newsModal.showModal === "function") {
    elements.newsModal.showModal();
  } else {
    elements.newsModal.setAttribute("open", "");
  }
}

function closeNewsModal() {
  elements.newsModal.close?.();
  elements.newsModal.removeAttribute("open");
}

function makeCoordinateButton(coordinate, index, groupEndDate, key) {
  const value = coordinateValue(coordinate);
  const expired = isExpired(typeof coordinate === "object" ? coordinate.endDate || groupEndDate : groupEndDate);
  const visited = copiedKeys.has(key);
  const raid = typeof coordinate === "object" && coordinate.timezone && activeCountry === "raid";
  const moonlight = typeof coordinate === "object" && coordinate.timezone && coordinate.clockType === "moonlight";
  const sparkle = typeof coordinate === "object" && coordinate.timezone && coordinate.clockType === "sparkle";
  const localClockOnly = typeof coordinate === "object" && coordinate.timezone && coordinate.clockType === "local";
  const nationalTrustImage = activeCountry === "uk" && typeof coordinate === "object" && /^\d{2}\./.test(coordinate.name)
    ? `assets/pokemon_go_national_trust_2026/${coordinate.name}.jpg`
    : "";
  const coordinateImage = typeof coordinate === "object" ? coordinate.image || nationalTrustImage : "";
  const raidTimeState = raid ? raidTimeStatus(coordinate.timezone) : "closed";
  const moonlightTimeState = moonlight && !expired ? moonlightStatus(coordinate.timezone) : "idle";
  const sparkleTimeState = sparkle && !expired ? sparkleStatus(coordinate.timezone) : "idle";
  const button = document.createElement("button");
  button.type = "button";
  button.className = `coordinate-item${typeof coordinate === "object" ? " has-label" : ""}${coordinateImage ? " has-image" : ""}${expired ? " expired" : ""}${visited ? " visited" : ""}${raid ? " raid-card" : ""}${raidTimeState === "peak" ? " raid-active" : ""}${raidTimeState === "open" ? " raid-open" : ""}${moonlight ? " moonlight-card" : ""}${moonlightTimeState === "soon" ? " moonlight-soon" : ""}${moonlightTimeState === "live" ? " moonlight-live" : ""}${sparkle ? " sparkle-card" : ""}${sparkleTimeState === "soon" ? " sparkle-soon" : ""}${sparkleTimeState === "live" ? " sparkle-live" : ""}${localClockOnly ? " local-time-card" : ""}`;
  if (raid) {
    button.dataset.raidStart = coordinate.start;
    button.dataset.raidEnd = coordinate.end;
    button.dataset.timezone = coordinate.timezone;
  }
  if (moonlight) {
    button.dataset.timezone = coordinate.timezone;
    button.style.setProperty("--region-accent", coordinate.accent || "#8fa4ff");
  }
  if (sparkle) {
    button.dataset.timezone = coordinate.timezone;
    button.style.setProperty("--region-accent", coordinate.accent || "#ffb23e");
  }
  if (localClockOnly) button.dataset.timezone = coordinate.timezone;
  const label = typeof coordinate === "object"
    ? `<span class="coordinate-label"><b>${coordinate.name}${raid ? ` <span class="raid-countdown">(${raidCountdown(coordinate.timezone)})</span>` : ""}</b><small>${coordinate.area}</small>${raid || moonlight || sparkle || localClockOnly ? `<small class="local-clock">◷ 當地 ${localTime(coordinate.timezone)}</small>` : ""}</span>`
    : "";
  const status = expired ? `<em class="expired-label">EXPIRED</em>` : "";
  const copiedStatus = `<em class="copied-label">✓ 已複製</em>`;
  const raidStatus = raid ? `<em class="raid-live-label">${raidTimeState === "peak" ? "RAID TIME" : "ACTIVE HOURS"}</em>` : "";
  const moonlightStatusLabel = moonlight ? `<em class="moonlight-status">${moonlightTimeState === "live" ? "EVENT LIVE" : moonlightTimeState === "soon" ? "STARTING SOON" : "LOCAL TIME"}</em>` : "";
  const sparkleStatusLabel = sparkle ? `<em class="sparkle-status">${sparkleTimeState === "live" ? "EVENT LIVE" : sparkleTimeState === "soon" ? "STARTING SOON" : "LOCAL TIME"}</em>` : "";
  const coordinatePreview = coordinateImage
    ? `<img class="coordinate-thumb" src="${coordinateImage}" alt="${coordinate.name} 背景圖片" loading="lazy" title="點擊放大圖片">`
    : "";
  button.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span>${label}<strong>${value}</strong>${coordinatePreview}${status}${copiedStatus}${raidStatus}${moonlightStatusLabel}${sparkleStatusLabel}<i>⧉</i>`;
  button.setAttribute("aria-label", `複製${typeof coordinate === "object" ? ` ${coordinate.name}` : ""}座標 ${value}`);
  button.addEventListener("click", async (event) => {
    if (coordinateImage && event.target.closest(".coordinate-thumb")) {
      openImageModal(coordinateImage, `${coordinate.name} 背景圖片`, `${coordinate.name} · ${coordinate.area}`);
      return;
    }
    const alreadyVisited = copiedKeys.has(key);
    const removingRecord = alreadyVisited && pendingRemovalKey === key;
    if (expired) {
      button.classList.add("selected");
      setTimeout(() => button.classList.remove("selected"), 1200);
    }
    const label = typeof coordinate === "object" ? coordinate.name : value;
    await copyText(value, label);
    if (alreadyVisited && !removingRecord) {
      armRemovalConfirmation(key, button, label);
      return;
    }
    cancelRemovalConfirmation();
    if (removingRecord) {
      copiedKeys.delete(key);
    } else {
      copiedKeys.add(key);
    }
    saveCopiedKeys();
    button.classList.toggle("visited", !removingRecord);
    updateCopiedCounter();
    if (activeCountry === "copied" && removingRecord) render();
    if (removingRecord) offerUndo(key, label);
  });
  return button;
}

let activeFriendQrCode = "";

function closeFriendQrModal() {
  elements.friendQrModal.close();
  activeFriendQrCode = "";
}

function openFriendQr(friend) {
  const code = normalizedTrainerCode(friend.trainerCode);
  if (code.length !== 12) return;
  activeFriendQrCode = code;
  elements.friendQrTitle.textContent = `${friend.nickname} · 好友 QR Code`;
  elements.friendQrCode.textContent = formattedTrainerCode(code);
  const context = elements.friendQrCanvas.getContext("2d");
  context.clearRect(0, 0, elements.friendQrCanvas.width, elements.friendQrCanvas.height);
  if (typeof QRious === "undefined") {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, elements.friendQrCanvas.width, elements.friendQrCanvas.height);
    context.fillStyle = "#111111";
    context.font = "700 14px sans-serif";
    context.textAlign = "center";
    context.fillText("QR CODE LOAD ERROR", 128, 128);
  } else {
    new QRious({
      element: elements.friendQrCanvas,
      value: code,
      size: 256,
      level: "M",
      padding: 16,
      foreground: "#061013",
      background: "#ffffff"
    });
  }
  elements.friendQrModal.showModal();
}

function renderFriends(query) {
  const matches = friendDirectory.filter((friend) => {
    const searchable = [
      friend.nickname,
      friend.trainerCode,
      formattedTrainerCode(friend.trainerCode),
      ...(friend.locations || []).flatMap((location) => [location.name, location.value])
    ].join(" ").toLowerCase();
    return searchable.includes(query);
  });
  const directory = document.createElement("div");
  directory.className = "friend-directory";
  const friendCoordinates = [];
  const friendCoordinateKeys = [];

  matches.forEach((friend, friendIndex) => {
    const code = normalizedTrainerCode(friend.trainerCode);
    const hasCode = code.length === 12;
    const card = document.createElement("article");
    card.className = `friend-card${hasCode ? "" : " missing-code"}`;
    card.innerHTML = `
      <header class="friend-card-head">
        <div><span>${String(friendIndex + 1).padStart(2, "0")} / TRAINER</span><h3>${escapeHtml(friend.nickname)}</h3></div>
        <b class="friend-code-status">${hasCode ? "CODE READY" : "CODE PENDING"}</b>
      </header>
      <section class="friend-code-block">
        <span>TRAINER CODE / 訓練家編號</span>
        <strong class="friend-code${hasCode ? "" : " missing"}">${escapeHtml(formattedTrainerCode(code))}</strong>
        <div class="friend-actions">
          <button class="friend-copy-code" type="button"${hasCode ? "" : " disabled"}>複製編號 <b>⧉</b></button>
          <button class="friend-show-qr" type="button"${hasCode ? "" : " disabled"}>顯示 QR CODE <b>▦</b></button>
        </div>
      </section>
      <section class="friend-location-list">
        <span>REGULAR LOCATIONS / 常用地點</span>
        ${(friend.locations || []).length ? friend.locations.map((location) => `
          <article class="friend-location">
            <div><b>${escapeHtml(location.name)}</b><code>${escapeHtml(location.value)}</code></div>
            <button class="friend-location-copy" type="button" data-coordinate="${escapeHtml(location.value)}" data-label="${escapeHtml(`${friend.nickname} · ${location.name}`)}">複製座標</button>
          </article>`).join("") : '<p class="friend-location-empty">尚未提供常用座標</p>'}
      </section>`;
    card.querySelector(".friend-copy-code")?.addEventListener("click", () => copyText(code, `${friend.nickname} · 好友編號`));
    card.querySelector(".friend-show-qr")?.addEventListener("click", () => openFriendQr(friend));
    card.querySelectorAll(".friend-location-copy").forEach((button) => {
      button.addEventListener("click", () => copyText(button.dataset.coordinate, button.dataset.label));
    });
    (friend.locations || []).forEach((location) => {
      friendCoordinates.push({ name: `${friend.nickname} · ${location.name}`, value: location.value });
      friendCoordinateKeys.push(`friends|${friend.nickname}|${location.name}|${location.value}`);
    });
    directory.appendChild(card);
  });

  elements.library.replaceChildren(directory);
  visibleCoordinates = friendCoordinates;
  visibleCoordinateKeys = friendCoordinateKeys;
  elements.resultCount.textContent = friendCoordinates.length;
  elements.visibleCount.textContent = String(matches.length).padStart(3, "0");
  elements.groupCount.textContent = matches.length;
  elements.countryLabel.textContent = countryNames.friends;
  elements.empty.hidden = matches.length > 0;
  elements.emptyTitle.textContent = "找不到符合的好友";
  elements.emptyDescription.textContent = "請改用暱稱、訓練家編號、地點或座標搜尋。";
  elements.copyAll.disabled = friendCoordinates.length === 0;
  elements.shareView.hidden = true;
  elements.eventBanner.hidden = true;
  updateCopiedCounter();
}

function render() {
  const query = elements.search.value.trim().toLowerCase();
  if (activeCountry === "friends") {
    renderFriends(query);
    return;
  }
  const fragment = document.createDocumentFragment();
  visibleCoordinates = [];
  visibleCoordinateKeys = [];
  let visibleGroups = 0;

  const activeGroups = activeCountry === "copied" ? copiedGroups() : [...libraries[activeCountry]];
  if (activeCountry === "events") {
    activeGroups.sort((a, b) => {
      const aEvent = a.event || {};
      const bEvent = b.event || {};
      const aExpired = eventNewsStatus(aEvent) === "expired";
      const bExpired = eventNewsStatus(bEvent) === "expired";
      if (aExpired !== bExpired) return aExpired ? 1 : -1;
      const aTime = eventTimeValue(eventStartDate(aEvent));
      const bTime = eventTimeValue(eventStartDate(bEvent));
      return aExpired ? bTime - aTime : aTime - bTime;
    });
  }
  const completedEventContent = document.createElement("div");
  completedEventContent.className = "completed-event-content";
  let completedEventCount = 0;
  activeGroups.forEach((group) => {
    const groupMatches = `${group.region} ${group.name}`.toLowerCase().includes(query);
    const matches = (group.coordinates || []).filter((coordinate) => {
      const searchable = typeof coordinate === "string"
        ? coordinate
        : `${coordinate.name} ${coordinate.area} ${coordinate.value}`;
      return groupMatches || searchable.toLowerCase().includes(query);
    });
    if (!matches.length && (!group.event || (query && !groupMatches))) return;

    visibleGroups += 1;
    visibleCoordinates.push(...matches);
    const matchKeys = matches.map((coordinate) =>
      typeof coordinate === "object" && coordinate._copiedKey
        ? coordinate._copiedKey
        : coordinateKey(activeCountry, group.name, coordinate)
    );
    visibleCoordinateKeys.push(...matchKeys);
    const section = document.createElement("section");
    section.className = "region-block";
    const groupShareId = group.shareId || group.name;
    section.dataset.shareId = groupShareId;
    const collapsible = activeCountry === "japan" && collapsibleJapanGroups.has(group.name);
    const groupStateKey = `${activeCountry}|${group.name}`;
    section.dataset.groupKey = groupStateKey;
    const expanded = !collapsible || expandedGroups.has(groupStateKey) || pendingSharedGroup === groupShareId;
    section.classList.toggle("is-collapsed", collapsible && !expanded);
    const region = group.region && group.region !== group.name ? `<span>${group.region}</span>` : "";
    const groupSource = group.sourceUrl
      ? `<a class="group-source" href="${group.sourceUrl}" target="_blank" rel="noopener noreferrer">${group.sourceLabel || "資料來源"} ↗</a>`
      : "";
    const collapseControl = collapsible
      ? `<button class="group-collapse" type="button" aria-expanded="${expanded}" aria-label="${expanded ? "收合" : "展開"}${group.name}座標"><span aria-hidden="true">${expanded ? "−" : "＋"}</span></button>`
      : "";
    const groupStamp = stampedJapanGroups.has(group.name) ? `<span class="group-stamp" aria-hidden="true">蓋</span>` : "";
    const shareControl = activeCountry === "copied"
      ? ""
      : `<button class="group-share" type="button" aria-label="分享${escapeHtml(group.name)}區塊" title="分享此區塊"><span aria-hidden="true">↗</span></button>`;
    section.innerHTML = `<header>${region}${groupStamp}<h3>${group.name}</h3>${collapseControl}${shareControl}${groupSource}<b>${matches.length.toString().padStart(2, "0")}</b></header>`;
    section.querySelector(".group-share")?.addEventListener("click", () => shareLink(activeCountry, groupShareId));
    section.querySelector(".group-collapse")?.addEventListener("click", () => {
      if (expandedGroups.has(groupStateKey)) {
        expandedGroups.delete(groupStateKey);
      } else {
        expandedGroups.add(groupStateKey);
      }
      saveExpandedGroups();
      render();
    });
    if (group.event) {
      const eventInfo = document.createElement("div");
      eventInfo.className = "event-info";
      const detailLabel = group.event.detailLabel || "一星團體戰";
      const detail = group.event.detail || group.event.raid || "";
      const bulletList = group.event.bullets?.length
        ? `<ul>${group.event.bullets.map((item) => `<li>${item}</li>`).join("")}</ul>`
        : detail;
      const notice = group.event.notice
        ? `<p class="event-notice"><b>NOTICE</b>${group.event.notice}</p>`
        : "";
      const eventSources = group.event.sources || (group.event.sourceUrl
        ? [{ url: group.event.sourceUrl, label: group.event.sourceLabel || "查看文獻來源" }]
        : []);
      const sourceLinks = eventSources.map((source) =>
        `<a class="event-source" href="${source.url}" target="_blank" rel="noopener noreferrer">${source.label} <span>↗</span></a>`
      ).join("");
      const sourceLink = sourceLinks ? `<div class="event-source-list">${sourceLinks}</div>` : "";
      const redeemBlock = group.event.redeemCode
        ? `<section class="event-redeem">
            <div><span>${group.event.redeemLabel || "REDEEM CODE"}</span><strong>${group.event.redeemCode}</strong><small>${group.event.redeemReward || ""} · ${group.event.redeemDeadline || ""}</small></div>
            <button class="event-redeem-copy" type="button">複製序號 <b>⧉</b></button>
            ${group.event.redeemUrl ? `<a href="${group.event.redeemUrl}" target="_blank" rel="noopener noreferrer">前往 Web Store <b>↗</b></a>` : ""}
          </section>`
        : "";
      const periodInfo = group.event.period
        ? `<div class="event-period"><span>${group.event.periodLabel || "EVENT PERIOD / 台灣時間"}</span><strong>${group.event.period}</strong></div>`
        : "";
      const stampPeriodInfo = group.event.stampPeriod
        ? `<div class="event-stamp-period"><span>STAMP RALLY / 蓋章活動期間</span><strong>${group.event.stampPeriod}</strong></div>`
        : "";
      const eventImages = group.event.images || (group.event.image ? [{
        src: group.event.image,
        alt: group.event.imageAlt,
        caption: group.event.imageCaption
      }] : []);
      const eventImage = eventImages.length
        ? `<div class="event-image-gallery">${eventImages.map((image, index) => `
            <button class="event-image-trigger${image.wide ? " wide" : ""}" type="button" data-image-index="${index}" aria-label="放大查看 ${image.alt}">
              <img src="${image.src}" alt="${image.alt}" loading="lazy">
              <span>點擊放大 <b>↗</b></span>
            </button>`).join("")}</div>`
        : "";
      eventInfo.innerHTML = `
        ${periodInfo}
        ${stampPeriodInfo}
        <p>${group.event.description}</p>
        <div class="raid-note"><b>★ ${detailLabel}</b>${bulletList}</div>
        ${notice}
        ${redeemBlock}
        ${sourceLink}
        ${eventImage}`;
      eventInfo.querySelector(".event-redeem-copy")?.addEventListener("click", () => {
        copyText(group.event.redeemCode, group.event.redeemLabel || "活動兌換序號");
      });
      eventInfo.querySelectorAll(".event-image-trigger").forEach((trigger) => trigger.addEventListener("click", () => {
        const image = eventImages[Number(trigger.dataset.imageIndex)];
        openImageModal(image.src, image.alt, image.caption);
      }));
      section.appendChild(eventInfo);
    }
    if (matches.length) {
      const grid = document.createElement("div");
      grid.className = "coordinate-grid";
      const groupEndDate = group.event?.endDate || group.endDate || eventSource[activeCountry]?.endDate;
      grid.replaceChildren(...matches.map((coordinate, index) =>
        makeCoordinateButton(coordinate, index, groupEndDate, matchKeys[index])
      ));
      grid.hidden = collapsible && !expanded;
      section.appendChild(grid);
    }
    const completedEvent = activeCountry === "events" && eventNewsStatus(group.event) === "expired";
    if (completedEvent) {
      section.classList.add("completed-event");
      completedEventContent.appendChild(section);
      completedEventCount += 1;
    } else {
      fragment.appendChild(section);
    }
  });

  if (activeCountry === "events") {
    const completedEvents = document.createElement("details");
    completedEvents.className = "completed-events";
    completedEvents.innerHTML = `<summary><span>EVENT ARCHIVE</span><strong>活動結束</strong><b>${String(completedEventCount).padStart(2, "0")}</b></summary>`;
    if (completedEventCount) {
      completedEvents.appendChild(completedEventContent);
    } else {
      completedEventContent.innerHTML = `<p class="completed-events-empty">目前沒有已結束的活動</p>`;
      completedEvents.appendChild(completedEventContent);
    }
    fragment.appendChild(completedEvents);
  }

  elements.library.replaceChildren(fragment);
  elements.resultCount.textContent = visibleCoordinates.length;
  elements.visibleCount.textContent = String(visibleCoordinates.length).padStart(3, "0");
  elements.groupCount.textContent = visibleGroups;
  elements.countryLabel.textContent = countryNames[activeCountry];
  elements.empty.hidden = visibleGroups > 0;
  elements.emptyTitle.textContent = activeCountry === "copied" && copiedKeys.size === 0
    ? "尚未複製任何座標"
    : "找不到符合的座標";
  elements.emptyDescription.textContent = activeCountry === "copied" && copiedKeys.size === 0
    ? "回到其他頁籤點擊座標，紀錄就會出現在這裡。"
    : "請更換搜尋條件。";
  elements.copyAll.disabled = visibleCoordinates.length === 0;
  elements.shareView.hidden = activeCountry === "copied" || activeCountry === "friends";
  updateCopiedCounter();

  const countryEvent = eventSource[activeCountry];
  elements.eventBanner.hidden = !countryEvent;
  if (countryEvent) {
    elements.eventLabel.textContent = countryEvent.label;
    elements.eventTitle.textContent = countryEvent.title;
    elements.eventPeriod.textContent = countryEvent.period;
    elements.eventDescription.textContent = countryEvent.description;
    elements.eventSourceLink.hidden = !countryEvent.sourceUrl;
    if (countryEvent.sourceUrl) {
      elements.eventSourceLink.href = countryEvent.sourceUrl;
      elements.eventSourceLink.firstChild.textContent = `${countryEvent.sourceLabel || "官網來源"} `;
    }
  }
  updateRaidClocks();
  if (pendingSharedGroup) {
    const sharedGroup = pendingSharedGroup;
    pendingSharedGroup = "";
    focusSharedGroup(sharedGroup);
  }
}

function updateRaidClocks() {
  document.querySelectorAll(".raid-card").forEach((card) => {
    const timeState = raidTimeStatus(card.dataset.timezone);
    card.classList.toggle("raid-active", timeState === "peak");
    card.classList.toggle("raid-open", timeState === "open");
    const liveLabel = card.querySelector(".raid-live-label");
    if (liveLabel) liveLabel.textContent = timeState === "peak" ? "RAID TIME" : "ACTIVE HOURS";
    const countdown = card.querySelector(".raid-countdown");
    if (countdown) countdown.textContent = `(${raidCountdown(card.dataset.timezone)})`;
    const clock = card.querySelector(".local-clock");
    if (clock) clock.textContent = `◷ 當地 ${localTime(card.dataset.timezone)}`;
  });
  document.querySelectorAll(".moonlight-card").forEach((card) => {
    if (card.classList.contains("expired")) {
      card.classList.remove("moonlight-soon", "moonlight-live");
      return;
    }
    const timeState = moonlightStatus(card.dataset.timezone);
    card.classList.toggle("moonlight-soon", timeState === "soon");
    card.classList.toggle("moonlight-live", timeState === "live");
    const status = card.querySelector(".moonlight-status");
    if (status) status.textContent = timeState === "live" ? "EVENT LIVE" : timeState === "soon" ? "STARTING SOON" : "LOCAL TIME";
    const clock = card.querySelector(".local-clock");
    if (clock) clock.textContent = `◷ 當地 ${localTime(card.dataset.timezone)}`;
  });
  document.querySelectorAll(".sparkle-card").forEach((card) => {
    if (card.classList.contains("expired")) {
      card.classList.remove("sparkle-soon", "sparkle-live");
      return;
    }
    const timeState = sparkleStatus(card.dataset.timezone);
    card.classList.toggle("sparkle-soon", timeState === "soon");
    card.classList.toggle("sparkle-live", timeState === "live");
    const status = card.querySelector(".sparkle-status");
    if (status) status.textContent = timeState === "live" ? "EVENT LIVE" : timeState === "soon" ? "STARTING SOON" : "LOCAL TIME";
    const clock = card.querySelector(".local-clock");
    if (clock) clock.textContent = `◷ 當地 ${localTime(card.dataset.timezone)}`;
  });
  document.querySelectorAll(".local-time-card").forEach((card) => {
    const clock = card.querySelector(".local-clock");
    if (clock) clock.textContent = `◷ 當地 ${localTime(card.dataset.timezone)}`;
  });
}

function switchCountry(country, options = {}) {
  activeCountry = country;
  const koreaActive = libraries.korea.some((group) => group.event && eventNewsStatus(group.event) === "active");
  try {
    localStorage.setItem(activeTabStorageKey, country);
  } catch {
    // 無法使用儲存空間時，仍保留本次瀏覽期間的頁籤狀態。
  }
  elements.tabs.forEach((tab) => {
    const active = tab.dataset.country === country;
    if (tab.dataset.country === "korea") tab.classList.toggle("has-live-event", koreaActive);
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  if (options.updateUrl !== false) updateShareUrl(country);
  render();
}

function handleFriendsTabClick() {
  if (friendsUnlocked) {
    switchCountry("friends");
    return;
  }
  clearTimeout(friendUnlockTimer);
  friendUnlockClicks += 1;

  if (friendUnlockClicks >= 3) {
    friendsUnlocked = true;
    friendUnlockClicks = 0;
    try {
      localStorage.setItem(friendsUnlockedStorageKey, "1");
    } catch {
      // 無法寫入儲存空間時，只在本次頁面開啟期間維持解鎖。
    }
    switchCountry("friends");
    return;
  }

  friendUnlockTimer = setTimeout(() => {
    friendUnlockClicks = 0;
  }, 1800);
}

function parseCoordinate(input) {
  const normalized = input.replace(/[，、]/g, ",").replace(/[−–—]/g, "-").trim();
  const mapMatch = normalized.match(/@([+-]?\d+(?:\.\d+)?),([+-]?\d+(?:\.\d+)?)/);
  const values = mapMatch
    ? [Number(mapMatch[1]), Number(mapMatch[2])]
    : [...normalized.matchAll(/[+-]?\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
  if (values.length < 2) return null;
  let [lat, lng] = values;
  const upper = normalized.toUpperCase();
  if ((normalized.includes("南") || /\bS\b/.test(upper)) && lat > 0) lat *= -1;
  if ((normalized.includes("西") || /\bW\b/.test(upper)) && lng > 0) lng *= -1;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

function updateBackToTopVisibility() {
  elements.backToTop.classList.toggle("visible", window.scrollY > 500);
}

function scrollBackToTop() {
  const start = window.scrollY;
  if (!start) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, 0);
    return;
  }
  const startedAt = performance.now();
  const duration = 950;
  const animate = (now) => {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = progress < .5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    window.scrollTo(0, Math.round(start * (1 - eased)));
    if (progress < 1) requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
}

elements.tabs.forEach((tab) => tab.addEventListener("click", () => {
  if (tab.dataset.country === "friends") {
    handleFriendsTabClick();
  } else {
    switchCountry(tab.dataset.country);
  }
}));
elements.search.addEventListener("input", render);
elements.clearSearch.addEventListener("click", () => {
  elements.search.value = "";
  elements.search.focus();
  render();
});
elements.copyAll.addEventListener("click", async () => {
  await copyText(visibleCoordinates.map(coordinateValue).join("\n"), `${visibleCoordinates.length} COORDINATES`);
  if (activeCountry === "friends") return;
  visibleCoordinateKeys.forEach((key) => copiedKeys.add(key));
  saveCopiedKeys();
  render();
});
elements.shareView.addEventListener("click", () => shareLink(activeCountry));
elements.clearCopied.addEventListener("click", () => {
  copiedKeys.clear();
  try {
    localStorage.removeItem(copiedStorageKey);
  } catch {
    // 忽略瀏覽器封鎖儲存空間的情況。
  }
  render();
});
elements.converterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const result = parseCoordinate(elements.coordInput.value);
  elements.converterOutput.className = result ? "success" : "error";
  elements.converterOutput.textContent = result || "ERROR: INVALID COORDINATE";
  if (result) copyText(result, "DECODED COORDINATE");
});
elements.imageModalClose.addEventListener("click", closeImageModal);
elements.imageModal.addEventListener("click", (event) => {
  if (event.target === elements.imageModal) closeImageModal();
});
elements.officialSitesOpen.addEventListener("click", openOfficialSitesModal);
elements.officialSitesClose.addEventListener("click", closeOfficialSitesModal);
elements.officialSitesModal.addEventListener("click", (event) => {
  if (event.target === elements.officialSitesModal) closeOfficialSitesModal();
});
elements.friendQrClose.addEventListener("click", closeFriendQrModal);
elements.friendQrModal.addEventListener("click", (event) => {
  if (event.target === elements.friendQrModal) closeFriendQrModal();
});
elements.friendQrCopy.addEventListener("click", () => {
  if (activeFriendQrCode) copyText(activeFriendQrCode, "好友編號");
});
elements.trashFilterOpen.addEventListener("click", openTrashFilterModal);
elements.trashFilterClose.addEventListener("click", closeTrashFilterModal);
elements.trashFilterModal.addEventListener("click", (event) => {
  if (event.target === elements.trashFilterModal) closeTrashFilterModal();
});
elements.trashFilterCopy.addEventListener("click", async () => {
  await copyText(elements.trashFilterContent.value, "寶可夢清理篩選文字");
});
elements.newsOpen.addEventListener("click", openNewsModal);
elements.newsClose.addEventListener("click", closeNewsModal);
elements.newsModal.addEventListener("click", (event) => {
  if (event.target === elements.newsModal) closeNewsModal();
});
elements.sparkleAlertOpen.addEventListener("click", openSparkleAlertModal);
elements.sparkleAlertClose.addEventListener("click", closeSparkleAlertModal);
elements.sparkleAlertSave.addEventListener("click", saveSparkleAlert);
elements.sparkleAlertModal.addEventListener("click", (event) => {
  if (event.target === elements.sparkleAlertModal) closeSparkleAlertModal();
});
elements.gymCounterOpen.addEventListener("click", openGymCounterModal);
elements.gymCounterClose.addEventListener("click", closeGymCounterModal);
elements.gymCounterModal.addEventListener("click", (event) => {
  if (event.target === elements.gymCounterModal) closeGymCounterModal();
});
elements.gymCounterModal.querySelectorAll("[data-counter-change]").forEach((button) => {
  button.addEventListener("click", () => {
    const row = button.closest("[data-counter-key]");
    changeGymCounter(row.dataset.counterKey, Number(button.dataset.counterChange));
  });
});
elements.gymCounterUndo.addEventListener("click", undoGymCounter);
elements.gymCounterReset.addEventListener("click", resetGymCounter);
elements.backToTop.addEventListener("click", scrollBackToTop);
window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
elements.toast.addEventListener("click", () => {
  if (elements.toast.classList.contains("undoable")) restorePendingUndo();
});

elements.totalCount.textContent = String(allCoordinates().length).padStart(3, "0");
updateSparkleAlertButton();
renderGymCounter();
updateBackToTopVisibility();
organizeCountryTabs();
switchCountry(activeCountry, { updateUrl: false });
checkSparkleAlert();
setInterval(() => {
  updateRaidClocks();
  checkSparkleAlert();
}, 30000);
