var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var moment  = require('moment');
var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'public/data/invalidUsernames.txt');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var flash = require('connect-flash');
var _ = require('underscore');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//passport authentication
require('./config/passport')(passport);

var citizens = [];
var onlineUsers=[];
var offlineUsers=[];
var invalidUsernames=[];
var publicMessages=[];

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

require('./app/routes.js')(app, _, passport);

//server listens to port 3500
server.listen(3500);
console.log("Server started on port 3500");


/************************************************************************************/

//Read text file to load reserved usernames
readFile();

//entity class Message
function Message(citizen, message, timestamp) {
	this.citizen=citizen;
	this.message = message;
	this.timestamp = timestamp;
}

// Check infomation provided by the user
function checkUser(citizens, username) {
	if(invalidUsernames.indexOf(username) != -1) {
		return -2;
	}
	for(var i=0; i < citizens.length;i++) {
		if(citizens[i].username === username) {
			return i;
		}
	}
	return -1;
}


//Read text file to load the reserved usernames
function readFile() {
	fs.readFile(filePath, function(err,data){
		if(!err) {
			invalidUsernames = data.toString().split(' ');
		} else {
			console.log(err);
		}
	});
}

//update the SSNoC directory
function updateDirectory(socket,online,offline) {
	offline.push(socket.citizen);
	online.splice(online.indexOf(socket.citizen),1);
}


io.sockets.on('connection', function(socket){
	//load previous messages
	socket.on('load messages', function(data){
		socket.emit('show messages',publicMessages);
	});
	
	// Directory Request
	socket.on("directory", function(data){
		socket.emit('citizens', {online:onlineUsers, offline:offlineUsers});
	});

	// Handle User Registration
	socket.on('new user', function(data, callback){
			var index = checkUser(citizens, data.username);
			if(index === -2) {
				callback(2);
			} else if(index === -1) {
				//create new citizen
				var hash = getHash(data.password);
				var citizen = new Citizen(data.username, hash);
				socket.citizen = citizen;
				onlineUsers.push(socket.citizen);
				citizens.push(socket.citizen);
				queryUser(data.username, function(present){
					if (!present)
						addNewUser(data.username, hash);
				});
				io.sockets.emit('citizens', {online:onlineUsers, offline:offlineUsers});
				callback(0);
			} else {
				//getPassword(data.username, function(oldHash) {
					var oldHash = citizens[index].password;
					var isValid = isValidPassword(data.password,oldHash);
					if(isValid) {
						callback(3);
						var citizen = citizens[index];
						socket.citizen = citizen;
						updateDirectory(socket,offlineUsers,onlineUsers);
						io.sockets.emit('citizens',{online:onlineUsers, offline:offlineUsers});
					} else {
						callback(1);
					}
				//});
			}
	});
	
	// Login Request
	socket.on("login", function(data, callback) {
			var index = checkUser(citizens, data.username);
			if(index === -2 || index === -1) {
				callback(2);
			} else {
			//getPassword(data.username, function(oldHash) {
				var oldHash = citizens[index].password;
				var isValid = isValidPassword(data.password,oldHash);
				if(isValid) {
					callback(3);
					var citizen = citizens[index];
					socket.citizen = citizen;
					updateDirectory(socket,offlineUsers,onlineUsers);
					io.sockets.emit('citizens',{online:onlineUsers, offline:offlineUsers});
				} else {
					callback(1);
				}
			//});
			}
	});

	//get messages from client side
	socket.on('send message', function(data){
		var time = moment();
    	var timestamp = time.format('HH:mmA ');
    	var message = new Message(socket.citizen, data, timestamp);
    	publicMessages.push(message);
    	addNewMsg(socket.citizen + timestamp + ": " + data);	
		if(publicMessages.length >3) {
    		publicMessages.splice(0,publicMessages.length-3);
    	}
		console.log("New mesage!" + socket.citizen);
        io.sockets.emit('new message',message);
	});

	// listen to logout event
	socket.on('logout',function(data){
		if(!socket.citizen)
			return;
		updateDirectory(socket,onlineUsers,offlineUsers);
		io.sockets.emit('citizens',{online:onlineUsers, offline:offlineUsers});
	});

	//listen to disconnect event
	socket.on('disconnect', function(data){
		if(!socket.citizen)
			return;
		if(onlineUsers.indexOf(socket.citizen) !=-1) {
			onlineUsers.splice(onlineUsers.indexOf(socket.citizen),1);
		}
		if(offlineUsers.indexOf(socket.citizen) == -1) {
			offlineUsers.push(socket.citizen);
		}
		io.sockets.emit('citizens',{online:onlineUsers, offline:offlineUsers});
	});

});
