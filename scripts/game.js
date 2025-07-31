// Game state
const gameState = {
    team1: {
        name: "",
        players: [],
        score: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        extras: 0
    },
    team2: {
        name: "",
        players: [],
        score: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        extras: 0
    },
    currentInnings: 1,
    currentBatter: null,
    currentBowler: null,
    selectedFormat: "T20",
    powerplay: true,
    freeHit: false,
    gameStarted: false,
    playerWickets: {} // Tracks fractional wickets per player
};

// Format configurations
const formatConfigs = {
    "T5": {
        totalOvers: 5,
        powerplayOvers: 2,
        powerplayWicketValue: 0.5,
        regularWicketValue: 1.0
    },
    "T10": {
        totalOvers: 10,
        powerplayOvers: 3,
        powerplayWicketValue: 0.5,
        regularWicketValue: 1.0
    },
    "T20": {
        totalOvers: 20,
        powerplayOvers: 6,
        powerplayWicketValue: 0.5,
        regularWicketValue: 1.0
    },
    "ODI": {
        totalOvers: 50,
        powerplayOvers: [1, 2, 3, 4, 5, 6, 21, 22, 23, 24, 25, 26, 41, 42],
        powerplayWicketValue: 0.25,
        regularWicketValue: 0.5,
        deadOvers: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]
    },
    "Test": {
        totalOvers: 90, // per day
        powerplayOvers: [],
        powerplayWicketValue: 0.33,
        regularWicketValue: 0.33,
        days: 3,
        wicketsPerPlayer: 3
    }
};

// Initialize game
function initGame() {
    // Load teams from Firebase or local storage
    loadTeams();
    
    // Setup event listeners
    document.querySelectorAll('.card-btn').forEach(btn => {
        btn.addEventListener('click', handleCardSelection);
    });
    
    document.getElementById('timeout-btn').addEventListener('click', callTimeout);
    document.getElementById('reset-btn').addEventListener('click', requestReset);
    
    // Initialize player wickets tracking
    initializePlayerWickets();
}

// Handle card selection logic
function handleCardSelection(e) {
    if (!gameState.gameStarted) return;
    
    const batterValue = parseInt(e.target.dataset.value);
    // In real implementation, bowler selection would come from opponent
    const bowlerValue = Math.floor(Math.random() * 7); // Simulating opponent
    
    processBall(batterValue, bowlerValue);
}

// Process each ball outcome
function processBall(batterValue, bowlerValue) {
    const currentOver = gameState.currentInnings === 1 ? 
        gameState.team1.overs : gameState.team2.overs;
    const currentBall = gameState.currentInnings === 1 ? 
        gameState.team1.balls : gameState.team2.balls;
    
    // Check powerplay status
    const config = formatConfigs[gameState.selectedFormat];
    gameState.powerplay = checkPowerplay(config, currentOver);
    
    // Process ball outcome
    if (batterValue === 0 && bowlerValue === 0) {
        // No ball + free hit
        addRuns(1, true);
        gameState.freeHit = true;
        addCommentary("No ball! Free hit coming up...");
    } 
    else if (batterValue === bowlerValue && !gameState.freeHit) {
        // Wicket
        const wicketValue = gameState.powerplay ? 
            config.powerplayWicketValue : config.regularWicketValue;
        addWicket(wicketValue);
    } 
    else {
        // Runs scored
        const runs = batterValue === 0 ? bowlerValue : batterValue;
        addRuns(runs, false);
    }
    
    // Update balls/overs
    updateBalls();
    
    // Check for innings completion
    checkInningsCompletion();
    
    // Update UI
    updateScoreboard();
}

// Add runs to current innings
function addRuns(runs, isExtra) {
    const team = gameState.currentInnings === 1 ? gameState.team1 : gameState.team2;
    team.score += runs;
    
    if (isExtra) {
        team.extras += runs;
    } else {
        // Update batter stats
        if (gameState.currentBatter) {
            gameState.currentBatter.runs += runs;
            gameState.currentBatter.balls += 1;
        }
    }
    
    // Update bowler stats if not extra
    if (!isExtra && gameState.currentBowler) {
        gameState.currentBowler.runs += runs;
        gameState.currentBowler.balls += 1;
    }
    
    // Check for milestones
    checkMilestones();
}

// Add wicket to current innings
function addWicket(value) {
    const team = gameState.currentInnings === 1 ? gameState.team1 : gameState.team2;
    
    // Update player's wicket count
    if (gameState.currentBatter) {
        if (!gameState.playerWickets[gameState.currentBatter.id]) {
            gameState.playerWickets[gameState.currentBatter.id] = 0;
        }
        
        gameState.playerWickets[gameState.currentBatter.id] += value;
        
        // Check if player is out (reached 1.0)
        if (gameState.playerWickets[gameState.currentBatter.id] >= 1.0) {
            team.wickets += 1;
            gameState.playerWickets[gameState.currentBatter.id] = 1.0; // Cap at 1.0
            addCommentary(`${gameState.currentBatter.name} is out!`);
            
            // Select new batter
            selectNewBatter();
        } else {
            addCommentary(`${gameState.currentBatter.name} loses ${value} wicket(s)`);
        }
    }
    
    // Update bowler stats
    if (gameState.currentBowler) {
        gameState.currentBowler.wickets += value;
        gameState.currentBowler.balls += 1;
    }
}

// Check powerplay status
function checkPowerplay(config, currentOver) {
    if (Array.isArray(config.powerplayOvers)) {
        return config.powerplayOvers.includes(currentOver);
    } else {
        return currentOver < config.powerplayOvers;
    }
}

// Update UI
function updateScoreboard() {
    const team = gameState.currentInnings === 1 ? gameState.team1 : gameState.team2;
    
    document.getElementById('runs').textContent = team.score;
    document.getElementById('wickets').textContent = team.wickets.toFixed(1);
    document.getElementById('overs').textContent = `${team.overs}.${team.balls}`;
    
    const runRate = team.overs > 0 ? (team.score / team.overs).toFixed(2) : "0.00";
    document.getElementById('run-rate').textContent = `RR: ${runRate}`;
    
    if (gameState.currentInnings === 2) {
        const target = gameState.team1.score + 1;
        const needed = target - team.score;
        document.getElementById('target').textContent = `Target: ${target} (Need ${needed} in ${formatConfigs[gameState.selectedFormat].totalOvers * 6 - (team.overs * 6 + team.balls)} balls)`;
    }
    
    // Update powerplay indicator
    document.getElementById('powerplay-status').textContent = 
        gameState.powerplay ? "Powerplay: Yes" : "Powerplay: No";
}

// Initialize player wickets tracking
function initializePlayerWickets() {
    // Combine all players from both teams
    const allPlayers = [...gameState.team1.players, ...gameState.team2.players];
    
    allPlayers.forEach(player => {
        gameState.playerWickets[player.id] = 0;
    });
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);
