console.log("Welcome to Spotify");

// Initialize the Variables
let songIndex = 0;
let audioElement = new Audio('songs/1.mp3');
audioElement.volume = 0.8;

let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItems = Array.from(document.getElementsByClassName('songItem'));
let currentTimeLabel = document.getElementById('currentTime');
let totalTimeLabel = document.getElementById('totalTime');
let bannerCover = document.getElementById('bannerCover');
let bannerSongName = document.getElementById('bannerSongName');
let volumeBar = document.getElementById('volumeBar');
let muteBtn = document.getElementById('muteBtn');
let shuffleBtn = document.getElementById('shuffle');
let repeatBtn = document.getElementById('repeat');
let searchSongs = document.getElementById('searchSongs');
let navHome = document.getElementById('navHome');
let navAbout = document.getElementById('navAbout');
let homeSection = document.getElementById('homeSection');
let playerControls = document.getElementById('playerControls');
let aboutPage = document.getElementById('aboutPage');
let aboutClose = document.getElementById('aboutClose');
let aboutCloseBottom = document.getElementById('aboutCloseBottom');

let isShuffle = false;
let repeatMode = 'off';

let songs = [
    {songName: "Warriyo - Mortals [NCS Release]", filePath: "songs/1.mp3", coverPath: "covers/1.jpg"},
    {songName: "Cielo - Huma-Huma", filePath: "songs/2.mp3", coverPath: "covers/2.jpg"},
    {songName: "DEAF KEV - Invincible [NCS Release]-320k", filePath: "songs/3.mp3", coverPath: "covers/3.jpg"},
    {songName: "Different Heaven & EH!DE - My Heart [NCS Release]", filePath: "songs/4.mp3", coverPath: "covers/4.jpg"},
    {songName: "Janji-Heroes-Tonight-feat-Johnning-NCS-Release", filePath: "songs/5.mp3", coverPath: "covers/5.jpg"},
    {songName: "Rabba - Salam-e-Ishq", filePath: "songs/6.mp3", coverPath: "covers/6.jpg"},
    {songName: "Sakhiyaan - Salam-e-Ishq", filePath: "songs/7.mp3", coverPath: "covers/7.jpg"},
    {songName: "Bhula Dena - Salam-e-Ishq", filePath: "songs/8.mp3", coverPath: "covers/8.jpg"},
    {songName: "Tumhari Kasam - Salam-e-Ishq", filePath: "songs/9.mp3", coverPath: "covers/9.jpg"},
    {songName: "Na Jaana - Salam-e-Ishq", filePath: "songs/10.mp3", coverPath: "covers/10.jpg"},
]

const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return '00:00';
    }
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const remainingSeconds = String(Math.floor(seconds % 60)).padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
};

const setActiveNav = (target) => {
    navHome.classList.toggle('isActive', target === 'home');
    navAbout.classList.toggle('isActive', target === 'about');
};

const openAboutPage = () => {
    aboutPage.hidden = false;
    homeSection.hidden = true;
    playerControls.hidden = true;
    document.body.classList.add('about-mode');
    setActiveNav('about');
    aboutPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const closeAboutPage = () => {
    aboutPage.hidden = true;
    homeSection.hidden = false;
    playerControls.hidden = false;
    document.body.classList.remove('about-mode');
    setActiveNav('home');
};

songItems.forEach((element, i) => {
    element.getElementsByTagName("img")[0].src = songs[i].coverPath;
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
});

const updateMasterPlayUI = (isPlaying) => {
    masterPlay.textContent = isPlaying ? '⏸' : '▶';
    gif.style.opacity = isPlaying ? 1 : 0;
};

const makeAllPlays = () => {
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
        element.textContent = '▶';
    });
    songItems.forEach((item) => item.classList.remove('activeSong'));
};

const updateSongButtonState = () => {
    makeAllPlays();
    const activeButton = document.getElementById(String(songIndex));
    if (activeButton && !audioElement.paused) {
        activeButton.textContent = '⏸';
    }
    if (songItems[songIndex]) {
        songItems[songIndex].classList.add('activeSong');
    }
};

const updateNowPlaying = () => {
    masterSongName.innerText = songs[songIndex].songName;
    bannerSongName.innerText = songs[songIndex].songName;
    bannerCover.src = songs[songIndex].coverPath;
};

const setSong = (index, shouldAutoplay = true) => {
    songIndex = index;
    audioElement.src = songs[songIndex].filePath;
    updateNowPlaying();
    audioElement.currentTime = 0;
    myProgressBar.value = 0;
    currentTimeLabel.textContent = '00:00';

    if (shouldAutoplay) {
        audioElement.play();
        updateMasterPlayUI(true);
    } else {
        updateMasterPlayUI(false);
    }

    updateSongButtonState();
};

const getRandomSongIndex = () => {
    if (songs.length <= 1) {
        return songIndex;
    }
    let randomIndex = songIndex;
    while (randomIndex === songIndex) {
        randomIndex = Math.floor(Math.random() * songs.length);
    }
    return randomIndex;
};

const playNextSong = () => {
    const nextIndex = isShuffle ? getRandomSongIndex() : (songIndex >= songs.length - 1 ? 0 : songIndex + 1);
    setSong(nextIndex);
};

