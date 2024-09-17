const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db'); // Update the path to your database configuration

class Artist extends Model {}

Artist.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING(255),
  },
  bio: {
    type: DataTypes.TEXT,
  },
  imagePath: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Artist',
  tableName: 'Artist',
  timestamps: true,
});

module.exports = Artist;
