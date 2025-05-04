// admin/modules/helpers.js v1.6
import { db, ref, onValue } from './firebase-init.js';
import { archiveItem, deleteItem, activateItem } from './actions.js';

const itemList = document.getElementById("itemList");
const showActive = document.getElementById("showActive");
const showArchived = document.getElementById("showArchived");
const categoryFilters = document.getElementById("categoryFilters");
const createVideoButton = document.getElementById("createVideo");

let allItems = {};

function isTodayInRange(from, to) {
  const today = new Date().toISOString().split("T")[0];
  return from <= today && today <= to;
}

function isArchived(item) {
  const today = new Date().toISOString().split("T")[0];
  return item.archive === true || item.toDate < today;
}

function isActive(item) {
  const today = new Date().toISOString().split("T")[0];
  return item.archive !== true && item.toDate >= today;
}

function getSelectedCategories() {
  const checkboxes = categoryFilters.querySelectorAll("input[type=checkbox]");
  const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
  return selected.length === 0 || selected.includes("Všechny") ? [] : selected;
}

function renderCategoryFilters(categories) {
  const unique = Array.from(new Set(categories));
  categoryFilters.innerHTML = "";

  const allBox = document.createElement("label");
  allBox.innerHTML = `<input type="checkbox" value="Všechny" checked> Všechny kategorie`;
  categoryFilters.appendChild(allBox);

  unique.forEach(cat => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" value="${cat}"> ${cat}`;
    categoryFilters.appendChild(label);
  });
}

export function renderItemGrid(data) {
  itemList.innerHTML = "";
  const entries = Object.entries(data || {});
  const selectedCats = getSelectedCategories();
  let shown = 0;

  entries.forEach(([id, item]) => {
    item.id = id;
    if (!isTodayInRange(item.fromDate, item.toDate)) return;

    const isItemArchived = isArchived(item);
    const isItemActive = isActive(item);

    if (isItemArchived && !showArchived.checked) return;
    if (isItemActive && !showActive.checked) return;
    if (selectedCats.length > 0 && !selectedCats.includes(item.category)) return;

    const div = document.createElement("div");
    div.className = "item";

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://hittv.netlify.app/detail.html?id=${id}`;

    div.innerHTML = `
      <label><input type="checkbox" class="videoCheckbox" data-id="${id}"> Přidat do videa</label>
      <img src="${item.imageUrl}" class="preview" alt="náhled">
      <div class="info">
        <div class="qr"><img src="${qrUrl}" alt="QR kód"></div>
        <div class="text">
          <span class="label">Kategorie:</span> ${item.category}<br>
          <span class="label">Popis:</span> ${item.description}<br>
          ${item.type === 'zbozi' ? `<span class="label">Cena:</span> ${item.price} Kč` : ""}
        </div>
      </div>
      <div class="actions">
        ${isItemArchived
          ? `<button onclick="activateItem('${id}')">Aktivovat</button>`
          : `<button onclick="archiveItem('${id}')">Archivovat</button>`}
        <button onclick="deleteItem('${id}')">Vymazat</button>
        <a href="/detail.html?id=${id}"><button>Náhled</button></a>
      </div>
    `;

    itemList.appendChild(div);
    shown++;
  });

  if (shown === 0) {
    itemList.innerHTML = "<p>Žádné položky k zobrazení.</p>";
  }
}

export function fetchItems() {
  const itemsRef = ref(db, "items");
  onValue(itemsRef, (snapshot) => {
    const data = snapshot.val();
    allItems = data || {};
    const categories = Object.values(allItems).map(i => i.category);
    renderCategoryFilters(categories);
    renderItemGrid(allItems);
  });
}

export function filterItems() {
  renderItemGrid(allItems);
}

export function getCheckedItems() {
  const checkboxes = document.querySelectorAll(".videoCheckbox:checked");
  return Array.from(checkboxes).map(cb => cb.dataset.id);
}

// Event listeners
showActive.addEventListener("change", filterItems);
showArchived.addEventListener("change", filterItems);
categoryFilters.addEventListener("change", filterItems);
createVideoButton.addEventListener("click", () => {
  const selected = getCheckedItems();
  if (selected.length < 2) {
    alert("Vyberte alespoň 2 položky pro vytvoření videa.");
    return;
  }
  const query = selected.map(id => `id=${id}`).join("&");
  window.open(`/admin/video-preview.html?${query}`, "_blank");
});
