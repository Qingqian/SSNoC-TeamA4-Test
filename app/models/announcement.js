/*******************************
* Announcement Entity Model
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

function Announcement(username, post_title, post_content, post_time) {
	this.username = username;
	this.post_title = post_title;
	this.post_content = post_content;
	this.post_time = post_time;
}

function checkTableExists(callback) {
	db.run("CREATE TABLE if not exists announcements (username TEXT, post_title TEXT, post_content TEXT, post_time TEXT)", function(err){
		if(err) {
			callback(false);
			return;
		} else {
			callback(true);
		}
	});
}

Announcement.postAnnouncements = function(post_data, callback) {
	checkTableExists(function(isSuccess){
		if(isSuccess) {
			db.serialize(function(){
				var post_announcement_stmt = db.prepare("INSERT INTO announcements VALUES (?, ?, ?, ?)");
				post_announcement_stmt.run(post_data.username, post_data.post_title, post_data.post_content, post_data.post_time, function(err){
					if (err) {
						callback(err,null);
						return;
					} else {
						var new_announcement = new Announcement(post_data.username, post_data.post_title, post_data.post_content, post_data.post_time);
						callback(null, new_announcement);
					}	
					post_announcement_stmt.finalize();
				});
			});
		}
	});
}

Announcement.getAllAnnouncements = function(callback) {
	var query = "SELECT * FROM announcements";
	var announcements = [];
	checkTableExists(function(isSuccess){
		db.each(query, function(err,row){
			if(err) {
				callback(err,null);
				return;
			} else {
				var announcement = new Announcement(row.username, row.post_title, row.post_content, row.post_time);
				announcements.push(announcement);
			}
		}, function(err, complete){
			if(err) {
				callback(err,null);
				return; 
			} else {
				callback(null,announcements);
			}
		});
	});
}

module.exports = Announcement;


