const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('./db'); // Your Sequelize connection

class Admin extends Model {}

Admin.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'Admin'
});

module.exports = Admin;
