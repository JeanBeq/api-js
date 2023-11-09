var express = require('express');
var router = express.Router();
const fs = require('fs');
const mysql = require('mysql');
const { off } = require('process');
const {sqlQuery} = require('../sqlQuery');
const middleWare = require('../middleware')
router.use(middleWare.authentificationMiddleware);

// todo liste
router.get('/', function(req, res, next) {
    const limit = parseInt(req.query.limit) || 4;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, title, due_date, done, user FROM todo WHERE 1=1';
    let countQuery = 'SELECT COUNT(id) AS total FROM todo WHERE 1=1';

    const filters = [];
    const filterValues = [];

    const titleFilter = req.query.title;
    const doneFilter = req.query.done;
    const createdByFilter = req.query.created_by;

    if (titleFilter) {
        filters.push('title LIKE ?');
        filterValues.push(`%${titleFilter}%`);
    }

    if (doneFilter !== undefined) {
        filters.push('done = ?');
        filterValues.push(doneFilter);
    }

    if (createdByFilter) {
        filters.push('user = ?');
        filterValues.push(createdByFilter);
        filters.push('user = ?');
        filterValues.push(req.user.id);
    }

    if (filters.length > 0) {
        query += ` AND ${filters.join(' AND ')}`;
        countQuery += ` AND ${filters.join(' AND ')}`;
    }

    query += ` LIMIT ? OFFSET ?`;
    filterValues.push(limit, offset);

    sqlQuery(query, filterValues, (results) => {
        sqlQuery(countQuery, filterValues, (countResult) => {
            const totalTasks = countResult[0].total;
            const totalPages = Math.ceil(totalTasks / limit);
            res.json({
                tasks: results,
                totalTasks,
                totalPages,
                currentPage: page
            });
        });
    });
});


// todo en détail
router.get('/:id', function(req, res) {
    const id = parseInt(req.params.id);
    const query = 'SELECT id, title, due_date, done, user FROM todo WHERE id = ?';

    sqlQuery(query, [id], (results) => {
        if (results.length === 0) {
            res.status(404).send('Tâche non trouvée');
        } else {
            res.status(200).json(results[0]);
        }
    });
});

// créer nouveau todo
router.post('/', (req, res) => {
    const newTask = req.body;
    const query = 'INSERT INTO todo (title, due_date, done, user, description, date_creation) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [
        newTask.title,
        newTask.due_date,
        false,
        newTask.user,
        newTask.description,
        new Date().toISOString()
    ];

    sqlQuery(query, values, (result) => {
        if (result.error) {
            console.error('Erreur MySQL lors de l\'insertion de la tâche :', result.error); 
            res.status(500).send('Erreur serveur');
        } else {
            newTask.id = result.insertId;
            res.status(201).json(newTask);
        }
    });
});

// supprimer todo
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const query = 'DELETE FROM todo WHERE id = ?';

    sqlQuery(query, [id], (result) => {
        if (result.error) {
            console.error('Erreur MySQL lors de la suppression de la tâche :', result.error);
            res.status(500).send('Erreur serveur');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Tâche non trouvée');
        } else {
            res.status(204).send();
        }
    });
});

// update todo
router.patch('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedTask = req.body;

    const columnsToUpdate = [];
    const values = [];

    if (updatedTask.title !== undefined) {
        columnsToUpdate.push('title = ?');
        values.push(updatedTask.title);
    }

    if (updatedTask.due_date !== undefined) {
        columnsToUpdate.push('due_date = ?');
        values.push(updatedTask.due_date);
    }

    if (updatedTask.done !== undefined) {
        columnsToUpdate.push('done = ?');
        values.push(updatedTask.done);
    }

    if (updatedTask.user !== undefined) {
        columnsToUpdate.push('user = ?');
        values.push(updatedTask.user);
    }

    if (updatedTask.description !== undefined) {
        columnsToUpdate.push('description = ?');
        values.push(updatedTask.description);
    }

    if (columnsToUpdate.length === 0) {
        res.status(400).send('Aucune donnée de mise à jour fournie.');
        return;
    }

    const query = `UPDATE todo SET ${columnsToUpdate.join(', ')} WHERE id = ?`;
    values.push(id);

    sqlQuery(query, values, (result) => {
        if (result.error) {
            console.error('Erreur MySQL lors de la mise à jour de la tâche :', result.error);
            res.status(500).send('Erreur serveur');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Tâche non trouvée');
        } else {
            res.status(200).json({ message: 'Tâche mise à jour avec succès' });
        }
    });
});


module.exports = router;