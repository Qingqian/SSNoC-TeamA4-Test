module.exports = function(app, _, io, passport, online_users){
	/******************* Controllers initialization start ****************/
	var userManager = require('./controllers/userManager')(_);
	var messageManager = require('./controllers/messageManager')(_);
	var announcementManager = require('./controllers/announcementManager')(_);
	var searchManager = require('./controllers/searchManager')(_,online_users);
	var groupChatManager = require('./controllers/guestManager')(_);
	var performanceManager = require('./controllers/performanceManager')(_);
	var memoryManager = require('./controllers/memoryManager')(_);
	var adminManager = require('./controllers/adminManager')(_);
	/******************* Controllers initialization end ****************/

	/******************* routes start ****************/

	/************************* Login ****************************/
	app.get('/', userManager.getLogin);
	app.get('/welcome', checkLogIn, userManager.postWelcomeMessage);
	app.get('/login', userManager.getLogin);
	app.post('/login', passport.authenticate('local-login',{
		successRedirect: '/directory',
		failureRedirect: '/',
		failureFlash: true
	}));
	/************************* Signup ****************************/
	app.get('/signup', userManager.getSignup);
	app.post('/signup', passport.authenticate('local-signup',{
		successRedirect: '/welcome',
		failureRedirect: '/signup',
		failureFlash: true
	}));
	/************************* logout ****************************/
	app.get('/logout', checkLogIn, userManager.getLogout);
	/************************* GPS ****************************/
	app.get('/gps', checkLogIn, userManager.getGPSPage);
	app.post('/gps', checkLogIn, userManager.changeGPSCoords);
	/************************ compass *************************/
	app.post('/compass', checkLogIn, userManager.getCompassPage);
	app.post('/compass-user', checkLogIn, userManager.getCompassUser);
	/*********************** directory ************************/
	app.get('/users', checkLogIn, userManager.getAllUser);
	app.get('/user', checkLogIn, userManager.getUser);
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
	app.get('/get-groupchat-list',checkLogIn,groupChatManager.getGroupChats);
	app.post('/open-group-chat',checkLogIn, groupChatManager.openGroupChatPage);
	app.post('/get-members',checkLogIn, groupChatManager.getMembers);
	app.post('/group-history', checkLogIn, groupChatManager.getGroupMessages);
	app.post('/new-group-message', checkLogIn, groupChatManager.addNewMessage);
	app.post('/invite', checkLogIn, groupChatManager.addNewGuest);
	app.post('/get-invitelist',checkLogIn, groupChatManager.getInviteList);
	/************************ Map ********************************/
	app.get('/map', checkLogIn, groupChatManager.getMapPage);
	/********************* Search Information *********************/
	app.get('/search', checkLogIn, searchManager.getSearchPage);
	app.post('/search-user',checkLogIn, searchManager.searchUser);
	app.post('/search-status',checkLogIn, searchManager.searchStatus);
	app.post('/search-public-message', checkLogIn, searchManager.searchPublicMessage);
	app.post('/search-announcement', checkLogIn, searchManager.searchAnnouncement);
	app.post('/search-private-message',checkLogIn, searchManager.searchPrivateMessage);
	/********************* Monitoring Performance *********************/
	app.get('/monitor-performance', checkLogIn, performanceManager.getPerformancePage);
	app.post('/post-test-message', checkLogIn, performanceManager.postTestMessage);
	app.get('/get-test-messages', checkLogIn, performanceManager.getTestMessages);
	app.post('/performance-shutdown', checkLogIn, performanceManager.shutDownPerformance);
	/************************ Monitoring Memory *************************/
	app.get('/monitor-memory', checkLogIn, memoryManager.getMemoryPage);
	app.post('/start-memory',checkLogIn, memoryManager.startMemory);
	app.get('/get-memory-usage',checkLogIn, memoryManager.getAllMemoryUsage);
	/************************* Admin Profile ************************/
	app.get('/admin-login', adminManager.adminLoginPage);
	app.post('/admin-login', passport.authenticate('admin-login',{
		successRedirect: '/directory',
		failureRedirect: '/admin-login',
		failureFlash: true
	}));
	app.get('/admin-user-profile',checkLogIn, adminManager.getAdminPage);
	app.post('/user',checkLogIn, adminManager.getUserProfile);
	app.post('/update-profile', checkLogIn, adminManager.updateUserProfile);

	/******************* Debug ****************/
	app.get('/cleardb', userManager.clearDB);

	/******************* routes end *******************/
	function checkLogIn(req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/');
	}
};
