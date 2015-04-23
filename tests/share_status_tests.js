var test = require('unit.js');
var assert = test.assert;

describe("share status", function(){
	var user = require('../app/models/user.js');
	user.clearDB();
	it("should successfully upload status to db", function(done){
		user.saveNewUser("user1", "password", function(err, ret){
			assert(err == null);
			assert(ret.username == "user1");
			assert(ret.password != null);
			user.changeStatus("user1", "status1", "time1", function(err, ret){
				assert(err == null);
				assert(ret != null);
				assert(ret.username == "user1");
				assert(ret.user_status == "status1");
				assert(ret.change_status_time == "time1");
				done();
			});
		});
	});
	it("should change status mulitple times", function(done){
		user.changeStatus("user1", "status2", "time1", function(err, ret){
			assert(err == null);
			assert(ret != null);
			assert(ret.username == "user1");
			assert(ret.user_status == "status2");
			assert(ret.change_status_time == "time1");
			user.changeStatus("user1", "status3", "time1", function(err, ret){
				assert(err == null);
				assert(ret != null);
				assert(ret.username == "user1");
				assert(ret.user_status == "status3");
				assert(ret.change_status_time == "time1");
				done();
			});
		});
	});
	it("should be able to look up user status", function(done){
		user.changeStatus("user1", "status2", "time1", function(err, ret){
			assert(err == null);
			assert(ret != null);
			assert(ret.username == "user1");
			assert(ret.user_status == "status2");
			assert(ret.change_status_time == "time1");
			user.getUser("user1", function(err, ret){
				assert(err == null);
				assert(ret != null);
				assert(ret.user_status == "status2");
				done();
			});
		});
	});
});
