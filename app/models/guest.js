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

function Guest(guest_name, groupchat_name) {
	this.guest_name = guest_name;
	this.groupchat_name = groupchat_name;
}


function checkTableExists(callback) {
	db.run("CREATE TABLE if not exists guest (guest_name TEXT, groupchat_name TEXT)", function(err){
		if(err) {
			callback(false);
			return;
		} else {
			callback(true);
		}
	});
}

Guest.addNewGuest = function(guest_name, groupchat_name, callback) {
	var newGuest = new Guest(guest_name, groupchat_name);
	
	checkTableExists(function(isSuccess) {
		if(isSuccess) {
			db.serialize(function() {
				var setGuest_stmt = db.prepare("INSERT INTO guest VALUES (?,?)");
				setGuest_stmt.run(guest_name, groupchat_name, function(err) {
					if(err) {
						callback(err,null);
						return;
					} else {
						callback(null, newGuest);
					}
					setGuest_stmt.finalize();
				});
			});
		}
	});
}

Guest.getGroupChats = function(username, callback) {
	var query = "SELECT groupchat_name FROM guest WHERE guest_name=\"" + username + "\"";
	var groupChats = [];
	
	checkTableExists(function(isSuccess) {
		if(isSuccess) {
			db.each(query, function(err,row) {
				if(err) {
					callback(err,null);
					return;
				} else {
					var groupChat = row.groupchat_name;
					groupChats.push(groupChat);
				}
			}, function(err,complete) {
				if(err) {
					callback(err,null);
					return;
				} else {
					callback(null, groupChats);
				}
			});
		}
	});
};

Guest.getMembers = function(groupchat_name, callback) {
	var query = "SELECT guest_name from guest WHERE groupchat_name=\"" + groupchat_name + "\"";
	var members = [];
	
	checkTableExists(function(isSuccess) {
		if(isSuccess) {
			db.each(query, function(err,row) {
				if(err) {
					callback(err,null);
					return;
				} else {
					var member = row.guest_name;
					members.push(member);
				}
			}, function(err, complete) {
				if(err) {
					callback(err,null);
					return;
				} else {
					callback(null, members);
				}
			});
		}
	});
}
module.exports = Guest;
