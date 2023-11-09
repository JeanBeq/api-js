var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors')

const Task = require('./models/task');
const User = require('./models/user');

var indexRouter = require('./routes/index');
var tasksRouter = require('./routes/tasks');
var userRouter = require('./routes/user');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/tasks', tasksRouter);
app.use('/user', userRouter);

module.exports = app;
