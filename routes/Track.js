const express = require('express');
const multer = require('multer');
const path = require('path');
const Track = require('../models/track');
const Artist = require('../models/Artist');
const Playlist = require('../models/Playlist');
const Album = require('../models/albums');
const Genre = require('../models/genre');
const isAdmin = require('../middlewares/isAdmin'); // Assuming the middleware is stored in a middleware directory
const { Op } = require('sequelize');

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Routes with Admin Protection
router.get('/upload', isAdmin, (req, res) => {
    res.render('upload');
});

router.post('/upload', isAdmin, upload.fields([
    { name: 'song', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), async (req, res) => {
    try {
        const { title, artist, Duration, Vibe, genreName, albumName } = req.body;

        let genre = null;
        let album = null;

        // If genreName is provided, find or create the genre (case-insensitive match for MySQL)
        if (genreName && genreName.trim() !== '') {
            genre = await Genre.findOne({ 
                where: { 
                    name: { 
                        [Op.like]: genreName.trim() // Use Op.like for case-insensitive matching in MySQL
                    } 
                } 
            });

            if (!genre) {
                genre = await Genre.create({ name: genreName.trim() });
            }
        }

        // If albumName is provided, find or create the album
        if (albumName && albumName.trim() !== '') {
            album = await Album.findOne({ 
                where: { 
                    Title: { 
                        [Op.like]: albumName.trim() 
                    }
                } 
            });
            if (!album) {
                album = await Album.create({ Title: albumName.trim(), Artist: artist.trim() });
                console.log('Album created:', album);  // Log the newly created album details
            }
        }

        if (!req.files || !req.files.song || !req.files.image) {
            throw new Error('No files uploaded');
        }

        const songPath = `/uploads/${req.files.song[0].filename}`;
        const imagePath = `/uploads/${req.files.image[0].filename}`;

        const trackData = {
            title: title.trim(),
            artist: artist.trim(),
            Duration,
            Vibe: Vibe.trim(),
            songPath,
            imagePath
        };

        // Only include genreId if genre was found or created
        if (genre) {
            trackData.genreId = genre.id;
        }

        // Only include albumId if album was found or created
        if (album) {
            trackData.albumId = album.Album_ID; // Assuming Album_ID is the correct field
        }

        // Create the track with the available data
        const track = await Track.create(trackData);

        res.redirect('/track/upload');
    } catch (error) {
        console.error('Error uploading track:', error.message);
        res.status(500).send('Error uploading track');
    }
});
+
router.post('/upload-artist', upload.single('image'), async (req, res) => {
    try {
        const { artistName, artistGenre } = req.body;
        const artistImage = req.file ? req.file.path.replace(/\\/g, '/') : null; // Correctly format path for storage

        if (!artistName || !artistGenre || !artistImage) {
            return res.status(400).send('All fields are required.');
        }

        // Save the artist data to the database
        await Artist.create({
            name: artistName,
            genre: artistGenre,
            imagePath: artistImage,
        });

        console.log('Artist uploaded successfully');
        res.redirect('/track/upload');
    } catch (error) {
        console.error('Error uploading artist:', error);
        res.status(500).send('Error uploading artist');
    }
});

router.post('/upload-playlist', upload.single('image'), async (req, res) => {
    try {
        const { name } = req.body; // Extract form data
        const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null; // Path to the uploaded file

        if (!name || !imagePath) {
            return res.status(400).send('All fields are required.');
        }

        // Create a new playlist record
        await Playlist.create({
            Name: name,
            Image: imagePath
        });

        res.redirect('/track/upload'); // Redirect to the playlists page or another route
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.post('/upload-albums', upload.single('image'), async (req, res) => {
    const { title, artist, releaseDate, genre } = req.body;
    const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null; // Pat

    try {
        const album = await Album.create({
            Title: title,
            Artist: artist,
            ImagePath: imagePath,
            ReleaseDate: releaseDate,
            Genre: genre,
        });
        res.status(201).redirect('/track/upload'); // Redirect or render a success page
    } catch (error) {
        res.status(500).json({ error: 'Error uploading album' });
    }
});

router.post('/genres/upload', upload.single('image'), async (req, res, next) => {
    try {
        const { name } = req.body;

        // Set the file path for the genre image
        const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null; // Path to the uploaded file

        // Create the new genre
        const newGenre = await Genre.create({
            name,
            imagePath
        });

        res.status(201).redirect('/track/upload');
    } catch (error) {
        console.error('Error uploading genre:', error);
        res.status(500).json({ error: 'Error uploading genre' });
    }
});

router.get('/delete', async (req, res) => {
    try {
        const tracks = await Track.findAll();
        const albums = await Album.findAll();
        const playlists = await Playlist.findAll();
        const genres = await Genre.findAll();

        res.render('deleteItems', { tracks, albums, playlists, genres });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Route to handle deletion
router.post('/delete/:type/:id', async (req, res) => {
    const { type, id } = req.params;

    try {
        if (type === 'track') {
            await Track.destroy({ where: { id } });
        } else if (type === 'album') {
            // First, delete related tracks
            await Track.destroy({ where: { albumId: id } });
            // Then, delete the album
            await Album.destroy({ where: { Album_ID: id } });
        } else if (type === 'playlist') {
            await Playlist.destroy({ where: { Playlist_ID: id } });
        } else if (type === 'genre') {
            await Genre.destroy({ where: { id } });
        }
        res.redirect('/track/delete');
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


module.exports = router;
