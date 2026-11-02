# GEO//PULSE 座標終端 / Coordinate Terminal

GEO//PULSE 是一個以繁體中文為主的 Pokémon GO 活動與座標整理網站，提供活動時程、地區座標、當地時間、快速複製、分享連結及即時活動狀態等功能。

GEO//PULSE is a Traditional Chinese-first Pokémon GO event and coordinate reference site. It brings together event schedules, regional coordinates, local times, quick copying, shareable links, and live event status in one static web application.

> 本專案是非官方個人工具，與 The Pokémon Company、Nintendo、Creatures、GAME FREAK、Scopely 或 Niantic 無關。活動內容可能隨官方公告調整，使用前請再次確認官方資訊。
>
> This is an unofficial personal tool and is not affiliated with The Pokémon Company, Nintendo, Creatures, GAME FREAK, Scopely, or Niantic. Event details may change; always confirm important information with official sources.

---

## 中文說明

### 主要功能

- **即時活動控制台**：顯示目前進行中、即將開始及短時段活動，並提供活動倒數。
- **活動情報整理**：依活動日期自動區分進行中、未來與過期活動。
- **全球座標資料庫**：收錄日本、韓國、歐洲、英國、美國、印度、印尼及其他限定活動座標。
- **當地時間顯示**：依座標所屬時區顯示當地日期與時間。
- **座標狀態提示**：依活動或道館開放時間顯示進行中、關閉或尚未開始等狀態。
- **快速複製與搜尋**：可複製單一座標、整組座標，並依名稱或座標搜尋。
- **我的最愛**：可將常用活動加入最愛；設定會儲存在瀏覽器中。
- **活動分享**：分享指定分類、活動或座標區塊，開啟網址後可直接跳至對應位置。
- **圖片檢視與下載**：活動圖片可放大並下載原始檔案。
- **座標格式轉換**：將一般經緯度、方向文字或 Google Maps 網址轉為十進位座標。
- **官方網站入口**：快速前往 Pokémon GO 各語言官方網站。
- **手機工具面板**：手機版以單一工具按鈕集中常用功能，避免遮擋內容。
- **靜態好友區**：顯示預先設定的好友編號、QR Code 與常用地點；首次使用需透過隱藏操作解鎖。

### 使用方式

本專案是純 HTML、CSS 與 JavaScript 靜態網站，不需要安裝套件或建置程序。

建議在專案根目錄啟動本機伺服器：

```powershell
python -m http.server 8080
```

然後在瀏覽器開啟：

```text
http://localhost:8080
```

也可以直接開啟 `index.html`，但部分瀏覽器可能會限制剪貼簿、下載或分享功能，因此仍建議使用本機伺服器。

### 專案結構

```text
.
├─ index.html              # 網站頁面與對話框結構
├─ style.css               # 桌面版與手機版樣式
├─ script.js               # 畫面渲染、搜尋、複製、分享與狀態邏輯
├─ coordinates-data.js     # 活動、區域、座標、時區與圖片資料
├─ friends-data.js         # 靜態好友資料
├─ favicon.ico             # 網站圖示
└─ assets/
   ├─ Events/              # 活動圖片
   └─ ...                  # 各地區與合作活動素材
```

### 維護活動與座標資料

主要資料位於 `coordinates-data.js`。新增或更新資料時，請確認：

1. 活動名稱與日期和官方公告一致。
2. `startDateTime`、`endDateTime` 包含正確的 UTC 時差。
3. 每個座標使用 `緯度, 經度` 格式。
4. `timezone` 使用有效的 IANA 時區，例如 `Asia/Taipei`、`Europe/London`。
5. 活動圖片放在 `assets/Events/`，並提供清楚的 `alt` 與 `caption`。
6. 活動具有穩定且不重複的 `shareId`，避免既有分享網址失效。
7. 官方資料需保留 `sourceUrl` 與適當的來源名稱。

範例：

```js
{
  region: "全球活動情報 · 範例",
  name: "活動名稱",
  shareId: "unique-event-id",
  event: {
    period: "2026 年 11 月 1 日 10:00～20:00",
    startDateTime: "2026-11-01T10:00:00+08:00",
    endDateTime: "2026-11-01T20:00:00+08:00",
    sourceUrl: "https://pokemongo.com/",
    images: []
  },
  coordinates: [
    {
      name: "地點名稱",
      area: "國家 · 城市",
      timezone: "Asia/Taipei",
      value: "25.000000, 121.000000"
    }
  ]
}
```

