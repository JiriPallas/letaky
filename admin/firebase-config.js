// admin/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "DIN_API_KEY",
  authDomain: "DITT_PROJECT.firebaseapp.com",
  databaseURL: "https://DITT_PROJECT.firebaseio.com",
  projectId: "DITT_PROJECT",
  storageBucket: "DITT_PROJECT.appspot.com",
  messagingSenderId: "XXXXXXXXXXXX",
  appId: "1:XXXXXXXXXXXX:web:XXXXXXXXXXXXXX"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export { db };
