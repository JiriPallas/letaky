// data-utils.js

// Spara alla uploads till Firebase
async function saveUploadsToFirebase(uploads) {
  try {
    await db.ref('uploads').set(uploads);
    console.log('Data byla úspěšně uložena!');
    alert('Data byla úspěšně uložena!');
  } catch (error) {
    console.error('Chyba při ukládání dat:', error);
    alert('Chyba při ukládání dat!');
  }
}

// Hämta alla uploads från Firebase
async function loadUploadsFromFirebase() {
  try {
    const snapshot = await db.ref('uploads').once('value');
    const uploads = snapshot.val() || [];
    return uploads;
  } catch (error) {
    console.error('Chyba při načítání dat:', error);
    return [];
  }
}

// Arkivera en post i Firebase
async function archiveUpload(id) {
  try {
    const uploads = await loadUploadsFromFirebase();
    const updatedUploads = uploads.map(upload => {
      if (upload.id === id) {
        return { ...upload, archived: true };
      }
      return upload;
    });
    await saveUploadsToFirebase(updatedUploads);
  } catch (error) {
    console.error('Chyba při archivaci:', error);
    alert('Chyba při archivaci!');
  }
}
