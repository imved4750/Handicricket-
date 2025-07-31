import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, get, child, update, remove } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCN6aZMwlsZe7JJaovU0WA3UQygWr4jYmA",
  authDomain: "handicricket-85a06.firebaseapp.com",
  databaseURL: "https://handicricket-85a06-default-rtdb.firebaseio.com",
  projectId: "handicricket-85a06",
  storageBucket: "handicricket-85a06.appspot.com",
  messagingSenderId: "599182538558",
  appId: "1:599182538558:web:3e965753ab05f8f1e3de6f",
  measurementId: "G-HSV9H4LEJQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Team login system
const loginTeam = async (teamName) => {
  try {
    const userCredential = await signInAnonymously(auth);
    const teamRef = ref(db, `teams/${teamName}`);
    await set(teamRef, {
      name: teamName,
      createdAt: Date.now(),
      lastActive: Date.now()
    });
    localStorage.setItem('ihcc_team', teamName);
    return true;
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
};

// Player database
const getPlayerDatabase = async () => {
  const snapshot = await get(ref(db, 'players'));
  return snapshot.val() || {};
};

export { 
  db, ref, set, onValue, get, child, update, remove, 
  loginTeam, getPlayerDatabase 
};
