const Track = require('../models/Track');
const path = require('path');
const Sequelize = require('sequelize');

class TrackController {
    static async ShowUpload(req, res) {
        res.render('upload');
    }

    static async UploadTrack(req, res) {
        const { name, artist, genre } = req.body;
        const filePath = req.file.path;
        const coverImage = req.body.coverImage || '';

        await Track.create({ name, artist, genre, filePath, coverImage });

        return res.redirect('/home');
    }

    static async SearchTrack(req, res) {
        const { query } = req.query;
        const tracks = await Track.findAll({
            where: {
                name: { [Sequelize.Op.like]: `%${query}%` }
            }
        });
        res.render('search', { tracks });
    }

    static async PlayTrack(req, res) {
        const track = await Track.findByPk(req.params.id);
        res.sendFile(path.resolve(__dirname, '../', track.filePath));
    }
}

module.exports = TrackController;
