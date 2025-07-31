import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, get, child, update, remove } from "firebase/database";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCN6aZMwlsZe7JJaovU0WA3UQygWr4jYmA",
  authDomain: "handicricket-85a06.firebaseapp.com",
  projectId: "handicricket-85a06",
  storageBucket: "handicricket-85a06.appspot.com",
  messagingSenderId: "599182538558",
  appId: "1:599182538558:web:3e965753ab05f8f1e3de6f",
  measurementId: "G-HSV9H4LEJQ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth(app);

// Initialize with some sample player data if not exists
function initializePlayerDatabase() {
  const playersRef = ref(db, 'players');
  get(playersRef).then((snapshot) => {
    if (!snapshot.exists()) {
      const defaultPlayers = {
        'virat_kohli': { name: 'Virat Kohli', role: 'batsman', rating: 95 },
        'joe_root': { name: 'Joe Root', role: 'batsman', rating: 92 },
        // Add more default players...
      };
      set(playersRef, defaultPlayers);
    }
  });
}

initializePlayerDatabase();

export { db, ref, set, onValue, get, child, update, remove, auth, signInAnonymously, onAuthStateChanged };
