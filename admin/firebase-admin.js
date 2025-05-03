// firebase-admin.js – används i admin/index.html
import { db, pushData } from './modules/firebase-init.js';

function isValidItem(item) {
  return (
    item.imageUrl &&
    item.category &&
    item.type &&
    item.description &&
    item.fromDate &&
    item.toDate
  );
}

export { db, pushData, isValidItem };
