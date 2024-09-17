const multer=require('multer')
const path = require('path');

const express = require('express');
const router = express.Router();
const Track = require('../models/track');
const isAuthenticated = require('../middlewares/is_authenticated.middleware');
const checkPremium = require('../middlewares/checkPremium');

router.get('/:trackId', isAuthenticated, checkPremium, async (req, res) => {
    try {
        const trackId = req.params.trackId;

        // Fetch track details
        const track = await Track.findByPk(trackId);

        if (!track) {
            return res.status(404).json({ message: 'Track not found.' });
        }

        // Resolve the full path to the file
        const fullPath = path.join(__dirname, '..', 'uploads', path.basename(track.songPath));
        
        // Debugging: Log the resolved file path
        console.log('Resolved track file path:', fullPath);

        // Check if the file exists
        res.download(fullPath, (err) => {
            if (err) {
                console.error('Error serving the file:', err);
                return res.status(500).json({ message: 'Error serving the file.', error: err.message });
            }
        });
    } catch (error) {
        console.error('Error processing download:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = router;
