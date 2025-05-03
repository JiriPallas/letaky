// firebase-admin.js – självständig version
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 🔐 Firebase-konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyCFlTsn1ESQddd_7Neq-W6LBGRiT92c-5w",
  authDomain: "letaky-aa6ab.firebaseapp.com",
  databaseURL: "https://letaky-aa6ab-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "letaky-aa6ab",
  storageBucket: "letaky-aa6ab.firebasestorage.app",
  messagingSenderId: "814346215288",
  appId: "1:814346215288:web:445f9700dac9b81cd8f28d"
};

// 🔧 Initiera Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🧠 Validering
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

// 📝 Spara data till Firebase
async function pushData(item) {
  const refItems = ref(db, "items");
  const newRef = await push(refItems, item);
  return newRef.key;
}

export { db, pushData, isValidItem };
