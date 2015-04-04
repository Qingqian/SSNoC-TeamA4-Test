var Message = require('../models/message');

module.exports = function(_) {
	return {
		getPublicMessages : function(req,res) {
			Message.getPublicMessages(function(err, public_messages){
				if(err) {
					console.log('error on getting public chat messages.');
				} else {
					res.json({public_messages: public_messages});
				}
			});
		},

		postPublicMessage : function(req,res) {
			var source_user = req.body.source_user;
			var message_text = req.body.message_text;
			var post_time = req.body.post_time;
			Message.postPublicMessage(source_user, message_text, post_time, function(err, public_message){
				if(err) {
					console.log('error on posting public chat message.');
				} 
				res.json({public_message:public_message});
			});
		},

		getPublicChatPage : function(req,res) {
			res.render('public_chat');
		},

		getPrivateMessages: function(req,res) {

		},

		postPrivateMessage : function(req,res) {

		},

		getPrivateChatPage : function(req,res) {
			var source_user = req.body.source_user;
			var target_user = req.body.target_user;
			res.render('private_chat', {source : source_user, target: target_user});
		}
	};
};
