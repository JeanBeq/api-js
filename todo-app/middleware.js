const jwt = require('jsonwebtoken')
const mysql = require('mysql');
const { sqlQuery } = require('./sqlQuery');


function authentificationMiddleware(req, res, next) {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        const secret = process.env.JWT_SECRET;

        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Token invalide' });
            }

            const userId = decoded.id;

            sqlQuery(`SELECT * FROM user WHERE id=?`, [userId], (results) => {
                if (results.length === 0) {
                    return res.status(401).json({ message: 'Utilisateur non trouvé' });
                }
                const user = results[0];
                req.user = user;
                next();
            });
        });
    } else {
        res.status(401).json({ message: 'Token manquant' });
    }
}

module.exports = {
    authentificationMiddleware
}