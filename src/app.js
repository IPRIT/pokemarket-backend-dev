'use strict';

import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import formData from 'express-form-data';
import apiRouter from './route';
import test from './just-for-test';

let app = express();
  
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(formData.parse());
app.use(formData.stream());
app.use(formData.union());
app.use(cookieParser());
app.enable('trust proxy');
app.use(session({
  secret: 'keyboard cat offset',
  resave: false,
  saveUninitialized: true
}));
//app.use(auth.restore);

/*
 * Connecting routers
 */

app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  res.writeHead(404);
  res.write('Not found');
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'dev') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    console.error(err);
    res.end();
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.end();
});

export default app;