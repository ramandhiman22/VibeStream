const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const Track = require('../models/track');

router.get('/:id', async function(req, res, next) {
    try {
        const playlistId = req.params.id;

        // Fetch the playlist details using the ID from the URL
        const playlist = await Playlist.findOne({ where: { Playlist_ID: playlistId } });

        if (!playlist) {
            return res.status(404).send('Playlist not found');
        }

        // Log the fetched playlist details
        console.log("Fetched Playlist:", playlist);

        // Fetch the tracks associated with the playlist by vibe
        const tracks = await Track.findAll({ where: { vibe: playlist.Name } });

        // Log the number of tracks found
        console.log("Number of tracks found:", tracks.length);

        // Pass the playlist details and tracks to the EJS template
        res.render('nav/playlist', {
            user: req.user,
            playlistList: null,
            playlist: {
                id: playlist.Playlist_ID,
                name: playlist.Name,
                imagePath: playlist.Image || 'default-image.jpg'
            },
            trackList: tracks.map(track => ({
                id: track.id,
                image: track.imagePath || 'default-image.jpg',
                title: track.title,
                artist: track.artist,
                songPath: track.songPath
            })),
            newReleases: tracks.map(track => ({
                image: track.imagePath || 'default-image.jpg',
                title: track.title,
                artist: track.artist,
                songPath: track.songPath
            })),
            song: tracks.map(track => ({
                id: track.id,
                title: track.title,
                filePath: track.filePath,
                duration: track.duration,
                imagePath: track.imagePath,
                artist: track.artist
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
