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
    description: {
        type: DataTypes.TEXT,
    },
    date_creation: {
        type: DataTypes.DATE,
    },
});

module.exports = Task;