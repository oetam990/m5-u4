var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
var pool = require('./models/db');
const session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/admin/login');
var adminRouter = require('./routes/admin/novedades');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: 'hsdhuyrbfjkfkkdfsjad',
  cookie: {maxAge: null},
  resave: false,
  saveUninitialized: true
}));

secured = async (req, res, next) => {
  try {
    console.log(req.session.id_usuario);
    if (req.session.id_usuario) {
      next();
    } else {
      res.render('admin/login', {
        layout: 'admin/layout'
      });
    }
  } catch (error) {
    console.log(error);
  }
}
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin/login', loginRouter);
app.use('/admin/novedades', secured, adminRouter);

app.get('/logout', function (req, res, next) {
  req.session.destroy()
  res.render('admin/login', {
    layout: 'admin/layout'
  });
});
//Consulta select
// pool.query('select * from usuarios').then(function (resultados) { 
//   console.log(resultados)
// });

//Consulta insert
// var obj = {
//   nombre : 'Mateo',
//   apellido: 'Baracco',
//   trabajo: 'Software Developer',
//   edad: 32,
//   salario: 1500,
//   mail: 'mateo@mail.com'
// }
// pool.query('insert into empleados set ?',[obj]).then(function (resultados) {
//   console.log(resultados)
// });


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
