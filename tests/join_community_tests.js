var test = require('unit.js');
var assert = test.assert;

describe("join community", function(){
	var user = require('../app/models/user.js');
	user.clearDB();
	it ("should register a new user", function(done){
		user.saveNewUser("user1", "password", function(err, ret){
			assert(err == null);
			assert(ret.username == "user1");
			assert(ret.password != null);
		
			user.getUser("user1", function(err, user){
				assert(err == null);
				assert(ret.username == "user1");
				assert(ret.password != null);
				done();
			});
		});
	});
	it("should correctly hash and unhash password", function(){
		var pw1 = "password";
		var encrypted = user.prototype.generateHash(pw1);
		var decrypted = user.prototype.decrypt(encrypted);
		assert(pw1 == decrypted);
		assert(pw1 != encrypted);
	});
	it("should hash password correctly when saving user", function(done){
		var encrypted1 = user.prototype.generateHash("password");
		user.getUser("user1", function(err, user){
			assert(err == null);
			var encrypted = user.password;
			assert(encrypted != "password");
			assert(encrypted == encrypted1);
			done();
		});
	});
	user.clearDB();
	it("should not be able to find user not in system", function(done){
		var fake_username = "fake-o";
		user.getUser(fake_username, function(err, data){
			assert(err == null);
			assert(data == null);
			done();
		});
	});
});
