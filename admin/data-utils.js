// data-utils.js

// Läser aktuell data.json från servern
async function fetchUploads() {
  try {
    const res = await fetch('../data/data.json?no-cache=' + Date.now());
    const uploads = await res.json();
    return uploads;
  } catch (err) {
    console.error('Chyba při načítání dat:', err);
    alert('Nepodařilo se načíst data ze serveru.');
    return [];
  }
}

// Sparar ny version av uploads till servern
async function saveUploads(uploads) {
  try {
    const res = await fetch('/.netlify/functions/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(uploads)
    });

    const result = await res.json();
    if (!res.ok) {
      console.error('Chyba při ukládání:', result.error);
      alert('Chyba při ukládání dat!');
      return false;
    } else {
      console.log('Data byla uložena.');
      return true;
    }
  } catch (error) {
    console.error('Chyba při spojení se serverem:', error);
    alert('Chyba při spojení se serverem.');
    return false;
  }
}

// Skapar nytt objekt och sparar
async function insertUpload(newUpload) {
  const uploads = await fetchUploads();
  uploads.push(newUpload);
  const success = await saveUploads(uploads);
  if (success) location.reload();
}

// Uppdaterar befintligt objekt och sparar
async function updateUpload(id, changes) {
  const uploads = await fetchUploads();
  const index = uploads.findIndex(item => item.id === id);
  if (index !== -1) {
    uploads[index] = { ...uploads[index], ...changes };
    const success = await saveUploads(uploads);
    if (success) location.reload();
  } else {
    alert('Položka nebyla nalezena.');
  }
}
