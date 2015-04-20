/*******************************
* Performance Entity Model
*******************************/
var fs = require('fs');
var db_file = 'performance.db';
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(db_file);

var exists = fs.existsSync(db_file);
if (!exists) {
    console.log("Creating performance test DB file.");
    fs.openSync(db_file, 'w');
}

function Test_Message(source_user, message_text, post_time, target_user, message_type) {
	this.source_user = source_user;
	this.message_text = message_text;
	this.post_time = post_time;
	this.target_user = target_user;
	this.message_type = message_type;
}

function checkTableExists(callback) {
	db.run("CREATE TABLE if not exists test_message (source_user TEXT, message_text TEXT, post_time TEXT, target_user TEXT, message_type TEXT)", function(err){
		if(err) {
			callback(false);
			return;
		} else {
			callback(true);
		}
	});
}

Test_Message.getPublicMessages = function(callback) {
	var query = "SELECT source_user, message_text, post_time FROM test_message WHERE message_type=\"PUBLIC\" AND target_user=\"WALL\"";
	var messages = [];
	checkTableExists(function(isSuccess){
		if(isSuccess) {
			db.each(query, function(err,row){
				if(err) {
					callback(err,null);
					return;
				} else {
					var public_message = new Test_Message(row.source_user, row.message_text, row.post_time, 'WALL', 'PUBLIC');
					messages.push(public_message);
				}
			}, function(err,complete){
				if(err) {
					callback(err,null);
					return;
				} else {
					callback(null,messages);
				}
			});
		}
	});
}

Test_Message.postPublicMessage = function(source_user, message_text, post_time, callback) {
	checkTableExists(function(isSuccess){
		if(isSuccess) {
			db.serialize(function(){
				var public_stmt = db.prepare("INSERT INTO test_message VALUES (?, ?, ?, ?, ?)"); 
				public_stmt.run(source_user, message_text, post_time, 'WALL', 'PUBLIC', function(err){
					if (err) {
						callback(err,null);
						return;
					} else {
						var public_message = new Test_Message(source_user, message_text, post_time, 'WALL', 'PUBLIC');
						callback(null, public_message);
					}
					public_stmt.finalize();
				});
			});
		}
	});
}

Test_Message.shutdownDB = function() {
	fs.openSync(db_file, 'w');
}

module.exports = Test_Message;

