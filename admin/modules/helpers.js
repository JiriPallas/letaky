// admin/modules/helpers.js v1.10
import { db, ref, onValue } from './firebase-init.js';

export function fetchItems(callback) {
  const dbRef = ref(db, 'items');
  onValue(dbRef, (snapshot) => {
    callback(snapshot.val() || {});
  });
}

export function renderItemGrid(items, options = {}) {
  const container = document.getElementById('itemList');
  if (!container) return;
  container.innerHTML = '';

  const {
    showActive = true,
    showArchived = false,
    selectedCats = [],
    selectedType = ''
  } = options;

  for (const [id, item] of Object.entries(items)) {
    const isArchived = item.archive === true;
    const isActive = !isArchived;

    if ((isArchived && !showArchived) || (isActive && !showActive)) continue;
    if (selectedType && item.type !== selectedType) continue;
    if (selectedCats.length > 0 && !selectedCats.includes(item.category)) continue;

    const card = document.createElement('div');
    card.className = 'item';

    const isVideo = item.imageUrl.endsWith('.mp4') || item.imageUrl.endsWith('.webm');

    const media = isVideo
      ? `<video src="${item.imageUrl}" autoplay loop muted playsinline style="max-width:100%; border-radius:4px;"></video>`
      : `<img src="${item.imageUrl}" alt="náhled" style="max-width:100%; border-radius:4px;" />`;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&format=svg&data=https://hittv.netlify.app/detail.html?id=${id}`;

    const cenaRow = item.type === 'zbozi' ? `<div><strong>Cena:</strong> ${item.price} Kč</div>` : '';

    card.innerHTML = `
      <div>${media}</div>
      <div class="info">
        <div class="qr"><img src="${qrUrl}" alt="QR" /></div>
        <div class="text">
          <div><strong>Kategorie:</strong> ${item.category}</div>
          <div><strong>Popis:</strong> ${item.description}</div>
          ${cenaRow}
        </div>
      </div>
      <div class="actions">
        ${!item.archive
          ? `<button onclick="archiveItem('${id}')">Archivovat</button>`
          : `<button onclick="activateItem('${id}')">Aktivovat</button>`}
        <button onclick="deleteItem('${id}')">Vymazat</button>
        <a href="/admin/admin-detail-edit.html?id=${id}"><button>Edit</button></a>
        <a href="/detail.html?id=${id}" target="_blank"><button>Náhled</button></a>
        <label><input type="checkbox" class="video-checkbox" value="${id}" /> video</label>
      </div>
    `;

    container.appendChild(card);
  }

  if (container.innerHTML === '') {
    container.innerHTML = '<p>Žádné položky k zobrazení.</p>';
  }
}
