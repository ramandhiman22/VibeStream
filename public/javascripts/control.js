// Get references to the elements
const musicPlayer = document.querySelector('.music-player');
const audioPlayer = document.getElementById('audioPlayer');
const albumCover = document.getElementById('albumCover');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtnP = document.getElementById('prevBtnP');
const nextBtnP = document.getElementById('nextBtnP');
const volumeBtn = document.getElementById('volumeBtn');
const volumeRange = document.getElementById('volumeRange');
const progressBar = document.getElementById('progressBar');
const currentTimeElem = document.getElementById('currentTime');
const durationElem = document.getElementById('duration');

let isPlaying = false;
let currentIndex = 0; // Track the current song index
let currentSource = 'newReleases'; // Default source

let newReleases = [];
let playlists = [];
let artists = [];
let albums = [];
let genresData = []; // Add a new array for genres

// Function to set up data from your page (ensure these elements exist)
function setupData() {
    const newReleasesElement = document.getElementById('new-releases-data');
    const playlistsElement = document.getElementById('playlists-data');
    const artistsElement = document.getElementById('artists-data');
    const albumsElement = document.getElementById('albums-data');
    const genresElement = document.getElementById('genres-data'); // Add a reference to the genres data element

    if (newReleasesElement) {
        newReleases = JSON.parse(newReleasesElement.getAttribute('data-new-releases'));
    }
    if (playlistsElement) {
        playlists = JSON.parse(playlistsElement.getAttribute('data-playlists'));
    }
    if (artistsElement) {
        artists = JSON.parse(artistsElement.getAttribute('data-artists'));
    }
    if (albumsElement) {
        albums = JSON.parse(albumsElement.getAttribute('data-albums'));
    }
    if (genresElement) {
        genresData = JSON.parse(genresElement.getAttribute('data-genres')); // Parse the genres data
    }
}

setupData();

// Function to format time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Function to play the next song
function playNext() {
    if (currentSource === 'newReleases') {
        playNextSong(newReleases);
    } else if (currentSource === 'playlists') {
        playNextSong(playlists);
    } else if (currentSource === 'artists') {
        playNextSong(artists);
    } else if (currentSource === 'albums') {
        playNextSong(albums);
    } else if (currentSource === 'genres') { // Add a check for genres
        playNextSong(genresData);
    }
}

// Function to play the previous song in the playlist
function playPreviousSong() {
    if (currentSource === 'newReleases') {
        playPreviousSongFromSource(newReleases);
    } else if (currentSource === 'playlists') {
        playPreviousSongFromSource(playlists);
    } else if (currentSource === 'artists') {
        playPreviousSongFromSource(artists);
    } else if (currentSource === 'albums') {
        playPreviousSongFromSource(albums);
    } else if (currentSource === 'genres') { // Add a check for genres
        playPreviousSongFromSource(genresData);
    }
}

// Generalized function to play the next song
function playNextSong(sourceArray) {
    if (!sourceArray.length) return; // Exit if the array is empty

    currentIndex = (currentIndex + 1) % sourceArray.length;
    const nextRelease = sourceArray[currentIndex];
    playSong(nextRelease.songPath, nextRelease.image, nextRelease.title, nextRelease.artist);
}

// Generalized function to play the previous song
function playPreviousSongFromSource(sourceArray) {
    if (!sourceArray.length) return; // Exit if the array is empty

    currentIndex = (currentIndex - 1 + sourceArray.length) % sourceArray.length;
    const prevRelease = sourceArray[currentIndex];
    playSong(prevRelease.songPath, prevRelease.image, prevRelease.title, prevRelease.artist);
}

