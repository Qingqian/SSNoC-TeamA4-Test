var User = require('../models/user');
var Message = require('../models/message');
var Announcement = require('../models/announcement');

module.exports = function(_, online_users) {
	return {
		getSearchPage: function(req,res) {
			res.render('search');
		},

		searchUser : function(req,res) {
			var username = req.body.username;
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
			var status = req.body.user_status;
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

	};
};