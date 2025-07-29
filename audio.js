// audio.js - Audio System Implementation
const audioSystem = {
  sounds: {
    crowd: new Audio('sounds/crowd.mp3'),
    bat: new Audio('sounds/bat.mp3'),
    boundary: new Audio('sounds/boundary.mp3'),
    six: new Audio('sounds/six.mp3'),
    wicket: new Audio('sounds/wicket.mp3'),
    noBall: new Audio('sounds/no_ball.mp3'),
    wide: new Audio('sounds/wide.mp3'),
    fifty: new Audio('sounds/fifty.mp3'),
    century: new Audio('sounds/century.mp3'),
    applause: new Audio('sounds/applause.mp3')
  },

  init() {
    // Preload all sounds
    Object.values(this.sounds).forEach(sound => {
      sound.load();
      sound.volume = 0.7; // Default volume
    });
    this.sounds.crowd.loop = true;
    this.sounds.crowd.volume = 0.5;
  },

  play(soundName, volume = 0.7) {
    if (this.sounds[soundName]) {
      const sound = this.sounds[soundName].cloneNode();
      sound.volume = volume;
      sound.play().catch(e => console.log("Audio play failed:", e));
    }
  },

  // Special sound effects
  playBoundary(runs) {
    this.play(runs === 6 ? 'six' : 'boundary');
    this.play('applause', 0.5);
  },

  playWicket() {
    this.play('wicket');
    this.play('applause', 0.3);
  },

  playMilestone(runs) {
    if (runs >= 100) {
      this.play('century');
    } else if (runs >= 50) {
      this.play('fifty');
    }
    this.play('applause', 0.8);
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  audioSystem.init();
  
  // Start ambient crowd noise
  setTimeout(() => {
    audioSystem.sounds.crowd.play().catch(e => console.log("Crowd audio error:", e));
  }, 1000);
});
