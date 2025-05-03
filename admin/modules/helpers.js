// admin/modules/helpers.js v1.2
import { ref, onValue } from './firebase-init.js';

export function fetchItems(callback) {
  const dbRef = ref(window.db, 'items');
  onValue(dbRef, snapshot => {
    const data = snapshot.val() || {};
    callback(data);
  });
}

export function renderItemGrid(data, options) {
  const {
    itemList,
    showActive,
    showArchived,
    categoryFilters,
    actions: { archiveItem, activateItem, deleteItem }
  } = options;

  const today = new Date().toISOString().split("T")[0];
  const entries = Object.entries(data || {});
  const selectedCats = Array.from(categoryFilters.querySelectorAll("input[type=checkbox]:checked"))
    .map(cb => cb.value);

  itemList.innerHTML = "";
  let shown = 0;

  entries.forEach(([id, item]) => {
    item.id = id;
    const isArchived = item.archive === true || item.toDate < today;
    const isActive = item.archive !== true && item.toDate >= today;

    const categoryMatch = selectedCats.includes("Všechny") || selectedCats.length === 0 || selectedCats.includes(item.category);
    if ((isActive && !showActive.checked) || (isArchived && !showArchived.checked) || !categoryMatch) {
      return;
    }

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&format=svg&data=https://hittv.netlify.app/detail.html?id=${id}`;
    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <img class="preview" src="${item.imageUrl}" alt="obrázek" onclick="window.open('/detail.html?id=${id}','_blank')">
      <div class="info-wrapper">
        <div class="info">
          <div class="qr"><img src="${qrUrl}" alt="QR kód"></div>
          <div class="text">
            <span class="label">Kategorie:</span> ${item.category}<br>
            <span class="label">Popis:</span> ${item.description}<br>
            ${item.type === "zbozi" ? `<span class="label">Cena:</span> ${item.price} Kč` : ""}
          </div>
        </div>
        <div class="actions">
          ${isArchived
            ? `<button onclick="window.location.href='/admin/admin-detail-edit.html?id=${id}'">Edit</button>
               <button onclick="activateItem('${id}')">Aktivovat</button>`
            : `<button onclick="archiveItem('${id}')">Archivovat</button>`}
          <button onclick="deleteItem('${id}')">Vymazat</button>
          <button onclick="window.open('/detail.html?id=${id}','_blank')">Test detail</button>
        </div>
      </div>
    `;

    itemList.appendChild(div);
    shown++;
  });

  if (shown === 0) {
    itemList.innerHTML = "<p>Žádné položky k zobrazení.</p>";
  }
}
