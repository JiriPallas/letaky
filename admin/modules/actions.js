// admin/modules/actions.js v1.4

import { db, ref, update, remove } from './firebase-init.js';

export function archiveItem(id) {
  const itemRef = ref(db, `items/${id}`);
  update(itemRef, { archive: true });
}

export function activateItem(id) {
  const itemRef = ref(db, `items/${id}`);
  update(itemRef, { archive: false });
}

export function deleteItem(id) {
  const itemRef = ref(db, `items/${id}`);
  remove(itemRef);
}
