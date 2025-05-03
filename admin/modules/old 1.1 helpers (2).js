// admin/modules/helpers.js v1.2
import { ref, onValue } from './firebase-init.js';

export function fetchItems({ containerId, adminMode = false, archiveItem, activateItem, deleteItem }) {
  const container = document.getElementById(containerId);
  const dbRef = ref(window.db, 'items');

  onValue(dbRef, (snapshot) => {
    const data = snapshot.val() || {};
    container.innerHTML = '';
    const today = new Date().toISOString().split("T")[0];
    const categories = new Set();

    Object.entries(data).forEach(([id, item]) => {
      categories.add(item.category);
      const isArchived = item.archive === true || item.toDate < today;
      const isActive = !isArchived;

      const showArchived = document.getElementById("showArchived")?.checked ?? false;
      const showActive = document.getElementById("showActive")?.checked ?? true;

      if ((isArchived && !showArchived) || (isActive && !showActive)) return;

      const div = document.createElement("div");
      div.className = "item";

      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&format=svg&data=https://hittv.netlify.app/detail.html?id=${id}`;
      div.innerHTML = `
        <img src="${item.imageUrl}" class="preview" alt="obrázek">
        <div class="info-wrapper">
          <div class="info">
            <div class="qr"><img src="${qrUrl}" alt="QR kód"></div>
            <div class="text">
              <span class="label">Kategorie:</span> ${item.category}<br>
              <span class="label">Popis:</span> ${item.description}<br>
              ${item.type === 'zbozi' ? `<span class="label">Cena:</span> ${item.price} Kč` : ""}
            </div>
          </div>
          <div class="actions">
            <a href="/detail.html?id=${id}">Test-detail</a>
            <a href="/admin/admin-detail-edit.html?id=${id}">Edit</a>
            ${adminMode && !isArchived ? `<button onclick="archiveItem('${id}')">Archivovat</button>` : ""}
            ${adminMode && isArchived ? `<button onclick="activateItem('${id}')">Aktivovat</button>` : ""}
            ${adminMode ? `<button onclick="navigator.share ? navigator.share({ url: 'https://hittv.netlify.app/detail.html?id=${id}' }) : alert('Sdílení není podporováno.')">Sdílet</button>` : ""}
            ${adminMode ? `<button onclick="downloadImage('${item.imageUrl}')">Uložit</button>` : ""}
            ${adminMode ? `<button onclick="deleteItem('${id}')">Vymazat</button>` : ""}
          </div>
        </div>
      `;

      container.appendChild(div);
    });
  });
}

function downloadImage(url) {
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nabidka.jpg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
