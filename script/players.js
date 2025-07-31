// Global player database
const playerDatabase = {
    // This would be populated from Firebase or a local JSON file
    // Example structure:
    players: [
        {
            id: "player-1",
            name: "Virat Kohli",
            team: "India",
            battingStyle: "Right-handed",
            bowlingStyle: "Right-arm medium",
            stats: {
                matches: 250,
                runs: 12000,
                average: 59.8,
                wickets: 4,
                economy: 6.2
            }
        },
        // ... more players
    ],
    
    // Get player by ID
    getPlayer: function(id) {
        return this.players.find(player => player.id === id);
    },
    
    // Search players by name
    searchPlayers: function(query) {
        return this.players.filter(player => 
            player.name.toLowerCase().includes(query.toLowerCase()));
    },
    
    // Get players by team
    getTeamPlayers: function(teamName) {
        return this.players.filter(player => 
            player.team.toLowerCase() === teamName.toLowerCase());
    }
};

// Team management
const teamManager = {
    teams: {},
    
    // Create a new team
    createTeam: function(teamName, playerIds) {
        if (this.teams[teamName]) {
            console.error("Team already exists");
            return false;
        }
        
        this.teams[teamName] = {
            players: playerIds.map(id => playerDatabase.getPlayer(id)),
            matchesPlayed: 0,
            matchesWon: 0
        };
        
        return true;
    },
    
    // Update team players
    updateTeam: function(teamName, playerIds) {
        if (!this.teams[teamName]) {
            console.error("Team doesn't exist");
            return false;
        }
        
        this.teams[teamName].players = playerIds.map(id => playerDatabase.getPlayer(id));
        return true;
    },
    
    // Get team info
    getTeam: function(teamName) {
        return this.teams[teamName];
    }
};

// Initialize with some sample data
function initializePlayerDatabase() {
    // This would load from Firebase in a real implementation
    playerDatabase.players = [
        // Sample players
        {
            id: "player-1",
            name: "Virat Kohli",
            team: "India",
            battingStyle: "Right-handed",
            bowlingStyle: "Right-arm medium",
            stats: {
                matches: 250,
                runs: 12000,
                average: 59.8,
                wickets: 4,
                economy: 6.2
            }
        },
        {
            id: "player-2",
            name: "Jasprit Bumrah",
            team: "India",
            battingStyle: "Right-handed",
            bowlingStyle: "Right-arm fast",
            stats: {
                matches: 120,
                runs: 450,
                average: 8.2,
                wickets: 250,
                economy: 4.8
            }
        }
        // ... more players
    ];
}

// Initialize when loaded
initializePlayerDatabase();
