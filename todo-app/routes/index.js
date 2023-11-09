var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('/ ! \\ travail en cours / ! \\');
});

module.exports = router;