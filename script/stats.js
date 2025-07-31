// Statistics tracker
const statsTracker = {
    matchStats: {
        team1: {
            runs: 0,
            wickets: 0,
            extras: 0,
            players: {}
        },
        team2: {
            runs: 0,
            wickets: 0,
            extras: 0,
            players: {}
        },
        currentInnings: 1,
        matchFormat: "T20"
    },
    
    // Initialize match stats
    initMatch: function(team1, team2, format) {
        this.matchStats = {
            team1: {
                name: team1.name,
                runs: 0,
                wickets: 0,
                extras: 0,
                players: this.initPlayerStats(team1.players)
            },
            team2: {
                name: team2.name,
                runs: 0,
                wickets: 0,
                extras: 0,
                players: this.initPlayerStats(team2.players)
            },
            currentInnings: 1,
            matchFormat: format
        };
    },
    
    // Initialize player stats
    initPlayerStats: function(players) {
        const playerStats = {};
        players.forEach(player => {
            playerStats[player.id] = {
                name: player.name,
                runs: 0,
                balls: 0,
                wickets: 0,
                bowlingRuns: 0,
                bowlingBalls: 0,
                isOut: false
            };
        });
        return playerStats;
    },
    
    // Update batter stats
    updateBatterStats: function(playerId, runs, isOut = false) {
        const team = this.matchStats.currentInnings === 1 ? 
            this.matchStats.team1 : this.matchStats.team2;
        
        if (team.players[playerId]) {
            team.players[playerId].runs += runs;
            team.players[playerId].balls += 1;
            team.players[playerId].isOut = isOut;
        }
    },
    
    // Update bowler stats
    updateBowlerStats: function(playerId, runs, isWicket) {
        const team = this.matchStats.currentInnings === 1 ? 
            this.matchStats.team2 : this.matchStats.team1;
        
        if (team.players[playerId]) {
            team.players[playerId].bowlingRuns += runs;
            team.players[playerId].bowlingBalls += 1;
            if (isWicket) {
                team.players[playerId].wickets += 1;
            }
        }
    },
    
    // Update team stats
    updateTeamStats: function(runs, wickets, extras) {
        const team = this.matchStats.currentInnings === 1 ? 
            this.matchStats.team1 : this.matchStats.team2;
        
        team.runs += runs;
        team.wickets += wickets;
        team.extras += extras;
    },
    
    // Switch innings
    switchInnings: function() {
        this.matchStats.currentInnings = 2;
    },
    
    // Generate match summary
    generateSummary: function() {
        return {
            team1: this.matchStats.team1,
            team2: this.matchStats.team2,
            format: this.matchStats.matchFormat,
            date: new Date().toISOString(),
            result: this.determineResult()
        };
    },
    
    // Determine match result
    determineResult: function() {
        if (this.matchStats.currentInnings === 1) {
            return "In progress";
        }
        
        if (this.matchStats.team2.runs > this.matchStats.team1.runs) {
            return `${this.matchStats.team2.name} won by ${10 - this.matchStats.team2.wickets} wickets`;
        } else if (this.matchStats.team2.runs < this.matchStats.team1.runs) {
            return `${this.matchStats.team1.name} won by ${this.matchStats.team1.runs - this.matchStats.team2.runs} runs`;
        } else {
            return "Match tied";
        }
    },
    
    // Get player of the match
    getPlayerOfMatch: function() {
        // Simple implementation - highest scorer
        const allPlayers = {
            ...this.matchStats.team1.players,
            ...this.matchStats.team2.players
        };
        
        let potm = null;
        let maxRuns = -1;
        
        for (const playerId in allPlayers) {
            if (allPlayers[playerId].runs > maxRuns) {
                maxRuns = allPlayers[playerId].runs;
                potm = allPlayers[playerId];
            }
        }
        
        return potm;
    }
};

// Initialize stats tracking when game starts
function initStatsTracking(team1, team2, format) {
    statsTracker.initMatch(team1, team2, format);
}

// Update stats after each ball
function updateStatsAfterBall(batterId, bowlerId, runs, isWicket, isExtra) {
    statsTracker.updateBatterStats(batterId, runs, isWicket);
    if (!isExtra) {
        statsTracker.updateBowlerStats(bowlerId, runs, isWicket);
    }
    statsTracker.updateTeamStats(runs, isWicket ? 1 : 0, isExtra ? runs : 0);
}

// Switch innings in stats
function switchInningsStats() {
    statsTracker.switchInnings();
}

// Generate and display summary
function displayMatchSummary() {
    const summary = statsTracker.generateSummary();
    const potm = statsTracker.getPlayerOfMatch();
    
    // In a real implementation, this would show a modal or new page
    console.log("Match Summary:", summary);
    console.log("Player of the Match:", potm.name);
    
    // You would implement this to show in UI
    showInningsSummary(summary, potm);
}

// Show innings summary (to be implemented)
function showInningsSummary(summary, potm) {
    // This would create and display a summary screen
    // Implementation would depend on your UI framework
        }
