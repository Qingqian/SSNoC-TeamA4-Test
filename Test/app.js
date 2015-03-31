var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');
var _ = require('underscore');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var citizens = {
	online :{},
	total : []
};

//passport authentication
require('./config/passport')(passport);

//view engine set up
app.set('views', path.join(__dirname,'app/views'));
app.set('view engine', 'jade');

//set up express application
app.use(morgan('dev')); // log each request
app.use(cookieParser()); //read cookies
app.use(bodyParser.json()); //get info
app.use(bodyParser.urlencoded({ extended: true }));
//load static files
app.use(express.static(__dirname + '/public'));

//require for passport
app.use(session({
	secret: 'FoundationOfSoftware',
  	resave: true,
  	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flashing messages stored in the session

require('./app/routes.js')(app, _, io, passport,citizens);
require('./app/socket.js')(_, io,citizens);
//server listens to port 3500
server.listen(3500);
console.log("Server started on port 3500");


/************************************************************************************/

