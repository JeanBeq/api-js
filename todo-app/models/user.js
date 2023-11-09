const { DataTypes } = require('sequelize');
const { Sequelize } = require('../sqlQuery');

const User = SequelizeInstance.define('user', {
    display_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},{
    indexes: [
        {unique: true, fields: ['email']},
    ]
});

User.sync({ alter: true });
module.exports = User;