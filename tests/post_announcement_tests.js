var test = require('unit.js');
var assert = test.assert;

describe("post announcement", function(){
	var message = require('../app/models/message.js');
	var user = require('../app/models/user.js');
	user.clearDB();
	it("should post messages to db without error", function(done){
		message.postPublicMessage("user1", "this is a message", "time", function(err, ret){
			assert(err == null);
			assert(ret != null);
			done();
		});
	});
	user.clearDB();
	it("should write messages properly to db", function(done){
		message.postPublicMessage("user1", "this is a message", "time", function(err, ret){
			assert(ret.source_user == "user1");
			assert(ret.message_text == "this is a message");
			assert(ret.post_time == "time");
			done();
		});
	});
	user.clearDB();
	it("should post messages to 'WALL' of type 'PUBLIC'", function(done){
		message.postPublicMessage("user1", "this is a message", "time", function(err, ret){
			assert(ret.target_user == "WALL");
			assert(ret.message_type == "PUBLIC");
			done();
		});
	});
	it("should be able to retrieve messages from db", function(done){
		message.getPublicMessages(function(err, ret){
			assert(err == null);
			assert(ret != null);
			item = ret[0];
			assert(item.source_user == "user1");
			assert(item.message_text == "this is a message");
			assert(item.post_time == "time");
			assert(item.target_user == "WALL");
			assert(item.message_type == "PUBLIC");
			done();
		});
	});
	it("should list all messages posted to db", function(done){
		message.postPublicMessage("user1", "this is a message", "time", function(err, ret){
			assert(ret.target_user == "WALL");
			assert(ret.message_type == "PUBLIC");
			message.postPublicMessage("user2", "message2", "time2", function(err, ret){
				assert(err == null);
				assert(ret != null);
				message.getPublicMessages(function(err, ret){
					assert(err == null);
					assert(ret != null);
					assert(ret[4].source_user == "user2");
					assert(ret[3].source_user == "user1");
					assert(ret[4].message_text == "message2");
					assert(ret[4].post_time == "time2");
					assert(ret[0].source_user == "user1");
					done();
				});
			});
		});
	});
});
