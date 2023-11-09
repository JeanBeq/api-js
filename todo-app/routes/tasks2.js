var express = require('express');
var router = express.Router();
const fs = require('fs');
const mysql = require('mysql');
const { off } = require('process');
const {sqlQuery} = require('../sqlQuery');
const {Op} = require('sequelize');
const Task = require('../models/task');
const middleWare = require('../middleware')
router.use(middleWare.authentificationMiddleware);

// todo liste
router.get('/all', function(req, res, next) {
    try {
        Task.findAll().then(tasks => {
            res.json(tasks);
        });
    } catch (exception) {
        console.error(exception);
    }
});

router.get('/all/async',async function(req, res, next) {
    try {
        const tasks = await Task.findAll();
        res.json(tasks);
    } catch (exception) {
        console.error(exception);
    }
});

router.get('/filtered',async function(req, res) {
    const tasks = await Task.findAll({
        where: {
            done : true,
            [Op.or]: [
                {
                    user: {
                        [Op.like]: 'U%'
                    }
                }
            ]
        }
    });

    res.json(tasks);
})

router.get('/task/:id',async function(req, res, next) {
    try {
        const taskbyid = Task.findByPk(req.params.id)
        .then(taskbyid => {
            res.json(taskbyid);
        });
    } catch (exception) {
        console.error(exception);
    }
});

router.post('/',async function(req, res, next) {
    try {
        const newTask = await Task.create(req.body);
        res.json(newTask);
    } catch (exception) {
        console.error(exception);
    }
});

router.delete('/:id',async function(req, res, next) {
    try {
        const task = await Task.findByPk(req.params.id);
        await task.destroy();
        res.json({message: 'Task deleted'});
    } catch (exception) {
        console.error(exception);
    }
});

router.patch('/:id',async function(req, res, next) {
    try {
        const task = await Task.findByPk(req.params.id);
        await task.update(req.body);
        res.json({message: 'Task updated'});
    } catch (exception) {
        console.error(exception);
    }
});

module.exports = router;