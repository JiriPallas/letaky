import { ref, update } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { db } from './firebase-init.js';

export function archiveItem(id) {
  const itemRef = ref(db, `items/${id}`);
  update(itemRef, { archive: true });
}

export function activateItem(id) {
  const itemRef = ref(db, `items/${id}`);
  update(itemRef, { archive: false });
}

export function downloadImage(url) {
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nabidka.jpg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function shareItem(id) {
  const url = `https://letaky.netlify.app/detail.html?id=${id}`;
  const shareData = {
    title: "Sdílení nabídky",
    text: "Podívej se na tuto nabídku",
    url
  };
  if (navigator.share) {
    navigator.share(shareData).catch(e => alert("Nelze sdílet: " + e));
  } else {
    prompt("Zkopírujte odkaz:", url);
  }
}
