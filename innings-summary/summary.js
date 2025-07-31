// Innings summary manager
const summaryManager = {
    // Show innings summary
    show: function(summary, isMatchEnd = false) {
        // Create summary container
        const summaryEl = document.createElement('div');
        summaryEl.className = 'summary-container';
        
        // Add close button if not final summary
        if (!isMatchEnd) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'summary-close';
            closeBtn.textContent = 'Continue to Next Innings';
            closeBtn.addEventListener('click', () => {
                summaryEl.remove();
                switchInningsStats();
            });
            summaryEl.appendChild(closeBtn);
        }
        
        // Add title
        const title = document.createElement('h2');
        title.textContent = isMatchEnd ? 'Match Summary' : 'Innings Summary';
        summaryEl.appendChild(title);
        
        // Add teams summary
        const teamsSummary = document.createElement('div');
        teamsSummary.className = 'teams-summary';
        
        // Team 1 summary
        const team1Summary = this.createTeamSummary(summary.team1, summary.team2.runs);
        teamsSummary.appendChild(team1Summary);
        
        // Team 2 summary
        if (isMatchEnd) {
            const team2Summary = this.createTeamSummary(summary.team2, summary.team1.runs);
            teamsSummary.appendChild(team2Summary);
        }
        
        summaryEl.appendChild(teamsSummary);
        
        // Add batsmen summary
        const batsmenTitle = document.createElement('h3');
        batsmenTitle.textContent = 'Batting Card';
        summaryEl.appendChild(batsmenTitle);
        
        const batsmenSummary = this.createBatsmenSummary(summary.team1.players);
        summaryEl.appendChild(batsmenSummary);
        
        // Add bowlers summary if match ended
        if (isMatchEnd) {
            const bowlersTitle = document.createElement('h3');
            bowlersTitle.textContent = 'Bowling Card';
            summaryEl.appendChild(bowlersTitle);
            
            const bowlersSummary = this.createBowlersSummary(summary.team2.players);
            summaryEl.appendChild(bowlersSummary);
        }
        
        // Add result if match ended
        if (isMatchEnd) {
            const resultEl = document.createElement('div');
            resultEl.className = 'match-result';
            resultEl.textContent = summary.result;
            summaryEl.appendChild(resultEl);
        }
        
        // Add to document
        document.body.appendChild(summaryEl);
    },
    
    // Create team summary element
    createTeamSummary: function(team, opponentScore = 0) {
        const teamEl = document.createElement('div');
        teamEl.className = 'team-summary';
        
        const nameEl = document.createElement('h4');
        nameEl.textContent = team.name;
        teamEl.appendChild(nameEl);
        
        const scoreEl = document.createElement('div');
        scoreEl.className = 'team-score';
        scoreEl.textContent = `${team.runs}/${team.wickets} (${Math.floor(team.overs)}.${team.balls} overs)`;
        teamEl.appendChild(scoreEl);
        
        if (opponentScore > 0) {
            const resultEl = document.createElement('div');
            resultEl.className = 'team-result';
            
            if (team.runs > opponentScore) {
                resultEl.textContent = `Won by ${10 - team.wickets} wickets`;
            } else if (team.runs < opponentScore) {
                resultEl.textContent = `Lost by ${opponentScore - team.runs} runs`;
            } else {
                resultEl.textContent = 'Match tied';
            }
            
            teamEl.appendChild(resultEl);
        }
        
        return teamEl;
    },
    
    // Create batsmen summary
    createBatsmenSummary: function(players) {
        const table = document.createElement('table');
        table.className = 'summary-table';
        
        // Header
        const header = document.createElement('tr');
        header.innerHTML = `
            <th>Batsman</th>
            <th>Runs</th>
            <th>Balls</th>
            <th>SR</th>
            <th>Status</th>
        `;
        table.appendChild(header);
        
        // Rows
        for (const playerId in players) {
            const player = players[playerId];
            if (player.balls > 0) { // Only show players who batted
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${player.name}</td>
                    <td>${player.runs}</td>
                    <td>${player.balls}</td>
                    <td>${(player.runs / player.balls * 100).toFixed(2)}</td>
                    <td>${player.isOut ? 'out' : 'not out'}</td>
                `;
                table.appendChild(row);
            }
        }
        
        return table;
    },
    
    // Create bowlers summary
    createBowlersSummary: function(players) {
        const table = document.createElement('table');
        table.className = 'summary-table';
        
        // Header
        const header = document.createElement('tr');
        header.innerHTML = `
            <th>Bowler</th>
            <th>Overs</th>
            <th>Runs</th>
            <th>Wickets</th>
            <th>ER</th>
        `;
        table.appendChild(header);
        
        // Rows
        for (const playerId in players) {
            const player = players[playerId];
            if (player.bowlingBalls > 0) { // Only show players who bowled
                const overs = Math.floor(player.bowlingBalls / 6);
                const balls = player.bowlingBalls % 6;
                const er = (player.bowlingRuns / (overs + balls / 6)).toFixed(2);
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${player.name}</td>
                    <td>${overs}.${balls}</td>
                    <td>${player.bowlingRuns}</td>
                    <td>${player.wickets}</td>
                    <td>${er}</td>
                `;
                table.appendChild(row);
            }
        }
        
        return table;
    }
};

// Show innings summary
function showInningsSummary(summary, isMatchEnd = false) {
    summaryManager.show(summary, isMatchEnd);
}
