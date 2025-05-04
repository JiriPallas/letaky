// admin/modules/firebase-init.js v1.4
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getDatabase,
  ref,
  update,
  remove,
  onValue,
  get     // ⬅️ Här är nyckeln!
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCFlTsn1ESQddd_7Neq-W6LBGRiT92c-5w",
  authDomain: "letaky-aa6ab.firebaseapp.com",
  databaseURL: "https://letaky-aa6ab-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "letaky-aa6ab",
  storageBucket: "letaky-aa6ab.firebasestorage.app",
  messagingSenderId: "814346215288",
  appId: "1:814346215288:web:445f9700dac9b81cd8f28d"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
window.db = db;

export { db, ref, update, remove, onValue, get }; // ⬅️ Lägg till get här också
