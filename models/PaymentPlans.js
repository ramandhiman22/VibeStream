const { DataTypes, Model } = require('sequelize');
const sequelize = require('./db');

class PaymentPlans extends Model {}

PaymentPlans.init(
    {
        plan_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        plan_description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'PaymentPlans',
        tableName: 'payment_plans',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

module.exports = PaymentPlans;
