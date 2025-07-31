import { game } from './game.js';
import { playSound } from './audio.js';

export function updateUI(match) {
  // Update scoreboard
  document.getElementById('team1-score').textContent = match.team1;
  document.getElementById('team2-score').textContent = match.team2;
  document.getElementById('runs').textContent = match.runs || 0;
  document.getElementById('wickets').textContent = match.wickets || '0.0';
  document.getElementById('overs').textContent = `${Math.floor(match.currentOver)}.${match.currentBall || 0}`;
  
  // Update powerplay indicator
  const isPP = game.checkPowerplay(match.currentOver);
  document.getElementById('powerplay-indicator').style.display = isPP ? 'block' : 'none';
  
  // Update batter/bowler stats
  updatePlayerCards();
}

export function showSummary(match, type) {
  const summaryDiv = document.createElement('div');
  summaryDiv.className = 'summary-overlay';
  
  if (type === 'innings') {
    summaryDiv.innerHTML = `
      <div class="icc-summary">
        <h2>${match.innings === 1 ? 'First' : 'Second'} Innings Summary</h2>
        <div class="scorecard">
          <h3>${match.innings === 1 ? match.team1 : match.team2} ${match.runs}/${match.wickets} (${match.currentOver}.${match.currentBall} overs)</h3>
          <div class="batters-summary"></div>
          <div class="bowlers-summary"></div>
        </div>
        <button id="start-next-innings">Start Next Innings</button>
      </div>
    `;
  } else {
    summaryDiv.innerHTML = `
      <div class="icc-summary">
        <h2>Match Summary</h2>
        <div class="result">
          <h3>${match.winner} won by ${match.resultMargin}</h3>
        </div>
        <div class="scorecards">
          <div class="team1-scorecard"></div>
          <div class="team2-scorecard"></div>
        </div>
        <div class="awards">
          <h3>Player of the Match: ${match.potm}</h3>
        </div>
        <button id="back-to-lobby">Back to Lobby</button>
      </div>
    `;
  }
  
  document.body.appendChild(summaryDiv);
}

function updatePlayerCards() {
  // Implement detailed player stat cards
}
