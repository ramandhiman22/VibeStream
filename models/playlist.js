const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db'); // Adjust the path to your sequelize instance

class Playlist extends Model {}

Playlist.init({
  Playlist_ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  Image: { type: DataTypes.STRING }
}, {
  sequelize,
  modelName: 'Playlist',
  tableName: 'Playlists',
  timestamps: false,
});

module.exports = Playlist;
