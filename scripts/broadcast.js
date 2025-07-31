// Add commentary to the game
function addCommentary(text, isImportant = false) {
    const commentaryEl = document.getElementById('commentary');
    const entry = document.createElement('div');
    entry.className = `commentary-entry ${isImportant ? 'important' : ''}`;
    
    const timestamp = new Date().toLocaleTimeString();
    entry.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${text}`;
    
    commentaryEl.prepend(entry);
    
    // Scroll to top
    commentaryEl.scrollTop = 0;
    
    // Add to timeline if important
    if (isImportant) {
        addTimelineEvent(text);
    }
}

// Add event to timeline
function addTimelineEvent(eventText) {
    const timelineEl = document.getElementById('timeline');
    const eventEl = document.createElement('div');
    eventEl.className = 'timeline-event';
    eventEl.textContent = eventText;
    
    timelineEl.appendChild(eventEl);
    timelineEl.scrollTop = timelineEl.scrollHeight;
}

// Check for milestones and trigger animations
function checkMilestones() {
    const team = gameState.currentInnings === 1 ? gameState.team1 : gameState.team2;
    const batter = gameState.currentBatter;
    
    if (!batter) return;
    
    // Check for 50, 100, etc.
    const milestones = [50, 100, 150, 200];
    for (const milestone of milestones) {
        if (batter.runs >= milestone && batter.runs - team.score < milestone) {
            triggerMilestoneAnimation(milestone);
            addCommentary(`${batter.name} reaches ${milestone}!`, true);
            playSound('milestone');
        }
    }
}

// Trigger milestone animation
function triggerMilestoneAnimation(milestone) {
    const animationEl = document.createElement('div');
    animationEl.className = 'milestone-animation';
    animationEl.textContent = `${milestone}`;
    
    document.body.appendChild(animationEl);
    
    // Remove after animation
    setTimeout(() => {
        animationEl.remove();
    }, 3000);
}

// Call timeout
function callTimeout() {
    if (!gameState.gameStarted) return;
    
    addCommentary("Timeout called! 2 minute break.", true);
    // Implement timeout logic
}

// Request reset
function requestReset() {
    if (!gameState.gameStarted) return;
    
    addCommentary("Reset requested. Waiting for opponent...", true);
    // Implement reset logic
}

// Load teams from Firebase
function loadTeams() {
    // Implementation would connect to Firebase and load teams
    // For now, we'll use mock data
    gameState.team1 = {
        name: "Team A",
        players: generatePlayers(11, "Team A"),
        score: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        extras: 0
    };
    
    gameState.team2 = {
        name: "Team B",
        players: generatePlayers(11, "Team B"),
        score: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        extras: 0
    };
    
    // Update UI
    document.getElementById('team1-name').textContent = gameState.team1.name;
    document.getElementById('team2-name').textContent = gameState.team2.name;
    
    // Populate player lists
    populatePlayerLists();
}

// Generate mock players
function generatePlayers(count, team) {
    const players = [];
    for (let i = 1; i <= count; i++) {
        players.push({
            id: `${team}-player-${i}`,
            name: `Player ${i}`,
            team: team,
            runs: 0,
            balls: 0,
            wickets: 0,
            isBowler: i <= 5 // First 5 players can bowl
        });
    }
    return players;
}

// Populate player selection lists
function populatePlayerLists() {
    const battersList = document.getElementById('batters-list');
    const bowlersList = document.getElementById('bowlers-list');
    
    // Clear existing
    battersList.innerHTML = '';
    bowlersList.innerHTML = '';
    
    // Add batters from current innings team
    const team = gameState.currentInnings === 1 ? gameState.team1 : gameState.team2;
    
    team.players.forEach(player => {
        const batterEl = document.createElement('div');
        batterEl.className = 'player-card';
        batterEl.textContent = player.name;
        batterEl.addEventListener('click', () => selectBatter(player));
        battersList.appendChild(batterEl);
    });
    
    // Add bowlers from opposite team
    const oppositeTeam = gameState.currentInnings === 1 ? gameState.team2 : gameState.team1;
    
    oppositeTeam.players.forEach(player => {
        if (player.isBowler) {
            const bowlerEl = document.createElement('div');
            bowlerEl.className = 'player-card';
            bowlerEl.textContent = player.name;
            bowlerEl.addEventListener('click', () => selectBowler(player));
            bowlersList.appendChild(bowlerEl);
        }
    });
}

// Select batter
function selectBatter(player) {
    gameState.currentBatter = player;
    document.getElementById('current-batter').textContent = player.name;
    updatePlayerStats();
}

// Select bowler
function selectBowler(player) {
    gameState.currentBowler = player;
    document.getElementById('current-bowler').textContent = player.name;
    updatePlayerStats();
}

// Update player stats display
function updatePlayerStats() {
    if (gameState.currentBatter) {
        document.getElementById('b-runs').textContent = gameState.currentBatter.runs;
        document.getElementById('b-balls').textContent = gameState.currentBatter.balls;
        const sr = gameState.currentBatter.balls > 0 ? 
            (gameState.currentBatter.runs / gameState.currentBatter.balls * 100).toFixed(2) : "0.00";
        document.getElementById('b-sr').textContent = sr;
    }
    
    if (gameState.currentBowler) {
        const overs = Math.floor(gameState.currentBowler.balls / 6);
        const balls = gameState.currentBowler.balls % 6;
        document.getElementById('bowl-overs').textContent = `${overs}.${balls}`;
        document.getElementById('bowl-wkts').textContent = gameState.currentBowler.wickets.toFixed(2);
        const er = overs > 0 ? 
            (gameState.currentBowler.runs / overs).toFixed(2) : "0.00";
        document.getElementById('bowl-er').textContent = er;
    }
}