### 瀏覽器資料

收合狀態、已複製座標、我的最愛、好友區解鎖狀態與部分工具設定會儲存在 `localStorage`。使用無痕模式、清除網站資料或更換瀏覽器後，這些設定會重設。

### 隱私注意事項

`friends-data.js` 可能包含遊戲好友編號與私人常用地點。公開部署、建立公開儲存庫或分享完整專案前，請先移除或匿名化不應公開的資料。

### 資料來源與使用提醒

- 活動資訊應優先引用 Pokémon GO 官方公告。
- 地區合作活動可使用主辦單位公告作為補充來源。
- 圖片與 Pokémon 相關名稱的權利屬於其各自權利人。
- 本網站僅供個人整理與快速查閱，不保證所有資料即時或完全正確。
- 遊玩時請遵守遊戲服務條款、當地規定並注意周遭安全。

---

## English

### Features

- **NOW MODE dashboard** for live, upcoming, and short-duration events with countdowns.
- **Event archive** that separates active, upcoming, and expired records by date.
- **Global coordinate library** covering regional and limited-time Pokémon GO locations.
- **Local time display** based on each coordinate's IANA time zone.
- **Availability indicators** for event windows and location-specific gym hours.
- **Search and quick copy** for individual coordinates or complete groups.
- **Favorite events** saved locally in the browser.
- **Deep-link sharing** for tabs, event groups, and selected sections.
- **Event image viewer and downloads** for registered activity artwork.
- **Coordinate converter** for decimal coordinates, directional text, and Google Maps URLs.
- **Official site shortcuts** for multiple Pokémon GO language sites.
- **Mobile tool sheet** that groups common actions under one floating button.
- **Static friend directory** with trainer codes, generated QR codes, and saved locations.

### Running locally

This project is a buildless static site made with HTML, CSS, and JavaScript. No package installation is required.

Start a local web server from the project root:

```powershell
python -m http.server 8080
```

Open the following address:

```text
http://localhost:8080
```

Opening `index.html` directly may work, but browser security restrictions can affect clipboard, download, or sharing features. A local web server is recommended.

### Project structure

```text
.
├─ index.html              # Page and modal markup
├─ style.css               # Desktop and responsive styles
├─ script.js               # Rendering, search, copy, sharing, and status logic
├─ coordinates-data.js     # Events, coordinates, time zones, and image metadata
├─ friends-data.js         # Static friend directory
├─ favicon.ico             # Site icon
└─ assets/                 # Event and regional media
```

### Maintaining event data

Most content is maintained in `coordinates-data.js`. When adding or updating an event:

1. Match names and dates with the authoritative announcement.
2. Include the correct UTC offset in `startDateTime` and `endDateTime`.
3. Store coordinates as `latitude, longitude`.
4. Use valid IANA time-zone names such as `Asia/Taipei` or `Europe/London`.
5. Store event images under `assets/Events/` and provide meaningful `alt` and `caption` text.
6. Assign a stable, unique `shareId` so existing shared links remain valid.
7. Keep the original source URL and a clear source label.

### Browser storage

Collapsed sections, copied coordinates, favorites, friend-area unlock state, and selected tool preferences are stored in `localStorage`. These settings reset in private browsing, after site data is cleared, or when using another browser.

### Privacy

`friends-data.js` may contain trainer codes and private frequently used locations. Remove or anonymize sensitive records before publishing the site, making the repository public, or sharing the complete source tree.

### Data and trademark notice

- Prefer official Pokémon GO announcements as the primary source for event information.
- Regional partner announcements may be used as supplementary sources.
- Pokémon names, images, and related trademarks belong to their respective owners.
- This site is intended for personal organization and quick reference; data accuracy and availability are not guaranteed.
- Follow the game's terms of service, local rules, and general safety guidance while playing.

---

## License / 授權

No open-source license is currently included. Unless a license is added, the source code and project-specific content remain all rights reserved.

目前專案未附加開放原始碼授權。在正式加入授權條款前，程式碼與專案內容均保留所有權利。
