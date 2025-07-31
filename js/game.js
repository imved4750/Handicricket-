import { db, ref, onValue, update } from './firebase.js';
import { updateUI, showSummary } from './ui.js';
import { playSound } from './audio.js';
import { updateStats } from './stats.js';

class IHCCGame {
  constructor() {
    this.matchId = null;
    this.teamName = localStorage.getItem('ihcc_team');
    this.players = JSON.parse(localStorage.getItem('ihcc_playing11')) || [];
    this.currentMatch = null;
    this.gameFormats = {
      't5': { overs: 5, powerplay: 2, ppWicket: 0.5, regWicket: 1.0 },
      't10': { overs: 10, powerplay: 3, ppWicket: 0.5, regWicket: 1.0 },
      't20': { overs: 20, powerplay: 6, ppWicket: 0.5, regWicket: 1.0 },
      'odi': { 
        overs: 50, 
        powerplay: [[1,10], [21,30], [41,42]], 
        ppWicket: 0.25, 
        regWicket: 0.5,
        deadOvers: [[11,20], [31,40]]
      },
      'test': { overs: 270, ppWicket: 0.33, regWicket: 0.33 }
    };
  }

  async createMatch(format, opponent) {
    this.matchId = `match_${Date.now()}`;
    const matchData = {
      format,
      team1: this.teamName,
      team2: opponent,
      status: 'waiting',
      created: Date.now(),
      ...this.gameFormats[format]
    };
    await set(ref(db, `matches/${this.matchId}`), matchData);
    return this.matchId;
  }

  async startMatch() {
    const matchRef = ref(db, `matches/${this.matchId}`);
    await update(matchRef, {
      status: 'live',
      toss: Math.random() > 0.5 ? this.teamName : this.currentMatch.team2,
      started: Date.now()
    });
    
    // Initialize player stats
    const stats = {};
    this.players.forEach(player => {
      stats[player.id] = { runs: 0, balls: 0, wickets: 0, wicketsLost: 0 };
    });
    
    await update(ref(db, `matches/${this.matchId}/stats`), stats);
    this.listenToMatch();
  }

  listenToMatch() {
    const matchRef = ref(db, `matches/${this.matchId}`);
    onValue(matchRef, (snapshot) => {
      this.currentMatch = snapshot.val();
      updateUI(this.currentMatch);
      
      if (this.currentMatch.status === 'innings-break') {
        showSummary(this.currentMatch, 'innings');
      } else if (this.currentMatch.status === 'completed') {
        showSummary(this.currentMatch, 'match');
      }
    });
  }

  async playBall(batterId, bowlerId, batterCard, bowlerCard) {
    const matchRef = ref(db, `matches/${this.matchId}`);
    const currentOver = this.currentMatch.currentOver || 0;
    const currentBall = this.currentMatch.currentBall || 0;
    const isPowerplay = this.checkPowerplay(currentOver);
    const isFreeHit = this.currentMatch.freeHit;
    
    let runs = 0;
    let isWicket = false;
    let wicketValue = 0;
    
    // Ball outcome logic
    if (batterCard === 0 && bowlerCard === 0) {
      runs = 1; // No ball + free hit
      await update(matchRef, { freeHit: true });
    } else if (!isFreeHit && batterCard === bowlerCard) {
      isWicket = true;
      wicketValue = isPowerplay ? 
        this.gameFormats[this.currentMatch.format].ppWicket : 
        this.gameFormats[this.currentMatch.format].regWicket;
    } else {
      runs = batterCard > 0 ? batterCard : bowlerCard;
    }
    
    // Update match state
    const updates = {
      currentBall: currentBall + 1,
      [`stats/${batterId}/balls`]: this.currentMatch.stats[batterId].balls + 1,
      [`stats/${batterId}/runs`]: this.currentMatch.stats[batterId].runs + runs,
      [`stats/${bowlerId}/runs`]: this.currentMatch.stats[bowlerId].runs + runs
    };
    
    if (isWicket) {
      updates[`stats/${batterId}/wicketsLost`] = 
        Math.min(1, this.currentMatch.stats[batterId].wicketsLost + wicketValue);
      updates[`stats/${bowlerId}/wickets`] = 
        this.currentMatch.stats[bowlerId].wickets + wicketValue;
    }
    
    await update(matchRef, updates);
    
    // Check for over completion
    if (currentBall >= 5) {
      await this.nextOver();
    }
    
    // Play sounds
    if (runs >= 4) playSound('boundary');
    if (isWicket) playSound('wicket');
  }

  checkPowerplay(over) {
    const format = this.currentMatch.format;
    if (format === 'odi') {
      return this.gameFormats.odi.powerplay.some(([start, end]) => over >= start && over <= end);
    }
    return over < this.gameFormats[format].powerplay;
  }

  async nextOver() {
    const matchRef = ref(db, `matches/${this.matchId}`);
    const updates = {
      currentOver: this.currentMatch.currentOver + 1,
      currentBall: 0,
      freeHit: false
    };
    
    // Check innings completion
    if (updates.currentOver >= this.gameFormats[this.currentMatch.format].overs) {
      updates.status = this.currentMatch.innings === 1 ? 'innings-break' : 'completed';
      updates.innings = this.currentMatch.innings === 1 ? 2 : 1;
    }
    
    await update(matchRef, updates);
  }
}

export const game = new IHCCGame();
