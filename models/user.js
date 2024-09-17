const sequelize = require('./db');
const { DataTypes, Model } = require('sequelize');
class User extends Model { }

User.init(
    {
        // Model attributes are defined here
        name: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            // defaultValue:false,
        },
        number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        premium:{
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        image: { // New attribute for profile image
            type: DataTypes.STRING,
            allowNull: true, // Make it nullable as not every user might have an image
        }
    },
    {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'User', // We need to choose the model name,
        tableName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

module.exports = User;