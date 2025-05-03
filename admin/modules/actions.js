// actions.js – globala funktioner för admin-knappar

import { ref, update } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { db } from './firebase-init.js';

function archiveItem(id) {
  if (!db) return console.warn("Firebase DB saknas");
  const itemRef = ref(db, `items/${id}`);
  update(itemRef, { archive: true });
}

function shareItem(item) {
  const shareData = {
    title: item.category,
    text: item.description,
    url: window.location.origin + `/detail.html?id=${item.id}`
  };
  if (navigator.share) {
    navigator.share(shareData).catch(err => console.warn("Sdílení selhalo:", err));
  } else {
    alert(`Sdílení není podporováno. Zkopírujte odkaz:
${shareData.url}`);
  }
}

function downloadImage(url) {
  const link = document.createElement('a');
  link.href = url;
  link.download = 'nabidka.jpg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Exponera funktioner globalt
window.archiveItem = archiveItem;
window.shareItem = shareItem;
window.downloadImage = downloadImage;
