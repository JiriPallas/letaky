// admin/modules/helpers.js v1.4

import { ref, onValue } from './firebase-init.js';

export function fetchItems(callback) {
  const itemsRef = ref(window.db, 'items');
  onValue(itemsRef, snapshot => {
    const data = snapshot.val() || {};
    callback(data);
  });
}

export function renderItemGrid(containerId, items, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  const today = new Date().toISOString().split('T')[0];

  const entries = Object.entries(items);
  let shown = 0;

  entries.forEach(([id, item]) => {
    const isArchived = item.archive === true || item.toDate < today;
    const showArchived = options.showArchived ?? false;
    const showActive = options.showActive ?? true;

    if ((isArchived && !showArchived) || (!isArchived && !showActive)) return;

    const div = document.createElement('div');
    div.className = 'item';

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&format=svg&data=https://hittv.netlify.app/detail.html?id=${id}`;
    const isZbozi = item.type === 'zbozi';

    div.innerHTML = `
      <input type="checkbox" class="selectItem" data-id="${id}">
      <img class="preview" src="${item.imageUrl}" alt="náhled">
      <div class="info-wrapper">
        <div class="info">
          <div class="qr"><img src="${qrUrl}" alt="QR kód"></div>
          <div class="text">
            <span class="label">Kategorie:</span> ${item.category}<br>
            <span class="label">Popis:</span> ${item.description}<br>
            ${isZbozi ? `<span class="label">Cena:</span> ${item.price} Kč` : ""}
          </div>
        </div>
        <div class="actions">
          <button onclick="window.location.href='/admin/admin-detail-edit.html?id=${id}'">Edit</button>
          <button onclick="window.location.href='/detail.html?id=${id}'">Náhled</button>
          <button onclick="archiveItem('${id}')">${isArchived ? 'Aktivovat' : 'Archivovat'}</button>
          <button onclick="deleteItem('${id}')">Vymazat</button>
        </div>
      </div>
    `;

    container.appendChild(div);
    shown++;
  });

  if (shown === 0) {
    container.innerHTML = '<p>Žádné položky k zobrazení.</p>';
  }
}
