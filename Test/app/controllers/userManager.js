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
			var username = req.session.passport.user.username;
			User.getUser(username, function(err,user){
				if(user) {
					User.getAllUsers(function(err, users){
						if(users) {
							res.json({current_user: user, total_users: users});
						}
					});
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
		}

	};
};