var TestMessage = require('../models/performance');

module.exports = function(_) {
	return {
		getPerformancePage: function(req,res) {
			res.render('monitor_performance');
		},

		postTestMessage : function(req,res) {
			var source_user = req.body.source_user;
			var message_text = req.body.message_text;
			var post_time = req.body.post_time;
			TestMessage.postPublicMessage(source_user, message_text, post_time, function(err,message){
				if(err) {
					console.log('Error on posting test message');
				} else {
					res.json({message: message});
				}
			});
		},

		getTestMessages : function(req,res) {
			TestMessage.getPublicMessages(function(err, messages){
				if(err) {
					console.log('error on getting test messages');
				} else {
					res.json({messages: messages});
				}
			});
		},

		shutDownPerformance: function(req,res) {
			TestMessage.shutdownDB();
		}
	};
};

