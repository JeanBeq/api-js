const { Sequelize } = require('../sqlQuery');
const User = require('./user');
const Task = require('./task');

User.hasMany(Task);
Task.belongsTo(User);

SequelizeInstance.sync({alter: true});

module.exports = {
    User,
    Task,
}