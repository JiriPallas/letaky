// admin/modules/actions.js v1.3
import { ref, update, remove } from './firebase-init.js';

function archiveItem(id) {
  const itemRef = ref(window.db, `items/${id}`);
  update(itemRef, { archive: true }).then(() => {
    console.log(`Archivováno: ${id}`);
  });
}

function activateItem(id) {
  const itemRef = ref(window.db, `items/${id}`);
  update(itemRef, { archive: false }).then(() => {
    console.log(`Aktivováno: ${id}`);
  });
}

function deleteItem(id) {
  const itemRef = ref(window.db, `items/${id}`);
  if (confirm("Opravdu chcete smazat tuto položku?")) {
    remove(itemRef).then(() => {
      console.log(`Smazáno: ${id}`);
    });
  }
}

export { archiveItem, activateItem, deleteItem };
