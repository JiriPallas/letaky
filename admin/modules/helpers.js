// admin/modules/helpers.js v1.4
import { ref, onValue } from './firebase-init.js';

function fetchItems(callback) {
  const dbRef = ref(window.db, 'items');
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || {});
  });
}

function isArchived(item) {
  const today = new Date().toISOString().split("T")[0];
  return item.archive === true || item.toDate < today;
}

function isActive(item) {
  const today = new Date().toISOString().split("T")[0];
  return item.archive !== true && item.toDate >= today;
}

function renderItemGrid(data, { itemList, showActive, showArchived, categoryFilters, actions }) {
  itemList.innerHTML = "";
  const entries = Object.entries(data || {});
  const selectedCats = getSelectedCategories(categoryFilters);
  let shown = 0;

  entries.forEach(([id, item]) => {
    const archived = isArchived(item);
    const active = isActive(item);
    const todayInRange = item.fromDate <= today() && today() <= item.toDate;

    if (!todayInRange) return;
    if (!showActive.checked && active) return;
    if (!showArchived.checked && archived) return;
    if (selectedCats.length > 0 && !selectedCats.includes(item.category)) return;

    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://hittv.netlify.app/detail.html?id=${id}`;
    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <img src="${item.imageUrl}" alt="obrázek" class="preview" onclick="window.location.href='/detail.html?id=${id}'">
      <div class="info-wrapper">
        <div class="info">
          <div class="qr"><img src="${qr}" alt="QR kód" onclick="window.location.href='/detail.html?id=${id}'"></div>
          <div class="text">
            <span class="label">Kategorie:</span> ${item.category}<br>
            <span class="label">Popis:</span> ${item.description}<br>
            ${item.type === 'zbozi' ? `<span class="label">Cena:</span> ${item.price} Kč` : ""}
          </div>
        </div>
        <div class="actions">
          <button onclick="window.location.href='/detail.html?id=${id}'">Náhled</button>
          <button onclick="window.location.href='/admin/admin-detail-edit.html?id=${id}'">Edit</button>
          ${archived
            ? `<button onclick="activateItem('${id}')">Aktivovat</button>`
            : `<button onclick="archiveItem('${id}')">Archivovat</button>`}
          <button onclick="deleteItem('${id}')">Vymazat</button>
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

function getSelectedCategories(container) {
  const checkboxes = container.querySelectorAll("input[type=checkbox]:checked");
  const selected = Array.from(checkboxes).map(cb => cb.value);
  return selected.includes("Všechny") ? [] : selected;
}

function today() {
  return new Date().toISOString().split("T")[0];
}

export { fetchItems, renderItemGrid, isArchived, isActive };
