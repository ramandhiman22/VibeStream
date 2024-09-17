const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('./db'); // Adjust the path to your config

class Track extends Model { }

Track.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    artist: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Vibe: {
        type: DataTypes.STRING,
        allowNull: false
    },
    songPath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    genreId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'genres',
            key: 'id'
        }
    },
    albumId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'albums',
            key: 'Album_ID'
        }
    },
    imagePath: { 
        type: DataTypes.STRING 
    }
}, {
    sequelize,
    modelName: 'Track',
    tableName: 'Tracks',
    timestamps: false
});

module.exports = Track;
