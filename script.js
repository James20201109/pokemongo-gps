const librarySource = window.coordinateLibraries;
const eventSource = window.coordinateEvents || {};
const countryNames = {
  lego: "LEGO GLOBAL EVENT",
  pokexciting: "POKÉXCITING ASIA TOUR",
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
  search: document.querySelector("#search-input"),
  clearSearch: document.querySelector("#clear-search"),
  copyAll: document.querySelector("#copy-all"),
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
  imageModal: document.querySelector("#image-modal"),
  imageModalContent: document.querySelector("#image-modal-content"),
  imageModalCaption: document.querySelector("#image-modal-caption"),
  imageModalClose: document.querySelector("#image-modal-close"),
  trashFilterOpen: document.querySelector("#trash-filter-open"),
  trashFilterModal: document.querySelector("#trash-filter-modal"),
  trashFilterClose: document.querySelector("#trash-filter-close"),
  trashFilterContent: document.querySelector("#trash-filter-content"),
  trashFilterCopy: document.querySelector("#trash-filter-copy"),
  newsOpen: document.querySelector("#news-open"),
  newsModal: document.querySelector("#news-modal"),
  newsClose: document.querySelector("#news-close"),
  newsSections: document.querySelector("#news-sections")
};

let activeCountry = "lego";
let visibleCoordinates = [];
let visibleCoordinateKeys = [];
let toastTimer;
let pendingUndoKey = null;
let pendingUndoLabel = "";
let pendingRemovalKey = null;
let pendingRemovalButton = null;
let pendingRemovalTimer = null;
const copiedStorageKey = "geo-pulse-copied-coordinates-v1";
const activeTabStorageKey = "geo-pulse-active-tab-v1";
const expandedGroupsStorageKey = "geo-pulse-expanded-groups-v1";
const collapsibleJapanGroups = new Set([
  "北海道", "青森", "岩手", "宮城", "秋田", "山形", "福島",
  "茨城", "栃木", "埼玉", "千葉", "東京", "神奈川",
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
  lego: librarySource.lego,
  pokexciting: librarySource.pokexciting,
  japan: librarySource.japan,
  korea: librarySource.korea,
  uk: librarySource.uk,
  us: librarySource.us,
  hot2026: librarySource.hot2026,
  hot2025: librarySource.hot2025,
  raid: librarySource.raid
};

function loadActiveCountry() {
  try {
    const saved = localStorage.getItem(activeTabStorageKey);
    return saved && (saved === "copied" || Object.hasOwn(libraries, saved)) ? saved : "lego";
  } catch {
    return "lego";
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
  const start = eventTimeValue(eventStartDate(event));
  const end = eventTimeValue(event.endDate, true);
  if (Number.isFinite(end) && now > end) return "expired";
  if (Number.isFinite(start) && now < start) return "upcoming";
  return "active";
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
  const raid = typeof coordinate === "object" && coordinate.timezone;
  const nationalTrustImage = activeCountry === "uk" && typeof coordinate === "object" && /^\d{2}\./.test(coordinate.name)
    ? `assets/pokemon_go_national_trust_2026/${coordinate.name}.jpg`
    : "";
  const coordinateImage = typeof coordinate === "object" ? coordinate.image || nationalTrustImage : "";
  const raidTimeState = raid ? raidTimeStatus(coordinate.timezone) : "closed";
  const button = document.createElement("button");
  button.type = "button";
  button.className = `coordinate-item${typeof coordinate === "object" ? " has-label" : ""}${coordinateImage ? " has-image" : ""}${expired ? " expired" : ""}${visited ? " visited" : ""}${raid ? " raid-card" : ""}${raidTimeState === "peak" ? " raid-active" : ""}${raidTimeState === "open" ? " raid-open" : ""}`;
  if (raid) {
    button.dataset.raidStart = coordinate.start;
    button.dataset.raidEnd = coordinate.end;
    button.dataset.timezone = coordinate.timezone;
  }
  const label = typeof coordinate === "object"
    ? `<span class="coordinate-label"><b>${coordinate.name}${raid ? ` <span class="raid-countdown">(${raidCountdown(coordinate.timezone)})</span>` : ""}</b><small>${coordinate.area}</small>${raid ? `<small class="local-clock">◷ 當地 ${localTime(coordinate.timezone)}</small>` : ""}</span>`
    : "";
  const status = expired ? `<em class="expired-label">EXPIRED</em>` : "";
  const copiedStatus = `<em class="copied-label">✓ 已複製</em>`;
  const raidStatus = raid ? `<em class="raid-live-label">${raidTimeState === "peak" ? "RAID TIME" : "ACTIVE HOURS"}</em>` : "";
  const coordinatePreview = coordinateImage
    ? `<img class="coordinate-thumb" src="${coordinateImage}" alt="${coordinate.name} 背景圖片" loading="lazy" title="點擊放大圖片">`
    : "";
  button.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span>${label}<strong>${value}</strong>${coordinatePreview}${status}${copiedStatus}${raidStatus}<i>⧉</i>`;
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

function render() {
  const query = elements.search.value.trim().toLowerCase();
  const fragment = document.createDocumentFragment();
  visibleCoordinates = [];
  visibleCoordinateKeys = [];
  let visibleGroups = 0;

  const activeGroups = activeCountry === "copied" ? copiedGroups() : libraries[activeCountry];
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
    const collapsible = activeCountry === "japan" && collapsibleJapanGroups.has(group.name);
    const groupStateKey = `${activeCountry}|${group.name}`;
    section.dataset.groupKey = groupStateKey;
    const expanded = !collapsible || expandedGroups.has(groupStateKey);
    section.classList.toggle("is-collapsed", collapsible && !expanded);
    const region = group.region && group.region !== group.name ? `<span>${group.region}</span>` : "";
    const groupSource = group.sourceUrl
      ? `<a class="group-source" href="${group.sourceUrl}" target="_blank" rel="noopener noreferrer">${group.sourceLabel || "資料來源"} ↗</a>`
      : "";
    const collapseControl = collapsible
      ? `<button class="group-collapse" type="button" aria-expanded="${expanded}" aria-label="${expanded ? "收合" : "展開"}${group.name}座標"><span aria-hidden="true">${expanded ? "−" : "＋"}</span></button>`
      : "";
    const groupStamp = stampedJapanGroups.has(group.name) ? `<span class="group-stamp" aria-hidden="true">蓋</span>` : "";
    section.innerHTML = `<header>${region}${groupStamp}<h3>${group.name}</h3>${collapseControl}${groupSource}<b>${matches.length.toString().padStart(2, "0")}</b></header>`;
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
      const sourceLink = group.event.sourceUrl
        ? `<a class="event-source" href="${group.event.sourceUrl}" target="_blank" rel="noopener noreferrer">${group.event.sourceLabel || "查看文獻來源"} <span>↗</span></a>`
        : "";
      const periodInfo = group.event.period
        ? `<div class="event-period"><span>${group.event.periodLabel || "EVENT PERIOD / 台灣時間"}</span><strong>${group.event.period}</strong></div>`
        : "";
      const eventImages = group.event.images || (group.event.image ? [{
        src: group.event.image,
        alt: group.event.imageAlt,
        caption: group.event.imageCaption
      }] : []);
      const eventImage = eventImages.length
        ? `<div class="event-image-gallery">${eventImages.map((image, index) => `
            <button class="event-image-trigger" type="button" data-image-index="${index}" aria-label="放大查看 ${image.alt}">
              <img src="${image.src}" alt="${image.alt}" loading="lazy">
              <span>點擊放大 <b>↗</b></span>
            </button>`).join("")}</div>`
        : "";
      eventInfo.innerHTML = `
        ${periodInfo}
        <p>${group.event.description}</p>
        <div class="raid-note"><b>★ ${detailLabel}</b>${bulletList}</div>
        ${notice}
        ${sourceLink}
        ${eventImage}`;
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
    fragment.appendChild(section);
  });

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
}

function switchCountry(country) {
  activeCountry = country;
  try {
    localStorage.setItem(activeTabStorageKey, country);
  } catch {
    // 無法使用儲存空間時，仍保留本次瀏覽期間的頁籤狀態。
  }
  elements.tabs.forEach((tab) => {
    const active = tab.dataset.country === country;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  render();
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

elements.tabs.forEach((tab) => tab.addEventListener("click", () => switchCountry(tab.dataset.country)));
elements.search.addEventListener("input", render);
elements.clearSearch.addEventListener("click", () => {
  elements.search.value = "";
  elements.search.focus();
  render();
});
elements.copyAll.addEventListener("click", async () => {
  await copyText(visibleCoordinates.map(coordinateValue).join("\n"), `${visibleCoordinates.length} COORDINATES`);
  visibleCoordinateKeys.forEach((key) => copiedKeys.add(key));
  saveCopiedKeys();
  render();
});
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
elements.toast.addEventListener("click", () => {
  if (elements.toast.classList.contains("undoable")) restorePendingUndo();
});

elements.totalCount.textContent = String(allCoordinates().length).padStart(3, "0");
switchCountry(activeCountry);
setInterval(updateRaidClocks, 30000);
