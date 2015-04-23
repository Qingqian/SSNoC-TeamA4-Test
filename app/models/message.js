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

function Message(source_user, message_text, post_time, target_user, message_type) {
	this.source_user = source_user;
	this.message_text = message_text;
	this.post_time = post_time;
	this.target_user = target_user;
	this.message_type = message_type;
}

function checkTableExists(callback) {
	db.run("CREATE TABLE if not exists message (source_user TEXT, message_text TEXT, post_time TEXT, target_user TEXT, message_type TEXT)", function(err){
		if(err) {
			callback(false);
			return;
		} else {
			callback(true);
		}
	});
}

Message.getPublicMessages = function(callback) {
	var query = "SELECT source_user, message_text, post_time FROM message WHERE message_type=\"PUBLIC\" AND target_user=\"WALL\"";
	var messages = [];
	checkTableExists(function(isSuccess){
		if(isSuccess) {
			db.each(query, function(err,row){
				if(err) {
					callback(err,null);
					return;
				} else {
					var public_message = new Message(row.source_user, row.message_text, row.post_time, 'WALL', 'PUBLIC');
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

Message.getPrivateMessages = function(source_user, target_user, callback) {
	var query = "SELECT message_text, post_time FROM message WHERE message_type=\"PRIVATE\" AND source_user=\"" + source_user + "\" AND target_user=\"" + target_user + "\"";
	var private_messages = [];
	checkTableExists(function(isSuccess){
		if(isSuccess) {
			db.each(query, function(err,row){
				if(err) {
					callback(err,null);
					return;
				} else {
					var private_message = new Message(source_user, row.message_text, row.post_time, target_user, 'PRIVATE');
					private_messages.push(private_message);
				}
			}, function(err,complete){
				if(err) {
					callback(err,null);
					return;
				} else {
					callback(null,private_messages);
				}
			});
		}
	});
}

Message.postPublicMessage = function(source_user, message_text, post_time, callback) {
	checkTableExists(function(isSuccess){
		if(isSuccess) {
			db.serialize(function(){
				var public_stmt = db.prepare("INSERT INTO message VALUES (?, ?, ?, ?, ?)"); 
				public_stmt.run(source_user, message_text, post_time, 'WALL', 'PUBLIC', function(err){
					if (err) {
						callback(err,null);
						return;
					} else {
						var public_message = new Message(source_user, message_text, post_time, 'WALL', 'PUBLIC');
						callback(null, public_message);
					}
					public_stmt.finalize();
				});
			});
		}
	});
}

Message.postPrivateMessage = function(source_user, message_text, post_time, target_user, callback) {
	var private_stmt = db.prepare("INSERT INTO message VALUES (?, ?, ?, ?, ?);");
	var private_message = new Message(source_user, message_text, post_time, target_user, 'PRIVATE');
	checkTableExists(function(isSuccess){
		if(isSuccess) {
			db.serialize(function(){
				private_stmt.run(source_user, message_text, post_time, target_user, 'PRIVATE', function(err){
					if(err) {
						callback(err, null);
						return;
					} else {
						callback(null,private_message);
					}
					private_stmt.finalize();
				});
			});
		}
	});
}

Message.postGroupMessage = function(source_user, message_text, post_time, target_user, callback) {
	var group_stmt = db.prepare("INSERT INTO message VALUES (?,?,?,?,?);");
	var group_message = new Message(source_user, message_text, post_time, target_user, 'GROUP');
	
	checkTableExists(function(isSuccess) {
		if(isSuccess) {
			db.serialize(function() {
				group_stmt.run(source_user,message_text,post_time,target_user, 'GROUP', function(err) {
					if(err) {
						callback(err,null);
						return;
					} else {
						callback(null,group_message);
					}
					group_stmt.finalize();
				});
			});
		}
	});
}

Message.getGroupMessage = function(chatname, callback) {
	var query = "SELECT source_user, message_text, post_time FROM message WHERE message_type=\"GROUP\" AND target_user=\"" + chatname + "\"";
	var group_messages = [];
		
	checkTableExists(function(isSuccess) {
		if(isSuccess) {
			db.each(query, function(err,row) {
				if(err) {
					callback(err,null);
					return;
				} else {
					var group_message = new Message(row.source_user, row.message_text, row.post_time, chatname, 'GROUP');
					group_messages.push(group_message);
				}
			}, function(err, complete) {
				if(err) {
					callback(err,null);
					return;
				} else {
					callback(null, group_messages);
				}
			});
		}
	});
}
Message.searchPublicMessage = function(words, callback) {
	var query1 = "SELECT source_user, message_text, post_time FROM message WHERE message_type=\"PUBLIC\" AND target_user=\"WALL\"";
	var query2="";
	for(var i=0;i<words.length;i++) {
		query2 += " AND message_text LIKE \"%" + words[i] + "%\"";
	}
	var query = query1 + query2;
	var public_messages = [];
	checkTableExists(function(isSuccess){
		if(isSuccess) {
			db.each(query, function(err,row){
				if(err) {
					callback(err,null);
					return;
				} else {
					var public_message = new Message(row.source_user, row.message_text, row.post_time, 'WALL', 'PUBLIC');
					public_messages.push(public_message);
				}
			}, function(err,complete){
				if(err) {
					callback(err,null);
					return;
				} else {
					callback(null,public_messages);
				}
			});
		}
	});
}

Message.searchPrivateMessage = function(words, source_user, callback) {
	var query1 = "SELECT * FROM message WHERE message_type=\"PRIVATE\" AND source_user=\"" + source_user + "\"";
	var query2="";
	for(var i=0;i<words.length;i++) {
		query2 += " AND message_text LIKE \"%" + words[i] + "%\"";
	}
	var query = query1 + query2;
	var private_messages = [];
	checkTableExists(function(isSuccess){
		if(isSuccess) {
			db.each(query, function(err,row){
				if(err) {
					callback(err,null);
					return;
				} else {
					var private_message = new Message(row.source_user, row.message_text, row.post_time, row.target_user, 'PRIVATE');
					private_messages.push(private_message);
				}
			}, function(err,complete){
				if(err) {
					callback(err,null);
					return;
				} else {
					callback(null,private_messages);
				}
			});
		}
	});
}

module.exports = Message;
