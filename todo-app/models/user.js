const { DataTypes } = require('sequelize');
const { Sequelize } = require('../sqlQuery');

const User = SequelizeInstance.define('user', {
    display_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

User.sync({ alter: true });
module.exports = User;