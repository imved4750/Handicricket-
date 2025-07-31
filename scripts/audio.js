// Audio manager
const audioManager = {
    sounds: {
        boundary: new Audio('assets/sounds/boundary.mp3'),
        six: new Audio('assets/sounds/six.mp3'),
        wicket: new Audio('assets/sounds/wicket.mp3'),
        milestone: new Audio('assets/sounds/milestone.mp3'),
        crowd: new Audio('assets/sounds/crowd.mp3'),
        noBall: new Audio('assets/sounds/no-ball.mp3')
    },
    
    // Play sound
    play: function(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play();
        }
    },
    
    // Play crowd noise
    playCrowd: function(intensity = 0.5) {
        this.sounds.crowd.volume = intensity;
        this.sounds.crowd.loop = true;
        this.sounds.crowd.play();
    },
    
    // Stop crowd noise
    stopCrowd: function() {
        this.sounds.crowd.pause();
        this.sounds.crowd.currentTime = 0;
    },
    
    // Adjust crowd volume based on match situation
    updateCrowd: function(runs, isBoundary, isWicket) {
        let volume = 0.3;
        
        if (isBoundary) {
            volume = runs === 4 ? 0.7 : 1.0;
            this.play(runs === 4 ? 'boundary' : 'six');
        } else if (isWicket) {
            volume = 0.8;
            this.play('wicket');
        }
        
        this.sounds.crowd.volume = volume;
    }
};

// Play sound effect
function playSound(soundName) {
    audioManager.play(soundName);
}

// Initialize audio
function initAudio() {
    // Preload sounds
    for (const sound in audioManager.sounds) {
        audioManager.sounds[sound].load();
    }
    
    // Start ambient crowd noise
    audioManager.playCrowd(0.3);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAudio);
