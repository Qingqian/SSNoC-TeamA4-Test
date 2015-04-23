var Admin = require('../models/user');
var User = require('../models/user');

module.exports = function(_) {
	return {
		getAdminPage : function(req,res) {
			var username = req.session.passport.user.username;
			var usecase = "admin_profile";
			User.checkPrivilege(username, usecase, function(err, has_privilege){
				if(err || !has_privilege) {
					res.render('no_privilege');
				} else if(has_privilege) {
					res.render('admin_profile');
				}
			});
		},

		adminLoginPage : function(req,res) {
			Admin.preloadAdmin("SSNAdmin","admin","OK","ADMINISTRATOR",function(isSuccess){
				if(isSuccess) {
					res.render('admin_login');
				}
			});
		},

		getUserProfile : function(req,res) {
			var username = req.body.username;
			Admin.getUser(username, function(err, user){
				if(err) {
					console.log('error on getting current user\' profile');
				} else {
					res.json({selected_user: user});
				}
			});
		},

		updateUserProfile: function(req,res) {
			var username = req.body.username;
			var password = req.body.password;
			var account_status = req.body.account_status;
			var privilege_level = req.body.privilege_level;
			var old_username = req.body.old_username;
			Admin.updateProfile(username, password, account_status, privilege_level, old_username, function(err,err_message, updated_user){
				if(err) {
					res.json({err_message : err});
				} else if(err_message) {
					res.json({err_message: err_message});
				} else {
					res.json({err_message : null, updated_user: updated_user});
				}
			});
		}

	};
};