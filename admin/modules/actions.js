// admin/modules/actions.js v1.4
import { db, ref, update, remove } from './firebase-init.js';

export function archiveItem(id) {
  const itemRef = ref(db, `items/${id}`);
  update(itemRef, { archive: true })
    .then(() => console.log(`✅ Archivováno: ${id}`))
    .catch(err => alert("Chyba při archivaci: " + err));
}

export function activateItem(id) {
  const itemRef = ref(db, `items/${id}`);
  update(itemRef, { archive: false })
    .then(() => console.log(`✅ Aktivováno: ${id}`))
    .catch(err => alert("Chyba při aktivaci: " + err));
}

export function deleteItem(id) {
  const confirmDelete = confirm("Opravdu chcete odstranit tento záznam?");
  if (!confirmDelete) return;
  const itemRef = ref(db, `items/${id}`);
  remove(itemRef)
    .then(() => console.log(`🗑️ Smazáno: ${id}`))
    .catch(err => alert("Chyba při mazání: " + err));
}
