// Hämta alla uploads från servern
async function fetchUploads() {
  try {
    const res = await fetch('../data/data.json');
    if (!res.ok) throw new Error('Nepodařilo se načíst data.');
    return await res.json();
  } catch (err) {
    console.error('Chyba při načítání dat:', err);
    alert('Nepodařilo se načíst data.');
    return [];
  }
}

// Spara hela listan till servern
async function saveUploads(uploads) {
  try {
    const res = await fetch('/.netlify/functions/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(uploads) // ✅ Bara en array, inte { uploads: ... }
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
  } catch (err) {
    console.error('Chyba při ukládání:', err);
    alert('Chyba při ukládání dat!');
    return false;
  }
}

// Uppdatera en viss post och spara direkt
async function updateUpload(id, changes) {
  const uploads = await fetchUploads();
  const index = uploads.findIndex(u => u.id === id);

  if (index !== -1) {
    uploads[index] = { ...uploads[index], ...changes };
    const success = await saveUploads(uploads);
    if (success) {
      alert('Archivace byla úspěšná!');
      location.reload();
    }
  } else {
    alert('Položka nenalezena.');
  }
}
