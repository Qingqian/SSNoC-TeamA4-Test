var Memory = require('../models/memory');
var User = require('../models/user');

module.exports = function(_) {
	return {
		getMemoryPage: function(req,res) {
			var username = req.session.passport.user.username;
			var usecase = "monitor_memory";
			User.checkPrivilege(username, usecase, function(err, has_privilege){
				if(err || !has_privilege) {
					res.render('no_privilege');
				} else if(has_privilege) {
					res.render('monitor_memory');
				}
			});
		},

		startMemory: function(req,res) {
			Memory.saveMonitorMemory(function(err, memory_usage){
				res.json({memory_usage:memory_usage});
			});
		},

		getAllMemoryUsage: function(req,res) {
			Memory.getAllMemoryUsage(function(err, memory_usages){
				res.json({memory_usages : memory_usages});
			});
		}
	};
};