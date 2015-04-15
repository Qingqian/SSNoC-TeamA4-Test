module.exports = function(app, _, io, passport, online_users){
	/******************* Controllers initialization start ****************/
	var userManager = require('./controllers/userManager')(_);
	var messageManager = require('./controllers/messageManager')(_);
	var announcementManager = require('./controllers/announcementManager')(_);
	var searchManager = require('./controllers/searchManager')(_,online_users);
	var groupChatManager = require('./controllers/guestManager')(_);

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
	/************************* GPS ****************************/
	app.get('/gps', checkLogIn, userManager.getGPSPage);
	app.post('/gps', checkLogIn, userManager.changeGPSCoords);
	/************************ compass *************************/
	app.post('/compass', checkLogIn, userManager.getCompassPage);
	app.post('/compass-user', checkLogIn, userManager.getCompassUser);
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
	app.post('/private-message', checkLogIn, messageManager.postPrivateMessage);
	app.post('/private-history',checkLogIn, messageManager.getPrivateMessages);
	/********************* Group Chat *********************/
	app.get('/group-chat', checkLogIn, groupChatManager.getGroupChatPage);
	app.post('/new-group-chat', checkLogIn, groupChatManager.addNewGuest);
	app.post('/new-group-message', checkLogIn, groupChatManager.addNewMessage);
	app.get('/get-groupchat-list',checkLogIn,groupChatManager.getGroupChats);
	app.post('/open-group-chat',checkLogIn, groupChatManager.getGroupMessages);
	app.post('/invite', checkLogIn, groupChatManager.addNewGuest);
	app.post('/get-members',checkLogIn, groupChatManager.getMembers);
	app.post('/get-invitelist',checkLogIn, groupChatManager.getInviteList);
	/********************* Search Information *********************/
	app.get('/search', checkLogIn, searchManager.getSearchPage);
	app.post('/search-user',checkLogIn, searchManager.searchUser);
	app.post('/search-status',checkLogIn, searchManager.searchStatus);
	app.post('/search-public-message', checkLogIn, searchManager.searchPublicMessage);
	app.post('/search-announcement', checkLogIn, searchManager.searchAnnouncement);
	app.post('/search-private-message',checkLogIn, searchManager.searchPrivateMessage);

	/******************* Debug ****************/
	app.get('/cleardb', userManager.clearDB);

	/******************* routes end ****************/
	function checkLogIn(req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/');
	}
};
