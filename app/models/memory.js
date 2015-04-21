/*******************************
* Memory Entity Model
*******************************/
var os = require('os');
var storage = require('storage-device-info');
var fs = require('fs');
var db_file = 'memory.db';
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(db_file);

var exists = fs.existsSync(db_file);
if (!exists) {
    console.log("Creating memory test DB file.");
    fs.openSync(db_file, 'w');
}

function Memory(timestamp, used_volatile_memory, free_volatile_memory, used_non_volatile_memory, free_non_volatile_memory) {
	this.timestamp = timestamp;
	this.used_volatile_memory = used_volatile_memory;
	this.free_volatile_memory = free_volatile_memory;
	this.used_non_volatile_memory = used_non_volatile_memory;
	this.free_non_volatile_memory = free_non_volatile_memory;
}

function checkTableExists(callback) {
	db.run("CREATE TABLE if not exists memory (timestamp TEXT, used_volatile_memory TEXT, free_volatile_memory TEXT, used_non_volatile_memory TEXT, free_non_volatile_memory TEXT)", function(err){
		if(err) {
			callback(false);
			return;
		} else {
			callback(true);
		}
	});
}

Memory.saveMonitorMemory = function(callback) {
	var timestamp = new Date().getTime();
	var totalMem = os.totalmem();
	var freeMem = (os.freemem()/1000).toFixed(2) + "KB";
	var usedVM = ((totalMem - os.freemem()/1000)/1000).toFixed(2) + "KB";
	storage.getPartitionSpace("/opt",function(error,space) {
		if(error) {
			callback(error, null);
			return;
		}
		var usedNVM = ((space.totalMegaBytes - space.freeMegaBytes) * 1000).toFixed(2) + "KB";
		var freeNVM = (space.freeMegaBytes * 1000).toFixed(2) + " KB";
		checkTableExists(function(isSuccess){
			if(isSuccess) {
				db.serialize(function(){
					var memory_stmt = db.prepare("INSERT INTO memory VALUES (?, ?, ?, ?, ?)"); 
					memory_stmt.run(timestamp, usedVM, freeMem, usedNVM, freeNVM, function(err){
						if (err) {
							callback(err,null);
							return;
						} else {
							var memory_usage = new Memory(timestamp, usedVM, freeMem, usedNVM, freeNVM);
							callback(null, memory_usage);
						}
						memory_stmt.finalize();
					});
				});
			}
		});
	});		
}

Memory.getAllMemoryUsage = function(callback) {
	var last_hour = new Date().getTime() -3600000;
	var query = "SELECT * FROM memory WHERE timestamp > " + last_hour;
	var memory_usages = [];
	checkTableExists(function(isSuccess){
		if(isSuccess) {
			db.each(query, function(err,row){
				if(err) {
					callback(err,null);
					return;
				} else {
					var memory_usage = new Memory(row.timestamp, row.used_volatile_memory, row.free_volatile_memory, row.used_non_volatile_memory, row.free_non_volatile_memory);
					memory_usages.push(memory_usage);
				}
			}, function(err,complete){
				if(err) {
					callback(err,null);
					return;
				} else {
					callback(null,memory_usages);
				}
			});
		}
	});
}

module.exports = Memory;