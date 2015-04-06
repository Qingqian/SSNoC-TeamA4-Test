var User = require('../models/user');

module.exports = function(_) {
	return {
		getSignup: function(req, res) {
			res.render('signup', {message: req.flash('SignupMessage')});
		},

		getLogin: function(req, res) {
			res.render('login', {message: req.flash('LoginMessage')});
		},

		getLogout: function(req, res) {
			req.logout();
			res.redirect('/');
		},

		postWelcomeMessage: function(req, res) {
			res.render('welcome');
		},

		getAllUser : function(req,res) {
			User.getAllUsers(function(err, users){
				if(users) {
					res.json({total_users: users});
				}
			});
		},

		getUser : function(req,res) {
			var username = req.session.passport.user.username;
			User.getUser(username, function(err,user){
				if(user) {
					res.json({user:user});
				}
			});
		},

		getDirectory : function(req,res) {
			res.render('directory');
		},

		changeStatus : function(req,res) {
			var username = req.session.passport.user.username;
			var user_status = req.body.user_status;
			var change_status_time = req.body.change_status_time;
			User.changeStatus(username, user_status, change_status_time, function(err, data){
				if(err) {
					res.json({err_message: 'Error on changing user status', success_message : null});
				} else {
					res.json({err_message: null, success_message: 'Success on updating user status', user_info: data});
				}
			});
		},

		getStatus : function(req, res) {
			var username = req.session.passport.user.username;
			User.getUser(username,function(err,user){
				if(err) {
					res.json({err_message:'Error on getting user current status', success_message : null});
				} else {
					res.json({err_message: null, success_message: 'Success on getting user current status', user_info:user});
				}
			});
		},

		getStatusPage : function(req,res) {
			res.render('share_status');
		}

	};
};