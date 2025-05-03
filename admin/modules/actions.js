// actions.js – globala funktioner för knappar i admin

export function archiveItem(id, db) {
  if (!db) return console.warn("Firebase DB saknas");
  const { ref, update } = await import("https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js");
  const itemRef = ref(db, `items/${id}`);
  update(itemRef, { archive: true });
}

export function shareItem(item) {
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

export function downloadImage(url) {
  const link = document.createElement('a');
  link.href = url;
  link.download = 'nabidka.jpg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Gör funktioner tillgängliga globalt
window.archiveItem = archiveItem;
window.shareItem = shareItem;
window.downloadImage = downloadImage;
