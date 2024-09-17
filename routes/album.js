const express = require('express');
const router = express.Router();
const Album = require('../models/albums'); // Ensure this path is correct
const Track = require('../models/track');

// Route to fetch an album and its associated tracks by album ID
router.get('/:id', async (req, res, next) => {
    try {
        const albumId = req.params.id; // Get the album ID from the request parameters

        // Fetch the album and associated tracks
        const album = await Album.findByPk(albumId, {
            include: [{ model: Track, as: 'Tracks' }] // Use alias here
        });  
        if (!album) {
            return res.status(404).send('Album not found');
        }

        // Prepare data to pass to the EJS template
        const albumData = {
            title: album.Title,          // Album title
            artist: album.Artist,        // Album artist
            imagePath: album.ImagePath || 'default-album-image.jpg', // Default image if not set
            tracks: album.Tracks.map(track => ({
                id: track.id,            // Track ID
                title: track.title,      // Track title
                artist: track.artist,    // Artist of the track
                songPath: track.songPath  // Path to the audio file
            }))
        };

        // Prepare a track list for visual representation of tracks
        const trackList = album.Tracks.map(track => ({
            id: track.id,
            image: track.imagePath || 'default-track-image.jpg', // Default image if not set
            title: track.title,
            artist: track.artist,
            songPath: track.songPath
        }));

        // Prepare detailed information about each track
        const song = album.Tracks.map(track => ({
            id: track.id,                // Track ID
            title: track.title,          // Track title
            filePath: track.songPath,    // Path to the audio file
            duration: track.Duration,     // Duration of the track
            imagePath: track.imagePath || 'default-image.jpg', // Default image if not set
            artist: track.artist          // Artist of the track
        }));

        // Render the album page with the tracks
        res.render('nav/album', {
            user: req.user,  // Pass the user object if available
            albumList: null,
            album: albumData,
            trackList,
            song
        });
    } catch (error) {
        console.error('Error fetching album data:', error);
        res.status(500).send('Error fetching album data');
    }
});


module.exports = router;
