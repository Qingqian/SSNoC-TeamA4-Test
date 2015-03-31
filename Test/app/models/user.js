/*******************************
* Citizen Entity Model
*******************************/
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var db_file = 'chat_database.db';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(db_file);

var exists = fs.existsSync(db_file);
if (!exists) {
    console.log("Creating DB file.");
    fs.openSync(db_file, 'w');
}

function User(username, password, user_status) {
	this.username = username;
	this.password = password;
	this.user_status = user_status;
}

User.prototype.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

User.prototype.isValidPassword = function(password, callback) {
	if(bcrypt.compareSync(password, this.password)) {
		callback(true);
		return;
	} else {
		callback(false);
	}
};

function checkTableExists(callback) {
	db.run("CREATE TABLE if not exists user_info (username TEXT, password TEXT, user_status TEXT)", function(){
		callback(true);
		return;
	});
	callback(false);
}

User.saveNewUser = function(username, password, callback) {
	var newUser = new User(username, password, undefined);
	var token = newUser.generateHash(password);
	newUser.token = token;
	var setUser_stmt = db.prepare("INSERT INTO user_info VALUES (?, ?, ?)");
	checkTableExists(function(isSuccess){
		if(isSuccess) {
			setUser_stmt.run(username, token, undefined, function(err){
				if (err)
					console.log(err);
			});
			setUser_stmt.finalize();
		}
	});
	callback(null, newUser);
};

User.getUser = function(username, callback) {
	var query = "SELECT * FROM user_info WHERE username=\"" + username + "\"";
	checkTableExists(function(isSuccess){
		if(isSuccess) {
			db.get(query, function(err, row){
				if (err){
					callback(err,null);
					return;
				} else if(!row){
					callback(null,null);
				} else{
					var user = new User(row.username, row.password, row.user_status);
					callback(null, user);
					return;
				}
			});
		}
	});	
};

User.getAllUsers = function(callback) {
	var query = "SELECT * FROM user_info";
	var users =[];
	checkTableExists(function(isSuccess){
		if(isSuccess) {
			db.each(query, function(err, row){
				if(err) {
					callback(err,null);
					return;
				} else {
					var user = new User(row.username, row.password, row.user_status);
					users.push(user);
				}
			}, function(err,complete){
				if(err) 
					callback(err,null);
				console.log(users);
				callback(null, users);
			});
		}
	});
}

module.exports = User;





