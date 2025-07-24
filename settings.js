const backgroundMusic = new Audio("sounds/background.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

const correctSound = new Audio("sounds/correct.mp3");
const wrongSound = new Audio("sounds/wrong.mp3");

let musicEnabled = true;
let sfxEnabled = true;

function saveSettings() {
    localStorage.setItem('musicEnabled', musicEnabled);
    localStorage.setItem('sfxEnabled', sfxEnabled);
}

function loadSettings() {
    const music = localStorage.getItem('musicEnabled');
    const sfx = localStorage.getItem('sfxEnabled');

    musicEnabled = music === null ? true : music === 'true';
    sfxEnabled = sfx === null ? true : sfx === 'true';

    document.getElementById("bgm-toggle").checked = musicEnabled;
    document.getElementById("sfx-toggle").checked = sfxEnabled;

    if (musicEnabled) {
        backgroundMusic.play();
    }
}

window.addEventListener("DOMContentLoaded", () => {
    loadSettings();

    const musicToggle = document.getElementById("bgm-toggle");
    const sfxToggle = document.getElementById("sfx-toggle");

    musicToggle.addEventListener("change", function () {
        musicEnabled = this.checked;
        if (musicEnabled) {
            backgroundMusic.play();
        } else {
            backgroundMusic.pause();
        }
        saveSettings();
    });

    sfxToggle.addEventListener("change", function () {
        sfxEnabled = this.checked;
        saveSettings();
    });

    const saveBtn = document.getElementById("saveBtn");
    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            alert("Cài đặt đã được lưu.");
        });
    }
});

function playCorrectSound() {
    if (sfxEnabled) correctSound.play();
}

function playWrongSound() {
    if (sfxEnabled) wrongSound.play();
}

window.playCorrectSound = playCorrectSound;
window.playWrongSound = playWrongSound;
