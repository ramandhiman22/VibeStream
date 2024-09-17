const sequelize = require('./db');
const { Sequelize, DataTypes } = require('sequelize');
const User = require('./user'); // Import the User model

const OTP = sequelize.define('OTP', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    otp: {
        type: DataTypes.STRING(4), // Ensure it's a 4-digit string
        allowNull: false
    },
    user_id: {  // Foreign key to reference User
        type: DataTypes.INTEGER,
        references: {
            model: User, // 'User' would be the table name in the database
            key: 'id'
        },
        allowNull: false
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'otp' // Optional: to override the default table name
});

// Define the relationship between User and OTP
OTP.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = OTP;