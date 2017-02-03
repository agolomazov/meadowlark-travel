var express = require('express');
var chalk = require('chalk');
var open = require('open');
var formidable = require('formidable');
var fortune = require('./lib/fortune.js');

var handlebars = require('express-handlebars').create({
  defaultLayout: 'main',
  helpers: {
    section: function (name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});

var bodyParser = require('body-parser');

function getWeatherData() {
  return {
    locations: [
      {
        name: 'Портленд',
        forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
        weather: 'Сплошная облачность',
        temp: '54.1 F (12.3 C)'
      },
      {
        name: 'Бенд',
        forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
        weather: 'Малооблачно',
        temp: '55.0 F (12.8 C)'
      },
      {
        name: 'Манзанита',
        forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
        weather: 'Небольшой дождь',
        temp: '55.0 F (12.8 C)'
      }
    ]
  };
}

var app = express();
var urlencodedParser = bodyParser.urlencoded({extended: true});

var tours = [
  {id: 0, name: 'Река Худ', price: 99.99},
  {id: 1, name: 'Орегон Коуст', price: 149.95},
];


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  next();
});

app.use(function (req, res, next) {
  if (!res.locals.partials) res.locals.partials = {};
  res.locals.partials.weatherContext = getWeatherData();
  next();
});

app.disable('x-powered-by');

app.set('port', process.env.PORT || 3000);

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/newsletter', function (req, res) {
  res.render('newsletter', {csrf: 'CSRF token goes here'});
});

app.post('/process', urlencodedParser, function (req, res) {
  if (req.xhr || req.accepts('json,html') === 'json') {
    res.json({success: true});
  } else {
    res.redirect(303, '/thank-you')
  }
});

app.get('/thank-you', function (req, res) {
  res.render('thank-you-newsletter');
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

app.get('/responder', function (req, res) {
  res.render('responder');
});

app.post('/responder', urlencodedParser, function (request, res) {
  var message = 'Здравствуйте, ' + request.body.name + '! Вы написали нам: "' + request.body.comment + '"';
  res.status(200);
  res.send(message);
});

app.get('/api/tours', function (req, res) {
  res.json(tours);
});

app.get('/headers', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.json(req.headers);
});

app.get('/contest/vacation-photo', function (req, res) {
  var now = new Date();
  res.render('contest/vacation-photo', {
    month: now.getMonth(),
    year: now.getFullYear()
  });
});

app.post('/contest/vacation-photo/:year/:month', function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    if(err) res.redirect(303, '/error');
    console.log('received fields:');
    console.log(fields);
    console.log('received files:');
    console.log(files);
    res.redirect(303, '/thank-you');
  })
});

app.get('/error', function (req, res) {
  res.render('error');
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