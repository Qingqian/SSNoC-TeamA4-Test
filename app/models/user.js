/*******************************
* Citizen Entity Model
*******************************/
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var key = 'salt_from_the_user_document';

var fs = require('fs');
var db_file = 'chat_database.db';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(db_file);

var exists = fs.existsSync(db_file);
if (!exists) {
    console.log("Creating DB file.");
    fs.openSync(db_file, 'w');
}

function User(username, password, user_status, change_status_time, lat, lon, gps_enabled, account_status, privilege_level) {
	this.username = username;
	this.password = password;
	this.user_status = user_status;
	this.change_status_time = change_status_time;
	/* gps information */
	this.lat = lat;
	this.lon = lon;
	this.gps_enabled = gps_enabled;
	/* account privilege */
	this.account_status = account_status;
	this.privilege_level = privilege_level
}

User.prototype.generateHash = function(password) {
	var cipher = crypto.createCipher(algorithm,key);
	var crypted = cipher.update(password,'utf8','base64');
	crypted += cipher.final('base64');
	return crypted;
};

User.prototype.decrypt = function(password) {
	var decipher = crypto.createDecipher(algorithm, key);
	var dec = decipher.update(password,'base64','utf8');
	dec += decipher.final('utf8');
	return dec;
}

User.prototype.isValidPassword = function(password, callback) {
	if(password == this.decrypt(this.password)) {
		callback(true);
	} else {
		callback(false);
	}
};

function checkTableExists(callback) {
	db.run("CREATE TABLE if not exists user_info (username TEXT, password TEXT, user_status TEXT, change_status_time TEXT, lat TEXT, lon TEXT, gps_enabled TEXT, account_status TEXT, privilege_level TEXT)", function(err){
		if(err) {
			callback(false);
			return;
		} else {
			callback(true);
		}
	});
}

User.saveNewUser = function(username, password, callback) {
	var newUser = new User(username, password, undefined, undefined, undefined, undefined, false, 'ACTIVE', 'CITIZEN');
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
				var setUser_stmt = db.prepare("INSERT INTO user_info VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
				setUser_stmt.run(username, token, undefined, datetime, undefined, undefined, false, 'ACTIVE', 'CITIZEN', function(err){
					if (err) {
						callback(err,null);
						return;
					} else {
						var new_user = new User(username, token, undefined, datetime, undefined, undefined, false, 'ACTIVE', 'CITIZEN');
						callback(null, new_user);
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
					var user = new User(row.username, row.password, row.user_status, row.change_status_time, row.lat, row.lon, row.gps_enabled, row.account_status, row.privilege_level);
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
					var user = new User(row.username, row.password, row.user_status, row.change_status_time, row.lat, row.lon, row.gps_enabled, row.account_status, row.privilege_level);
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
					var user = new User(row.username, row.password, row.user_status, row.change_status_time, row.lat, row.lon, row.gps_enabled, row.account_status, row.privilege_level);
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
					var user = new User(row.username, row.password, row.user_status, row.change_status_time, row.lat, row.lon, row.gps_enabled, row.account_status, row.privilege_level);
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

User.preloadAdmin = function(admin_username, admin_password, admin_status, admin_privilege_level,callback) {
	var new_admin = new User(admin_username, admin_password, admin_status, undefined, undefined, undefined, false, 'ACTIVE', admin_privilege_level);
	var token = new_admin.generateHash(admin_password);
	new_admin.token = token;
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
				User.getAdmin(admin_username,function(err,admin){
					if(!err && admin) {
						callback(true);
						return;
					} else if(!err && !admin) {
						var set_admin_stmt = db.prepare("INSERT INTO user_info VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
						set_admin_stmt.run(admin_username, token, admin_status, datetime, undefined, undefined, false, 'ACTIVE', admin_privilege_level, function(err){
							if (err) {
								callback(false);
								return;
							} else {
								new_admin = new User(admin_username, admin_password, admin_status, datetime, undefined, undefined, false, 'ACTIVE', admin_privilege_level);
								callback(true);
							}	
							set_admin_stmt.finalize();
						});
					}
				});
				
			});
		}
	});
}

User.getAdmin = function(admin_username, callback) {
	var query = "SELECT * FROM user_info WHERE username=\"" + admin_username + "\" AND privilege_level=\"ADMINISTRATOR\"";
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
					var admin = new User(row.username, row.password, row.user_status, row.change_status_time, row.lat, row.lon, row.gps_enabled, row.account_status, row.privilege_level);
					callback(null, admin);
				}
			});
		}
	});	
}

User.updateProfile = function(username, password, account_status, privilege_level, old_username, callback) {
	User.getUser(old_username, function(err, old_user){
		if(!err && old_user) {
			console.log("old user info from model user:");
			console.log(old_user);
			var old_password =old_user.decrypt(old_user.password);
			var new_password = old_user.decrypt(password);
			console.log("old password" + old_password);
			console.log("new password" + new_password);
			var delete_query = "DELETE FROM user_info WHERE username=\"" + old_username + "\"";
			db.run(delete_query, function(err){
				if(err) {
					callback(err,null,null);
					return;
				} else {
					//username has duplicate in the database
					User.getUser(username, function(err, user){
						if(!err && user) {
							var err_message = "the new username exists in the system database";
							callback(null,err_message, null);
							return;
						} else if(!err && !user) {
							var flag = (new_password != old_password);
							if(flag) {
								console.log("password changed");
								password = old_user.generateHash(password);
							}
							console.log('password' + password);
							db.serialize(function(){
								var setUser_stmt = db.prepare("INSERT INTO user_info VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
								setUser_stmt.run(username, password, old_user.user_status, old_user.change_status_time, old_user.lat, old_user.lon, old_user.gps_enabled, account_status, privilege_level, function(err){
									if (err) {
										callback(err,null,null);
										return;
									} else {
										var new_user = new User(username,password, old_user.user_status, old_user.change_status_time, old_user.lat, old_user.lon, old_user.gps_enabled, account_status, privilege_level);
										console.log(new_user);
										callback(null, null,new_user);
									}	
									setUser_stmt.finalize();
								});
							});
						}
					});	
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
