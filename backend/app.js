const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { ValidationError } = require('sequelize');
const { handleValidationErrors } = require('./utils/validation');

const { environment } = require('./config');
const isProduction = environment === 'production;'

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

if (!isProduction) {
  app.use(cors());
};

// Sets varied headers to help secure app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);

// Sets _csurf token and makes the associated req method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);

app.use(routes);

app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resources Not Found";
  err.errors = { message: "The requested resource couldn't be found."};
  err.status = 404;
  next(err);
});

// app.use(handleValidationErrors)

app.use((err, _req, _res, next) => {
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }

    if (err.message.includes("unique")) err.status = 500
    else err.status = 400
    err.title = 'Validation error';
    err.errors = errors;
  }
  next(err);
});

app.use((err, _req, res, _next) => {

  res.status(err.status || 500);
  console.error(err, err.status);
  let message;
  let errors;
  let title;
  if (err.message) message = err.message
  if (err.errors) errors = err.errors
  if (err.title) title = err.title
  res.json({
    title,
    message,
    errors
  })
})

module.exports = app;
