// modules/helpers.js v1.7
import { db, ref, onValue } from "./firebase-init.js";

export function fetchItems(callback) {
  const itemsRef = ref(db, "items");
  onValue(itemsRef, (snapshot) => {
    const data = snapshot.val() || {};
    callback(data);
  });
}

export function renderItemGrid(data, options = {}) {
  const { showActive = true, showArchived = false, selectedCats = [], selectedType = "zbozi" } = options;
  const container = document.getElementById("itemList");
  if (!container) return;

  container.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];
  const entries = Object.entries(data || {});

  let count = 0;

  entries.forEach(([id, item]) => {
    if (item.type !== selectedType) return;

    const isArchived = item.archive === true;
    const isExpired = item.toDate && item.toDate < today;

    if (isArchived && !showArchived) return;
    if (!isArchived && !showActive) return;
    if (selectedCats.length > 0 && !selectedCats.includes(item.category)) return;

    const div = document.createElement("div");
    div.className = "item";

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&format=svg&data=https://hittv.netlify.app/detail.html?id=${id}`;

    const mediaEl = createMediaElement(item.imageUrl);

    const infoHtml = `
      <div class="info">
        <div class="qr"><img src="${qrUrl}" alt="QR"></div>
        <div class="text">
          <strong>${item.category}</strong><br>
          ${item.description || ""}
          ${item.type === "zbozi" ? `<br><strong>${item.price} Kč</strong>` : ""}
        </div>
      </div>
    `;

    const actionsHtml = `
      <div class="actions">
        ${isArchived
          ? `<button onclick="activateItem('${id}')">Aktivovat</button>`
          : `<button onclick="archiveItem('${id}')">Archivovat</button>`}
        <button onclick="deleteItem('${id}')">Vymazat</button>
        <button onclick="window.open('/admin/admin-detail-edit.html?id=${id}', '_blank')">Edit</button>
        <button onclick="window.open('/detail.html?id=${id}', '_blank')">Náhled</button>
        <input type="checkbox" class="video-checkbox" value="${id}" title="Vybrat pro video">
      </div>
    `;

    div.appendChild(mediaEl);

    const infoWrapper = document.createElement("div");
    infoWrapper.innerHTML = infoHtml;
    div.appendChild(infoWrapper);

    const actionsWrapper = document.createElement("div");
    actionsWrapper.innerHTML = actionsHtml;
    div.appendChild(actionsWrapper);

    container.appendChild(div);
    count++;
  });

  if (count === 0) {
    container.innerHTML = "<p>Žádné položky k zobrazení.</p>";
  }
}

export function createMediaElement(url) {
  const isVideo = url?.endsWith(".mp4") || url?.endsWith(".webm");
  if (isVideo) {
    const video = document.createElement("video");
    video.src = url;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.style.maxWidth = "100%";
    video.style.borderRadius = "4px";
    return video;
  } else {
    const img = document.createElement("img");
    img.src = url;
    img.className = "preview";
    img.alt = "náhled";
    img.style.maxWidth = "100%";
    img.style.borderRadius = "4px";
    return img;
  }
}
