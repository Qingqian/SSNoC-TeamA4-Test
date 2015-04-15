/*******************************
* Message Entity Model
*******************************/
var fs = require('fs');
var db_file = 'chat_database.db';
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(db_file);

var exists = fs.existsSync(db_file);
if (!exists) {
    console.log("Creating DB file.");
    fs.openSync(db_file, 'w');
}

function GroupChat(chatname) {
	this.chatname = chatname;
	this.members = [];
	this.messages = [];
}

function checkTableExists(callback) {
	db.run("CREATE TABLE if not exists groupchat (chatname TEXT)", function(err){
		if(err) {
			callback(false);
			return;
		} else {
			callback(true);
		}
	});
}

GroupChat.addNewGroupChat = function(chatname, callback) {
	checkTableExists(function(isSuccess) {
		if(isSuccess) {
			db.serialize(function() {
				var groupchat_stmt = db.prepare("INSERT INTO groupchat VALUES (?)");
				groupchat_stmt.run(chatname, function(err) {
					if(err) {
						callback(err,null);
						return;
					} else {
						var group
					}
				});
			}
		}
	});	
}


module.exports = GroupChat;



