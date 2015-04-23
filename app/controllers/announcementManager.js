var Announcement = require('../models/announcement');
var User = require('../models/user');

module.exports = function(_) {
	return {
		getAnnouncementPage : function(req,res) {
			var username = req.session.passport.user.username;
			var usecase = "post_announcement";
			User.checkPrivilege(username, usecase, function(err, has_privilege){
				if(err || !has_privilege) {
					res.render('no_privilege');
				} else if(has_privilege) {
					res.render('announcement');
				}
			});
		},

		getAllAnnouncements : function(req,res) {
			Announcement.getAllAnnouncements(function(err, announcements){
				if(err) {
					console.log('error on getting all previous announcements');
				} else {
					res.json({announcements: announcements});
				}
			});
		},

		postAnnouncement : function(req,res) {
			var username = req.session.passport.user.username;
			var post_title = req.body.post_title;
			var post_content = req.body.post_content;
			var post_time = req.body.post_time;
			var post_data ={username: username, post_title: post_title, post_content: post_content, post_time: post_time};
			Announcement.postAnnouncements(post_data, function(err, announcement){
				if(err) {
					console.log('error on posting announcement');
				} else {
					res.json({announcement: announcement});
				}
			});
		}
	};
};
