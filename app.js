require('dotenv').config();
const logger = require('morgan');
const routers = require('./src/routes');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const httpError = require('http-errors');
const fileUpload = require('express-fileupload');
const path = require('path');

// connect DB
require('./config/db');
const app = express();
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true,
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use('/api/v1/storage', routers);

app.use(function (req, res, next) {
  next(httpError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || err.code || 500);
  res.json(err);
});

module.exports = app;