// Example function to switch the source
function switchSource(sourceType) {
    currentSource = sourceType;
    currentIndex = 0; // Reset the index
    // Optionally, load the first song if necessary
    if (currentSource === 'newReleases') {
        playNextSong(newReleases);
    } else if (currentSource === 'playlists') {
        playNextSong(playlists);
    } else if (currentSource === 'artists') {
        playNextSong(artists);
    } else if (currentSource === 'albums') {
        playNextSong(albums);
    } else if (currentSource === 'genres') { // Add a check for genres
        playNextSong(genresData);
    }
}

// Function to play a song
function playSong(songPath, albumImage, title, artist, shouldPlay = true) {
    // Set the audio source, album cover, title, and artist
    audioPlayer.src = songPath;
    albumCover.src = albumImage;
    songTitle.textContent = title;
    songArtist.textContent = artist;

    // Display the music player container
    musicPlayer.style.display = 'flex';

    // Only play the song if shouldPlay is true
    if (shouldPlay) {
        audioPlayer.play();
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }

    // Update the duration when the metadata is loaded
    audioPlayer.onloadedmetadata = () => {
        durationElem.textContent = formatTime(audioPlayer.duration);
        progressBar.max = audioPlayer.duration;
    };
}

// Play/Pause button click event
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    } else {
        audioPlayer.play();
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }
});

// Update progress bar and current time display
audioPlayer.addEventListener('timeupdate', () => {
    progressBar.value = audioPlayer.currentTime;
    currentTimeElem.textContent = formatTime(audioPlayer.currentTime);

    // Check if the song has ended, and play the next song if so
    if (audioPlayer.ended) {
        playNext();
    }
});

// Allow seeking through the progress bar
progressBar.addEventListener('input', () => {
    audioPlayer.currentTime = progressBar.value;
});

// Volume control
volumeRange.addEventListener('input', () => {
    audioPlayer.volume = volumeRange.value;
});

// Mute/Unmute functionality
volumeBtn.addEventListener('click', () => {
    if (audioPlayer.muted) {
        audioPlayer.muted = false;
        volumeBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    } else {
        audioPlayer.muted = true;
        volumeBtn.innerHTML = '<i class="fa-solid fa-volume-mute"></i>';
    }
});

// Next button click event
nextBtnP.addEventListener('click', () => {
    playNext();
});

// Previous button click event
prevBtnP.addEventListener('click', () => {
    playPreviousSong();
});

// Save the current state before the page unloads
window.addEventListener('beforeunload', () => {
    const currentSongState = {
        songPath: audioPlayer.src,
        albumImage: albumCover.src,
        title: songTitle.textContent,
        artist: songArtist.textContent,
        currentTime: audioPlayer.currentTime,
        volume: audioPlayer.volume,
        isPlaying: isPlaying
    };
    sessionStorage.setItem('currentSongState', JSON.stringify(currentSongState));
});

// Restore the state on page load
window.addEventListener('DOMContentLoaded', () => {
    const storedState = sessionStorage.getItem('currentSongState');
    if (storedState) {
        const songState = JSON.parse(storedState);
        playSong(songState.songPath, songState.albumImage, songState.title, songState.artist, songState.isPlaying);
        audioPlayer.currentTime = songState.currentTime;
        audioPlayer.volume = songState.volume;

        // Update play/pause button based on the playing state
        if (songState.isPlaying) {
            playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        } else {
            playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        }
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const downloadButtons = document.querySelectorAll('.download-btn');

    downloadButtons.forEach(button => {
        button.addEventListener('click', async function(event) {
            event.preventDefault(); // Prevent default behavior

            const url = this.getAttribute('data-url');

            try {
                // Make a request to the server to check if the user can download
                const response = await fetch(url, { method: 'GET' });

                if (response.ok) {
                    // Redirect to the download URL
                    window.location.href = url;
                } else {
                    // Parse the JSON response
                    const data = await response.json();
                    // Show alert with the message from the server
                    alert(data.message || 'An unexpected error occurred.');
                }
            } catch (error) {
                console.error('Error checking download permissions:', error);
                alert('An error occurred while checking download permissions.');
            }
        });
    });
});
