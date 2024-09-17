const express = require('express');
const router = express.Router();
const Track = require('../models/track');
const Artist = require('../models/Artist');
const { Op } = require('sequelize'); // Import Sequelize operators

router.get('/:id', async function(req, res, next) {
    try {
        const artistId = req.params.id;

        // Fetch the artist details using the ID from the URL
        const artist = await Artist.findOne({ where: { id: artistId } });

        if (!artist) {
            return res.status(404).send('Artist not found');
        }

        console.log("Artist ID:", artistId);
        console.log("Artist Name:", artist.name.trim()); // Log the artist name

        // Fetch the tracks associated with the artist by artist name
        const tracks = await Track.findAll({
            where: {
                artist: {
                    [Op.like]: artist.name.trim() // Trim to avoid spaces
                }
            }
        });

        console.log("Tracks Found:", tracks.length); // Log the number of tracks found

        // Pass the artist details and tracks to the EJS template
        res.render('nav/artist', {
            user: req.user,
            artist: {
                id: artist.id,
                name: artist.name,
                genre: artist.genre,
                bio: artist.bio,
                imagePath: artist.imagePath // Ensure this path is correct
            },
            trackList: tracks.map(track => ({
                image: track.imagePath || 'default-image.jpg',
                title: track.title,
                artist: track.artist,
                songPath: track.songPath
            })),
            artistList: null,
            newReleases: tracks.map(track => ({
                id: track.id,
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
                artist: artist.name,
            })),
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
