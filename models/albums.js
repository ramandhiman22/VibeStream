const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db'); // Adjust the path as per your project structure
const Track = require('./track'); // Import Track model to establish relationships

class Album extends Model {}
Album.init({
  Album_ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Artist: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ImagePath: {
    type: DataTypes.STRING,
  },
  ReleaseDate: {
    type: DataTypes.DATE,
  },
  Genre: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: 'Album',
  tableName: 'albums',
  timestamps: false,
});


// Define the relationship with Track model
Album.hasMany(Track, { as: 'Tracks', foreignKey: 'albumId', onDelete: 'CASCADE' });
Track.belongsTo(Album, { foreignKey: 'albumId', as: 'album' });

module.exports = Album;
