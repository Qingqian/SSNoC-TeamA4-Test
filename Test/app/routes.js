module.exports = function(app, _, passport){
	/******************* Controller initialization start ****************/
	var userManager = require('./controllers/userManager')(_);
	app.get('/', userManager.getLogin);
	app.get('/welcome', userManager.postWelcomeMessage);
	
	/******************* Controller initialization end ****************/

	/******************* authenticate routes start ****************/
	//LOGIN PART
	app.get('/login', userManager.getLogin);

	app.post('/login', passport.authenticate('local-login',{
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}));

	//SIGNUP PART
	app.get('/signup', userManager.getSignup);

	app.post('/signup', passport.authenticate('local-signup',{
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true
	}));
	/******************* authenticate routes end ****************/
};