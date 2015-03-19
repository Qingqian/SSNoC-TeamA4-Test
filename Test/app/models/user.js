/*******************************
* Citizen Entity Model
*******************************/
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var db_file = 'chat_database.db';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(db_file);


function User(username, password) {
	this.username = username;
	this.password = password;
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

User.saveNewUser = function(username, password, callback) {
	var newUser = new User(username, password);
	var token = newUser.generateHash(password);
	newUser.token = token;
	db.serialize(function(){
		db.run("CREATE TABLE if not exists user_info (username TEXT, password TEXT)");
		var setUser = db.prepare("INSERT INTO user_info VALUES (?, ?)");
		setUser.run(username, token, function(err){
			if (err)
				console.log(err);
		});
		setUser.finalize();
	});
	callback(null, newUser);
};

User.getUser = function(username, callback) {
	var query = "SELECT * FROM user_info WHERE username=\"" + username + "\"";
	db.get(query, function(err, row){
		if (err){
			callback(err,null);
			return;
		} else{
			console.log(row);
			var user = new User(row.username, row.password);
			callback(null, user);
			return;
		}
	});
};

User.getAllUsers = function(callback) {
	var query = "SELECT * FROM user_info";
	var users =[];
	db.each(query, function(err, row){
		if(err) {
			callback(err,null);
			return;
		} else {
			var user = new User(row.username, row.password);
			users.push(user);
		}
	});
	callback(null, users);
}

module.exports = User;





