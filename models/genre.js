const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db'); // Adjust the path to your config
const Track = require('./track');

const Genre = sequelize.define('Genre', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imagePath: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'genres',
    timestamps: false // Disable automatic createdAt and updatedAt fields
});

// Define associations
Track.belongsTo(Genre, { as: 'Genre', foreignKey: 'genreId' });
Genre.hasMany(Track, { as: 'Tracks', foreignKey: 'genreId' });

module.exports = Genre;
