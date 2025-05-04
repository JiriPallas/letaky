// admin/modules/helpers.js v1.5
import { ref, onValue } from './firebase-init.js';

export function fetchItems(callback) {
  const dbRef = ref(window.db, 'items');
  onValue(dbRef, snapshot => {
    const data = snapshot.val() || {};
    callback(data);
  });
}

export function renderItemGrid(data, { showActive, showArchived, selectedCats }) {
  const container = document.getElementById("itemList");
  container.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];
  let count = 0;

  Object.entries(data).forEach(([id, item]) => {
    const isArchived = item.archive === true || item.toDate < today;
    const isActive = !isArchived;

    if ((isArchived && !showArchived) || (isActive && !showActive)) return;
    if (selectedCats.length > 0 && !selectedCats.includes(item.category)) return;

    const itemDiv = document.createElement("div");
    itemDiv.className = "item";

    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://hittv.netlify.app/detail.html?id=${id}`;
    const preview = `<img src="${item.imageUrl}" alt="náhled" style="max-width:100%;border-radius:4px;">`;
    const price = item.type === "zbozi" ? `<p><strong>Cena:</strong> ${item.price} Kč</p>` : "";
    const archiveBtn = isArchived
      ? `<button onclick="activateItem('${id}')">Aktivovat</button>`
      : `<button onclick="archiveItem('${id}')">Archivovat</button>`;

    itemDiv.innerHTML = `
      <input type="checkbox" class="video-checkbox" value="${id}">
      <a href="/detail.html?id=${id}" target="_blank">${preview}</a>
      <div class="info">
        <div class="qr"><img src="${qr}" alt="QR kód"></div>
        <div class="text">
          <p><strong>Kategorie:</strong> ${item.category}</p>
          <p><strong>Popis:</strong> ${item.description}</p>
          ${price}
        </div>
      </div>
      <div class="actions">
        <button onclick="window.open('/detail.html?id=${id}', '_blank')">Náhled</button>
        <button onclick="window.open('/admin/admin-detail-edit.html?id=${id}', '_blank')">Edit</button>
        ${archiveBtn}
        <button onclick="deleteItem('${id}')">Vymazat</button>
      </div>
    `;
    container.appendChild(itemDiv);
    count++;
  });

  if (count === 0) container.innerHTML = "<p>Žádné položky k zobrazení.</p>";
}
