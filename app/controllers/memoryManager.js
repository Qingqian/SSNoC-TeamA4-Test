var Memory = require('../models/memory');

module.exports = function(_) {
	return {
		getMemoryPage: function(req,res) {
			res.render('monitor_memory');
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