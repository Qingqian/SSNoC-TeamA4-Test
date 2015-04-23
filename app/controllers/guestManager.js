var Guest = require('../models/guest');
var Message = require('../models/message');
var User = require('../models/user');

module.exports = function(_, online_users) {
	return {
		getGroupChats : function(req,res) {
			var source_user = req.session.passport.user.username;
			Guest.getGroupChats(source_user, function(err, groupChats) {
				if(err) {
					console.log('error on getting group chat names');
				} else {
					res.json({groupchats: groupChats});
				}
			});
		},
		
		getMembers : function(req,res) {
			var chatname = req.body.chatname;
			Guest.getMembers(chatname, function(err, members) {
				if(err) {
					console.log('error on getting members');
				} else {
					res.json({members: members});
				}
			});
		},
		
		addNewGuest : function(req,res) {
			var chatname = req.body.chatname;
			var source_user = req.body.username;
			Guest.addNewGuest(source_user,chatname, function(err, newGuest) {
				if(err) {
					console.log('error on adding new guest');
				} else {
					res.json({newGuest: newGuest, chatname: chatname});
				}
			});
		},
		
		addNewMessage : function(req,res) {
			var chatname = req.body.target_user;
			var source_user = req.body.source_user;
			var post_time = req.body.post_time;
			var message = req.body.message_text;
			Message.postGroupMessage(source_user, message, post_time, chatname, function(err, group_message) {
				if(err) {
					console.log('error on posting group message');
				} else {
					res.json({group_message: group_message});
				}
			});
		},
		
		getGroupMessages : function(req,res) {
			var chatname = req.body.chatname;
			console.log(chatname);
			Message.getGroupMessage(chatname, function(err, group_messages) {
				if(err) {
					console.log('error on getting group messages');
				} else {
					res.json({group_messages: group_messages});
				}
			});
		},
		
		getInviteList : function(req,res) {
			var chatname = req.body.chatname;
			var invitelist = [];
			Guest.getMembers(chatname, function(err, members) {
				if(err) {
					console.log('error on getting members');
				} else {
					User.getAllUsers(function(err, users) {
						if(users) {
							for(var i = 0; i < users.length; i++) {
								if(members.indexOf(users[i].username) == -1) {
									invitelist.push(users[i].username);
								} 
							}
							res.json({invitelist: invitelist});
						}
					});
				}
			});
		},
		getGroupChatPage : function(req,res) {
			var source_user = req.body.source_user;
			res.render('group_chat', {source_user: source_user});
		},


		getMapPage : function(req,res) {
			var source_user = req.body.source_user;
			res.render('map', {source: source_user});
		},
		
		openGroupChatPage : function(req,res) {
			var chatname = req.body.chatname;
			var source_user = req.body.source_user;
			res.render('single_group_chat',{source: source_user, chatname: chatname});
		}
	};
};
