var express = require('express');
var chalk = require('chalk');
var open = require('open');
var fortune = require('./lib/fortune.js');
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });

var app = express();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  next();
});

app.set('port', process.env.PORT || 3000);

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/about', function (req, res) {
  res.render('about',
    {
      fortune: fortune.getFortune(),
      pageTestScript: '/qa/tests-about.js'
    });
});

app.get('/tours/hood-river', function (req, res) {
  res.render('tours/hood-river');
});

app.get('/tours/oregon-coast', function (req, res) {
  res.render('tours/oregon-coast');
});

app.get('/tours/request-group-rate', function (req, res) {
  res.render('tours/request-group-rate');
});

// Пользовательская страница 404
app.use(function (req, res, next) {
  res.status(404);
  res.render('404');
});

// Пользовательская страница 500
app.use(function (err, req, res, next) {
  console.log(chalk.red(err.stack));
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function () {
  console.log(chalk.blue('Express запущен на http://localhost' + app.get('port') + '; Нажмите Ctrl + С для завершения...'))
});

open('http://localhost:' + app.get('port'), 'chrome');