module.exports = function(app, _, io, passport, online_users){
	/******************* Controllers initialization start ****************/
	var userManager = require('./controllers/userManager')(_);
	var messageManager = require('./controllers/messageManager')(_);
	var announcementManager = require('./controllers/announcementManager')(_);
	/******************* Controllers initialization end ****************/

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
	app.get('/users', checkLogIn, userManager.getAllUser);
	app.get('/user', checkLogIn, userManager.getUser);
	/*********************** directory ************************/
	app.get('/directory', checkLogIn, userManager.getDirectory);
	/******************** Public Chat *************************/
	app.get('/public-wall', checkLogIn, messageManager.getPublicChatPage);
	app.get('/get-public-messages', checkLogIn, messageManager.getPublicMessages);
	app.post('/post-public-message', checkLogIn, messageManager.postPublicMessage);
	/********************* Share Status *********************/
	app.get('/share-status',checkLogIn, userManager.getStatusPage);
	app.get('/status', checkLogIn, userManager.getStatus);
	app.post('/share-status', checkLogIn, userManager.changeStatus);
	/********************* Post Announcement *********************/
	app.get('/announcement', checkLogIn, announcementManager.getAnnouncementPage);
	app.get('/all-announcements', checkLogIn, announcementManager.getAllAnnouncements);
	app.post('/announcement', checkLogIn, announcementManager.postAnnouncement);
	/********************* Private Chat *********************/
	app.post('/private-chat', checkLogIn, messageManager.getPrivateChatPage);


	/******************* routes end ****************/
	function checkLogIn(req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/');
	}
};