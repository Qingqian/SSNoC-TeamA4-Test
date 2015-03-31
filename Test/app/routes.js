module.exports = function(app, _, io, passport,citizens){
	/******************* Controller initialization start ****************/
	var userManager = require('./controllers/userManager')(_);
	
	
	/******************* Controller initialization end ****************/

	/******************* routes start ****************/
	app.get('/', userManager.getLogin);
	app.get('/welcome', checkLogIn, userManager.postWelcomeMessage);
	app.get('/login', userManager.getLogin);

	app.post('/login', passport.authenticate('local-login',{
		successRedirect: '/directory',
		failureRedirect: '/',
		failureFlash: true
	}));
	app.get('/signup', userManager.getSignup);

	app.post('/signup', passport.authenticate('local-signup',{
		successRedirect: '/welcome',
		failureRedirect: '/signup',
		failureFlash: true
	}));
	app.get('/logout', checkLogIn, userManager.getLogout);
	app.get('/user_socket', checkLogIn, userManager.getUser);
	app.get('/directory', checkLogIn, userManager.getDirectory);


	/******************* routes end ****************/
	function checkLogIn(req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/');
	}
};