// admin/modules/helpers.js v1.6

import { db, ref, onValue } from './firebase-init.js';

export function fetchItems(callback) {
  const itemsRef = ref(db, 'items');
  onValue(itemsRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || {});
  });
}

export function renderItemGrid(data, { showActive, showArchived, selectedCats, selectedType }) {
  const container = document.getElementById("itemList");
  container.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];
  const entries = Object.entries(data || {});
  let count = 0;

  entries.forEach(([id, item]) => {
    const isArchived = item.archive === true;
    const isActive = !isArchived && item.toDate >= today;

    if (
      (isActive && !showActive) ||
      (isArchived && !showArchived) ||
      (selectedCats.length && !selectedCats.includes(item.category)) ||
      (selectedType && item.type !== selectedType)
    ) {
      return;
    }

    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&format=svg&data=https://hittv.netlify.app/detail.html?id=${id}`;

    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      ${item.imageUrl.endsWith(".mp4") || item.imageUrl.endsWith(".webm") ? `
        <video src="${item.imageUrl}" autoplay muted loop playsinline style="width:100%;border-radius:4px;cursor:pointer;" onclick="window.open('/admin-detail-edit.html?id=${id}', '_blank')"></video>
      ` : `
        <img src="${item.imageUrl}" alt="obrázek" class="preview" onclick="window.open('/admin-detail-edit.html?id=${id}', '_blank')" />
      `}
      <div class="info-wrapper">
        <div class="info">
          <div class="qr"><img src="${qr}" alt="QR" /></div>
          <div class="text">
            <div><b>Kategorie:</b> ${item.category}</div>
            <div><b>Popis:</b> ${item.description}</div>
            ${item.type === 'zbozi' ? `<div><b>Cena:</b> ${item.price} Kč</div>` : ''}
          </div>
        </div>
      </div>
      <div class="actions">
        <button onclick="window.open('/detail.html?id=${id}', '_blank')">Náhled</button>
        <button onclick="window.open('/admin-detail-edit.html?id=${id}', '_blank')">Edit</button>
        ${isArchived
          ? `<button onclick="activateItem('${id}')">Aktivovat</button>`
          : `<button onclick="archiveItem('${id}')">Archivovat</button>`}
        <button onclick="deleteItem('${id}')">Vymazat</button>
        <input type="checkbox" class="video-checkbox" value="${id}" title="Přidat do videa" />
      </div>
    `;

    container.appendChild(div);
    count++;
  });

  if (count === 0) {
    container.innerHTML = "<p>Žádné položky k zobrazení.</p>";
  }
}
