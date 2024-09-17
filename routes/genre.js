const express = require('express');
const router = express.Router();
const Genre = require('../models/genre');
const Track = require('../models/track');

router.get('/:id', async (req, res, next) => {
    try {
        const genreId = req.params.id;
        // Fetch the genre and associated tracks using the correct alias
        const genre = await Genre.findByPk(genreId, {
            include: [{
                model: Track,
                as: 'Tracks' // Use the alias specified in the model association
            }]
        });

        if (!genre) {
            return res.status(404).send('Genre not found');
        }

        // Prepare data to pass to the EJS template
        const genreData = {
            name: genre.name,
            imagePath: genre.imagePath,
            tracks: genre.Tracks.map(track => ({
                id: track.id,
                title: track.title,
                artist: track.artist,
                songPath: track.songPath
            }))
        };

        // Track list focused on the visual representation of tracks
        const trackList2 = genre.Tracks.map(track => ({
            id: track.id,
            imagePath: track.imagePath || 'default-image.jpg',
            title: track.title,
            artist: track.artist,
            songPath: track.songPath
        }));

        // Detailed information about each track
        const song = genre.Tracks.map(track => ({
            id: track.id,
            title: track.title,
            filePath: track.filePath,
            duration: track.duration,
            imagePath: track.imagePath || 'default-image.jpg',
            artist: track.artist
        }));

        // Render the genre page with the tracks
        res.render('nav/genre', {
            user: req.user, // Pass the user object if available
            genreList: null,
            genre: genreData,
            trackList2,
            song
        });
    } catch (error) {
        console.error('Error fetching genre data:', error);
        res.status(500).send('Error fetching genre data');
    }
});

module.exports = router;
