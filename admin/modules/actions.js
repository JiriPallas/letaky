// admin/modules/actions.js v1.3
import { db, ref, update, remove } from './firebase-init.js';

export function archiveItem(id) {
  const itemRef = ref(db, `items/${id}`);
  update(itemRef, { archive: true }).then(() => {
    console.log(`✅ Archivováno: ${id}`);
  }).catch(console.error);
}

export function activateItem(id) {
  const itemRef = ref(db, `items/${id}`);
  update(itemRef, { archive: false }).then(() => {
    console.log(`✅ Aktivováno: ${id}`);
  }).catch(console.error);
}

export function deleteItem(id) {
  if (confirm("Opravdu chcete vymazat tuto položku?")) {
    const itemRef = ref(db, `items/${id}`);
    remove(itemRef).then(() => {
      console.log(`🗑️ Vymazáno: ${id}`);
    }).catch(console.error);
  }
}