const playPreviousSong = () => {
    if (audioElement.currentTime > 3) {
        audioElement.currentTime = 0;
        return;
    }

    const prevIndex = isShuffle ? getRandomSongIndex() : (songIndex <= 0 ? songs.length - 1 : songIndex - 1);
    setSong(prevIndex);
};

updateNowPlaying();
volumeBar.value = Math.round(audioElement.volume * 100);

// Handle play/pause click
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        updateMasterPlayUI(true);
        updateSongButtonState();
    } else {
        audioElement.pause();
        updateMasterPlayUI(false);
        updateSongButtonState();
    }
});

// Listen to Events
audioElement.addEventListener('timeupdate', () => {
    // Update Seekbar
    if (!Number.isNaN(audioElement.duration) && audioElement.duration > 0) {
        const progress = parseInt((audioElement.currentTime / audioElement.duration) * 100, 10);
        myProgressBar.value = progress;
        currentTimeLabel.textContent = formatTime(audioElement.currentTime);
        totalTimeLabel.textContent = formatTime(audioElement.duration);
    }
});

audioElement.addEventListener('loadedmetadata', () => {
    totalTimeLabel.textContent = formatTime(audioElement.duration);
});

myProgressBar.addEventListener('input', () => {
    if (!Number.isNaN(audioElement.duration) && audioElement.duration > 0) {
        audioElement.currentTime = (myProgressBar.value * audioElement.duration) / 100;
    }
});

audioElement.addEventListener('ended', () => {
    if (repeatMode === 'one') {
        setSong(songIndex);
        return;
    }

    if (!isShuffle && repeatMode === 'off' && songIndex === songs.length - 1) {
        audioElement.currentTime = 0;
        updateMasterPlayUI(false);
        updateSongButtonState();
        return;
    }

    playNextSong();
});

Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
    element.addEventListener('click', (e) => {
        const clickedIndex = parseInt(e.target.id, 10);
        const isSameSong = songIndex === clickedIndex;

        if (isSameSong && !audioElement.paused) {
            audioElement.pause();
            updateMasterPlayUI(false);
            updateSongButtonState();
            return;
        }

        if (isSameSong && audioElement.paused) {
            audioElement.play();
            updateMasterPlayUI(true);
            updateSongButtonState();
            return;
        }

        setSong(clickedIndex);
    });
});

document.getElementById('next').addEventListener('click', () => {
    playNextSong();
});

document.getElementById('previous').addEventListener('click', () => {
    playPreviousSong();
});

shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('isOn', isShuffle);
});

repeatBtn.addEventListener('click', () => {
    if (repeatMode === 'off') {
        repeatMode = 'all';
        repeatBtn.textContent = '🔁';
    } else if (repeatMode === 'all') {
        repeatMode = 'one';
        repeatBtn.textContent = '🔂';
    } else {
        repeatMode = 'off';
        repeatBtn.textContent = '🔁';
    }
    repeatBtn.classList.toggle('isOn', repeatMode !== 'off');
});

volumeBar.addEventListener('input', () => {
    audioElement.volume = Number(volumeBar.value) / 100;
    audioElement.muted = false;

    if (audioElement.volume === 0) {
        muteBtn.textContent = '🔇';
    } else {
        muteBtn.textContent = '🔊';
    }
});

muteBtn.addEventListener('click', () => {
    audioElement.muted = !audioElement.muted;
    muteBtn.textContent = audioElement.muted ? '🔇' : '🔊';
});

searchSongs.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();

    songItems.forEach((songItem, index) => {
        const match = songs[index].songName.toLowerCase().includes(query);
        songItem.style.display = match ? 'flex' : 'none';
    });
});

navHome.addEventListener('click', () => {
    closeAboutPage();
    homeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

navAbout.addEventListener('click', () => {
    if (aboutPage.hidden) {
        openAboutPage();
    } else {
        closeAboutPage();
    }
});

aboutClose.addEventListener('click', () => {
    closeAboutPage();
    navHome.focus();
});

aboutCloseBottom.addEventListener('click', () => {
    closeAboutPage();
    navHome.focus();
});

document.addEventListener('keydown', (event) => {
    const targetTag = event.target.tagName;
    if (targetTag === 'INPUT' || targetTag === 'TEXTAREA') {
        return;
    }

    if (event.code === 'Space') {
        event.preventDefault();
        masterPlay.click();
    }

    if (event.key.toLowerCase() === 'n') {
        playNextSong();
    }

    if (event.key.toLowerCase() === 'p') {
        playPreviousSong();
    }

    if (event.code === 'ArrowRight') {
        audioElement.currentTime = Math.min(audioElement.currentTime + 5, audioElement.duration || audioElement.currentTime + 5);
    }

    if (event.code === 'ArrowLeft') {
        audioElement.currentTime = Math.max(audioElement.currentTime - 5, 0);
    }
});

// Populate song durations in the list when metadata is loaded.
songs.forEach((song, index) => {
    const metadataAudio = new Audio(song.filePath);
    metadataAudio.addEventListener('loadedmetadata', () => {
        const totalSeconds = Math.floor(metadataAudio.duration || 0);
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        const timestamp = songItems[index]?.querySelector('.timestamp');
        const playIcon = timestamp?.querySelector('.songItemPlay');
        const timeLabel = timestamp?.querySelector('.timeLabel');
        if (timeLabel && playIcon) {
            timeLabel.textContent = `${minutes}:${seconds}`;
        }
    });
});

updateSongButtonState();