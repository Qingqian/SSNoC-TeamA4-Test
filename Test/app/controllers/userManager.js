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
		}

	};
};