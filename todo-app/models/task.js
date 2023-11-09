const { DataTypes } = require('sequelize');
const { Sequelize } = require('../sqlQuery');

const Task = SequelizeInstance.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    due_date: {
        type: DataTypes.DATEONLY,
    },
    done: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    date_creation: {
        type: DataTypes.DATE,
    },
});

Task.sync({ alter: true });
module.exports = Task;