const express = require('express');
const router = express.Router();
const Track = require('../models/track');
const Artist = require('../models/Artist');
const Playlist = require('../models/Playlist');
const Album = require('../models/albums'); // Import the Album model
const Genre = require('../models/genre');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

// GET home page.
router.get('/', async function (req, res, next) {
    try {
        // Fetch all tracks, artists, playlists, and albums from the database
        const tracks = await Track.findAll();
        const artists = await Artist.findAll();
        const playlists = await Playlist.findAll();
        const albums = await Album.findAll(); // Fetch albums
        const genres = await Genre.findAll(); 
        // Prepare new releases (display all songs or apply specific logic)
        const newReleases = tracks.map(track => ({
            image: track.imagePath || 'default-image.jpg',
            title: track.title,
            artist: track.artist,
            songPath: track.songPath,
        }));

        // Prepare carousel items (limiting to 3 for the carousel)
        const carouselItems = tracks.map(track => ({
            imageUrl: track.imagePath || 'default-image.jpg',
            title: track.title,
            artist: track.artist,
            songPath: track.songPath,
        }));

        // Prepare artist data
        const artistList = artists.map(artist => ({
            id: artist.id,
            name: artist.name,
            genre: artist.genre,
            imagePath: artist.imagePath
        }));

        // Prepare the current song (first song in the list)
        const song = {
            image: tracks[0].imagePath,
            title: tracks[0].title,
            artist: tracks[0].artist,
            songPath: tracks[0].songPath
        };

        // Prepare the playlist data
        const playlistList = playlists.map(playlist => ({
            id: playlist.Playlist_ID,
            name: playlist.Name,
            imagePath: playlist.Image || 'default-image.jpg'
        }));

        // Prepare the albums data
        const albumList = albums.map(album => ({
            id: album.Album_ID, // Ensure this field name matches exactly what exists in your data
            imagePath: album.ImagePath || 'default-image.jpg', // Check the correct field name
            title: album.Title, // Check the correct field name
            artist: album.Artist // Check the correct field name
        }));
        const genreList = genres.map(genre => ({
            id: genre.id,
            name: genre.name,
            imagePath: genre.imagePath || 'default-image.jpg' // Ensure the key is 'imagePath'
        }));
        // Render the home page template with the data
        res.render('index', { 
            user: req.user, 
            tracks, 
            newReleases, 
            carouselItems, 
            song, 
            artistList, 
            playlistList,
            albums:albumList,
            genreList
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});
router.get('/Trending', async function (req, res, next) {
    try {
        // Fetch all tracks, artists, playlists, and albums from the database
        const tracks = await Track.findAll();

        // Prepare new releases (display all songs)
        const newReleases = tracks.map(track => ({
            image: track.imagePath || 'default-image.jpg',
            title: track.title,
            artist: track.artist,
            songPath: track.songPath
        }));
        const song = {
            image: tracks[0].imagePath,
            title: tracks[0].title,
            artist: tracks[0].artist,
            songPath: tracks[0].songPath
        };

        // Render the all page template with the data
        res.render('nav/all', { 
            user: req.user, 
            newReleases, 
            song
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});
router.get('/albums', async function (req, res, next) {
    try {
        // Fetch all albums from the database
        const albums = await Album.findAll();
        // Prepare album data
        const albumList = albums.map(album => ({
            id: album.Album_ID,
            imagePath: album.ImagePath || 'default-image.jpg',
            title: album.Title,
            artist: album.Artist
        }));

        // Handle case when there are no albums
        const currentAlbum = albums.length > 0 ? {
            image: albums[0].ImagePath || 'default-image.jpg',
            title: albums[0].Title,
            artist: albums[0].Artist
        } : null;

        // Render the album page template with the data
        res.render('nav/album', { 
            user: req.user,
            album: null, 
            albumList, 
            currentAlbum
        });
    } catch (error) {
        console.error('Error fetching album data:', error);
        res.status(500).send('Error fetching album data');
    }
});

router.get('/playlists', async function (req, res, next) {
    try {
        // Fetch all playlists from the database
        const playlists = await Playlist.findAll();

        // Prepare playlist data
        const playlistList = playlists.map(playlist => ({
            id: playlist.Playlist_ID,
            imagePath: playlist.Image || 'default-image.jpg',
            name: playlist.Name
        }));

        // Render the playlist page template with the data
        res.render('nav/playlist', { 
            user: req.user,
            playlist:null, 
            playlistList, 
        });
    } catch (error) {
        console.error('Error fetching playlist data:', error);
        res.status(500).send('Error fetching playlist data');
    }
});
router.get('/artists', async function (req, res, next) {
    try {
        // Fetch all artists from the database
        const artists = await Artist.findAll();

        // Prepare artist data
        const artistList = artists.map(artist => ({
            id: artist.id,
            name: artist.name,
            genre: artist.genre,
            imagePath: artist.imagePath
        }));
        // Use the first artist as the current artist for display (optional)
        const currentArtist = {
            image: artists[0].imagePath || 'default-image.jpg',
            name: artists[0].name
        };

        // Render the artist page template with the data
        res.render('nav/artist', { 
            user: req.user, 
            artistList, 
            artist:null,
            currentArtist
        });
    } catch (error) {
        console.error('Error fetching artist data:', error);
        res.status(500).send('Error fetching artist data');
    }
});
router.get('/genres', async function (req, res, next) {
    try {
        // Fetch all genres from the database
        const genres = await Genre.findAll(); // Assuming Genre is your Sequelize model

        // Prepare genre data
        const genreList = genres.map(genre => ({
            id: genre.id,
            name: genre.name,
            imagePath: genre.imagePath || 'default-image.jpg' // Ensure the key is 'imagePath'
        }));

        // Render the genre page template with the data
        res.render('nav/genre', { 
            user: req.user,
            genre: null, 
            genreList, 
        });
    } catch (error) {
        console.error('Error fetching genre data:', error);
        res.status(500).send('Error fetching genre data');
    }
});

router.get('/search', async function (req, res, next) {
    try {
        const query = req.query.query; // Get the search query from the request

        // Search for tracks, albums, playlists, and artists
        const [tracks, albums, playlists, artists] = await Promise.all([
            Track.findAll({
                where: {
                    [Op.or]: [
                        { title: { [Op.like]: `%${query}%` } },
                        { artist: { [Op.like]: `%${query}%` } }
                    ]
                }
            }),
            Album.findAll({
                where: {
                    title: { [Op.like]: `%${query}%` }
                }
            }),
            Playlist.findAll({
                where: {
                    name: { [Op.like]: `%${query}%` }
                }
            }),
            Artist.findAll({
                where: {
                    name: { [Op.like]: `%${query}%` }
                }
            })
        ]);

        // Prepare the data for rendering
        const trackList = tracks.map(track => ({
            id: track.id,
            imagePath: track.imagePath || 'default-image.jpg',
            title: track.title,
            artist: track.artist,
            songPath: track.songPath
        }));

        const albumList = albums.map(album => ({
            id: album.Album_ID, // Ensure this field name matches exactly what exists in your data
            imagePath: album.ImagePath || 'default-image.jpg', // Check the correct field name
            title: album.Title, // Check the correct field name
            artist: album.Artist // Check the correct field name
        }));

        const playlistList = playlists.map(playlist => ({
            id: playlist.id,
            imagePath: playlist.imagePath || 'default-image.jpg',
            name: playlist.name
        }));

        const artistList = artists.map(artist => ({
            id: artist.id,
            imagePath: artist.imagePath || 'default-image.jpg',
            name: artist.name
        }));

        // If no results are found, set a flag to show the "No results found" message
        const noResultsFound = trackList.length === 0 && albumList.length === 0 && playlistList.length === 0 && artistList.length === 0;

        // Render the search results page
        res.render('nav/search', {
            user: req.user,
            query,
            trackList,
            albumList,
            playlistList,
            artistList,
            noResultsFound
        });
    } catch (error) {
        console.error('Error searching:', error);
        res.status(500).send('Error searching');
    }
});

module.exports = router;
