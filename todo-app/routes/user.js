var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')
const mysql = require('mysql');
const bcrypt = require('bcrypt');

function generateToken(id){
    return jwt.sign({'id' : id}, process.env.JWT_SECRET);
}

const {sqlQuery} = require('../sqlQuery');

router.post('/signup', (req, res) => {
    const body = req.body;

    if (!body.email || !body.password || !body.display_name) {
        res.status(400)
        res.send("Tous les champs sont obligatoires")
        return
    }

    if (body.password.length < 8) {
        res.status(400)
        res.send("MDP doit avoir au moins 8 caractères")
        return
    }

    bcrypt.hash(body.password, 12).then(hashedPassword => {
        const insertQuery = `INSERT INTO user (email, password, display_name) VALUES ("${body.email}", "${hashedPassword}", "${body.display_name}")`;

        try {
            sqlQuery(insertQuery, (result) => {
                res.status(201)
                res.send("Vous vous êtes bien inscrit.")
            });
        } catch (exception) {
            res.status(500)
            res.send("Erreur lors de la création : " + exception)
        }
    })
})

router.post('/login', (req, res) => {
    const body = req.body;

    if (!body.email || !body.password) {
        res.status(400)
        res.send("Tous les champs sont obligatoires")
        return
    }

    sqlQuery(`SELECT * FROM user WHERE email=?`, [body.email],(results) => {
        if (results.length === 0) {
            res.status(400);
            res.send("Invalid password or email");
        }

        const user = results[0];
        bcrypt.compare(body.password, user.password).then(isOk => {
            if (!isOk) {
                res.status(400);
                res.status("Invalid password or email");
            } else {
                delete user.password
                //Generate a JWT Token
                return res.json({
                    'token': generateToken(user.id),
                    'user': user,
                })
            }
        })
    });
})

router.get('/', function (req, res) {
  try {
      const sql = "SELECT * FROM user";

      sqlQuery(sql, (results) => {
          res.json(results);
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

router.get('/test-token', (req, res) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        const secret = process.env.JWT_SECRET;
        jwt.verify(token, secret, (err, decoded) => {
            console.log(token)
            sqlQuery(`SELECT display_name FROM user WHERE id="${decoded.id}"`, (results) => {
                if (results.length === 0) {
                    res.status(400);
                    res.send("Invalid password or email");
                }
                if (err) {
                    console.log(err);
                } else {
                    return res.json({
                        'id': decoded,
                        'results': results
                    })
                }
            })
        });
    }
});

module.exports = router;