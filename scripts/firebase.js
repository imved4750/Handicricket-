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
  measurementId: "G-HSV9H4LEJQ",
  databaseURL: "https://handicricket-85a06-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth(app);

// Authentication state observer
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    const uid = user.uid;
    console.log("User is signed in with UID:", uid);
  } else {
    // User is signed out
    console.log("User is signed out");
    // Sign in anonymously
    signInAnonymously(auth)
      .then(() => {
        console.log("Signed in anonymously");
      })
      .catch((error) => {
        console.error("Anonymous sign-in error:", error);
      });
  }
});

// Team Management Functions
async function createTeam(teamName, players) {
  const teamRef = ref(db, `teams/${teamName}`);
  await set(teamRef, {
    name: teamName,
    players: players,
    created: Date.now(),
    matchesPlayed: 0,
    matchesWon: 0
  });
  return teamRef;
}

async function getTeam(teamName) {
  const teamRef = ref(db, `teams/${teamName}`);
  const snapshot = await get(teamRef);
  return snapshot.val();
}

async function updateTeamStats(teamName, wonMatch = false) {
  const teamRef = ref(db, `teams/${teamName}`);
  const snapshot = await get(teamRef);
  const team = snapshot.val();
  
  await update(teamRef, {
    matchesPlayed: (team.matchesPlayed || 0) + 1,
    matchesWon: (team.matchesWon || 0) + (wonMatch ? 1 : 0)
  });
}

// Player Management Functions
async function createPlayer(playerData) {
  const playerRef = ref(db, `players/${playerData.id}`);
  await set(playerRef, playerData);
  return playerRef;
}

async function getPlayer(playerId) {
  const playerRef = ref(db, `players/${playerId}`);
  const snapshot = await get(playerRef);
  return snapshot.val();
}

// Match Management Functions
async function createMatch(matchData) {
  const matchRef = ref(db, `matches/${matchData.id}`);
  await set(matchRef, matchData);
  return matchRef;
}

async function updateMatch(matchId, updates) {
  const matchRef = ref(db, `matches/${matchId}`);
  await update(matchRef, updates);
}

async function getMatch(matchId) {
  const matchRef = ref(db, `matches/${matchId}`);
  const snapshot = await get(matchRef);
  return snapshot.val();
}

// Leaderboard Functions
async function updateLeaderboard(teamName, points) {
  const leaderboardRef = ref(db, `leaderboard/${teamName}`);
  const snapshot = await get(leaderboardRef);
  const currentPoints = snapshot.val()?.points || 0;
  
  await set(leaderboardRef, {
    team: teamName,
    points: currentPoints + points
  });
}

async function getLeaderboard(limit = 10) {
  const leaderboardRef = ref(db, 'leaderboard');
  const snapshot = await get(leaderboardRef);
  const leaderboard = [];
  
  snapshot.forEach((childSnapshot) => {
    leaderboard.push(childSnapshot.val());
  });
  
  return leaderboard
    .sort((a, b) => b.points - a.points)
    .slice(0, limit);
}

export { 
  db, 
  ref, 
  set, 
  onValue, 
  get, 
  child, 
  update, 
  remove,
  auth,
  createTeam,
  getTeam,
  updateTeamStats,
  createPlayer,
  getPlayer,
  createMatch,
  updateMatch,
  getMatch,
  updateLeaderboard,
  getLeaderboard
};
