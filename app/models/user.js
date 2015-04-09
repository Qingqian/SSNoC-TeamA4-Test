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

function User(username, password, user_status, change_status_time, lat, lon, gps_enabled) {
	this.username = username;
	this.password = password;
	this.user_status = user_status;
	this.change_status_time = change_status_time;
	/* gps information */
	this.lat = lat;
	this.lon = lon;
	this.gps_enabled = gps_enabled;
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
	db.run("CREATE TABLE if not exists user_info (username TEXT, password TEXT, user_status TEXT, change_status_time TEXT, lat TEXT, lon TEXT, gps_enabled TEXT)", function(err){
		if(err) {
			callback(false);
			return;
		} else {
			callback(true);
		}
	});
}

User.saveNewUser = function(username, password, callback) {
	var newUser = new User(username, password, undefined, undefined, undefined, false);
	var token = newUser.generateHash(password);
	newUser.token = token;
	var currentdate = new Date();
	var datetime = currentdate.getDate() + "/"
				+ (currentdate.getMonth()+1)  + "/" 
				+ currentdate.getFullYear() + " @ "  
				+ currentdate.getHours() + ":"  
				+ currentdate.getMinutes() + ":" 
				+ currentdate.getSeconds();
	checkTableExists(function(isSuccess){
		if(isSuccess) {
			db.serialize(function(){
				var setUser_stmt = db.prepare("INSERT INTO user_info VALUES (?, ?, ?, ?, ?, ?, ?)");
				setUser_stmt.run(username, token, undefined, datetime, undefined, undefined, false, function(err){
					if (err) {
						callback(err,null);
						return;
					} else {
						callback(null, newUser);
					}	
					setUser_stmt.finalize();
				});
			});
		}
	});
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
					return;
				} else{
					var user = new User(row.username, row.password, row.user_status, row.change_status_time, row.lat, row.lon, row.gps_enabled);
					callback(null, user);
				}
			});
		}
	});	
};

User.searchUser = function(username, callback) {
	var query = "SELECT * FROM user_info WHERE username LIKE \"%" + username + "%\"";
	var users=[];
	checkTableExists(function(isSuccess){
		if(isSuccess) {
			db.each(query, function(err, row){
				if(err) {
					callback(err,null);
					return;
				} else {
					var user = new User(row.username, row.password, row.user_status, row.change_status_time);
					users.push(user);
				}
			}, function(err,complete){
				if(err) {
					callback(err,null);
					return;
				} else {
					callback(null, users);
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
					var user = new User(row.username, row.password, row.user_status, row.change_status_time, row.lat, row.lon, row.gps_enabled);
					users.push(user);
				}
			}, function(err,complete){
				if(err) {
					callback(err,null);
					return;
				} else {
					callback(null, users);
				}
			});
		}
	});
}

User.changeStatus = function(username, user_status, change_status_time, callback) {
	var query = "UPDATE user_info SET user_status = ?, change_status_time = ? WHERE username = \"" + username + "\"";
	checkTableExists(function(isSuccess){
		if(isSuccess) {
			db.serialize(function(){
				var status_stmt = db.prepare(query);
				status_stmt.run(user_status, change_status_time, function(err){
					if(err) {
						callback(err,null);
						return;
					} else {
						var new_status = {username:username, user_status:user_status, change_status_time:change_status_time};
						callback(null,new_status);
					}
					status_stmt.finalize();
				});
			});
		}
	});
}

User.changeGPS = function(username, lat, lon, gps_enabled, callback) {
	var query = "UPDATE user_info SET lat = ?, lon = ?, gps_enabled = ? WHERE username = \"" + username + "\"";
	checkTableExists(function(isSuccess){
		if(isSuccess) {
			db.serialize(function(){
				var status_stmt = db.prepare(query);
				status_stmt.run(lat, lon, gps_enabled, function(err){
					if(err) {
						callback(err,null);
						return;
					} else {
						var new_status = {username:username, lat:lat, lon:lon, gps_enabled:gps_enabled};
						callback(null,new_status);
					}
					status_stmt.finalize();
				});
			});
		}
	});
}

User.searchStatus = function(user_status, callback) {
	var query = "SELECT * FROM user_info WHERE user_status = \"" + user_status + "\"";
	var users=[];
	checkTableExists(function(isSuccess){
		if(isSuccess) {
			db.each(query, function(err, row){
				if(err) {
					callback(err,null);
					return;
				} else {
					var user = new User(row.username, row.password, row.user_status, row.change_status_time);
					users.push(user);
				}
			}, function(err,complete){
				if(err) {
					callback(err,null);
					return;
				} else {
					callback(null, users);
				}
			});
		}
	});
}

/******************* Debug ****************/
// clearDB
// Pure debug function that completely wipes existing user DB
// NOTE: This will not reset any data saved by server like
// directory list
User.clearDB = function() {
	console.log("Creating DB file.");
    fs.openSync(db_file, 'w');
}

module.exports = User;
