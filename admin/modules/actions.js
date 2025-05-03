// admin/modules/actions.js v1.2
import { db, ref, update, remove } from './firebase-init.js';

export function archiveItem(id) {
  const itemRef = ref(db, `items/${id}`);
  return update(itemRef, { archive: true });
}

export function activateItem(id) {
  const itemRef = ref(db, `items/${id}`);
  return update(itemRef, { archive: false });
}

export function deleteItem(id) {
  const itemRef = ref(db, `items/${id}`);
  return remove(itemRef);
}
