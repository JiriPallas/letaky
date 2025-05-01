// firebase-admin.js
// Dummy-implementation för utveckling utan riktig databas

function isValidItem(item) {
  return item.imageUrl && item.description && item.category && item.fromDate && item.toDate;
}

async function pushData(item) {
  console.log("Simulerad pushData:", item);
  // Här skulle Firebase push ske
  return Promise.resolve(); // Fejka lyckad skrivning
}

export { pushData, isValidItem };
