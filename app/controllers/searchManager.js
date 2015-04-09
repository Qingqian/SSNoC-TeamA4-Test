var User = require('../models/user');
var Message = require('../models/message');
var Announcement = require('../models/announcement');

module.exports = function(_, online_users) {
	return {
		getSearchPage: function(req,res) {
			res.render('search');
		},

		searchUser : function(req,res) {
			var username = req.body.search_word;
			var online = [];
			var offline = [];
			User.searchUser(username, function(err, users){
				if(err) {
					res.json({err_message: 'error on getting users with this username', success_message: null});
				} else {
					for(var i=0;i<users.length;i++) {
						if((users[i].username in online_users)) {
							online.push(users[i]);
						} else {
							offline.push(users[i]);
						}
					}
					res.json({err_message: null, success_message: 'success on getting users with this username', online_users: online, offline_users: offline});
				}
			});
		},

		searchStatus : function(req,res) {
			var status = req.body.search_word;
			var online = [];
			var offline = [];
			User.searchStatus(status, function(err, users){
				if(err) {
					res.json({err_message: 'error on getting users with this status', success_message: null});
				} else {
					for(var i=0;i<users.length;i++) {
						if((users[i].username in online_users)) {
							online.push(users[i]);
						} else {
							offline.push(users[i]);
						}
					}
					res.json({err_message: null, success_message: 'success on getting users with this status', online_users: online, offline_users: offline});
				}
			});
		},

		searchPublicMessage : function(req,res) {
			var words = req.body.words;
			Message.searchPublicMessage(words, function(err,public_messages){
				if(err) {
					res.json({err_message:'error on getting public messages containing these words', success_message:null});
				} else {
					res.json({err_message:null, success_message:'success on getting public messages containing these words', public_messages: public_messages});
				}
			});
		},

		searchAnnouncement : function(req,res) {
			var words = req.body.words;
			Announcement.searchAnnouncement(words, function(err, announcements){
				if(err) {
					res.json({err_message:'error on getting announcements containing these words', success_message:null});
				} else {
					res.json({err_message:null, success_message:'success on getting announcements containing these words', announcements: announcements});
				}
			});
		},

		searchPrivateMessage : function(req,res) {
			var source_user = req.session.passport.user.username;
			var words = req.body.words;
			Message.searchPrivateMessage(words, source_user, function(err, private_messages){
				if(err) {
					res.json({err_message:'error on getting private messages containing these words', success_message:null});
				} else {
					res.json({err_message:null, success_message:'success on getting private messages containing these words', private_messages: private_messages});
				}
			});
		}

	};
};