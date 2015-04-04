/* database code */

//db set up
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('chat_database.db');

var writeMsg;
var setUser;

function db_init(){
db.serialize(function() {
	db.run("CREATE TABLE if not exists user_info (username TEXT, password TEXT)");
	db.run("CREATE TABLE if not exists messages (msg TEXT)");
	writeMsg = db.prepare("INSERT INTO messages VALUES (?)");
	setUser = db.prepare("INSERT INTO user_info VALUES (?, ?)");
});
}

function addNewUser(username, password){
	db.serialize(function() {
		setUser.run(username, password, function(err){
			if (err)
				print_table();
		});
	});
}

function getPassword(username, callback){
	var query = "SELECT username,password FROM user_info WHERE username=\"" + username + "\"";
	db.get(query, function(err, row){
		callback(row.password);
		return;
	});
}

function queryUser(username, callback){
	var query = "SELECT * FROM user_info WHERE username=\"" + username + "\"";
	db.get(query, function(err, row){
		if (!err){
			callback(true);
			return;
		}
		else{
			callback(false);
			return;
		}
	});
}

function addNewMsg(msg){
	db.serialize(function() {
		writeMsg.run(msg, function(err){
			if (err)
				print_table();
		});
	});
}

function print_table(){
	db.serialize(function() {
		db.each("SELECT rowid AS id, username,password FROM user_info", function(err, row) {
			console.log(row.id + ": " + row.username + ": " + row.password);
		});
		db.each("SELECT rowid AS id, msg FROM messages", function(err, row) {
			console.log("message " + row.id + ": " + row.msg);
		});
	});
}

function db_finalize(){
	writeMsg.finalize();
	setUser.finalize();
	db.close();
}

function passwordCallback(pass){
	console.log(pass);
}

function userCallback(present){
	console.log(present);
}
/* end database code */

db_init();