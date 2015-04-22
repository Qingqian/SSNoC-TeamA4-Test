var User = require('../models/user');
var Admin = require('../models/user');


module.exports = function(_) {
	return {
		getSignup: function(req, res) {
			res.render('signup', {message: req.flash('SignupMessage')});
		},

		getLogin: function(req, res) {
			res.render('login', {message: req.flash('LoginMessage')});
		},

		getLogout: function(req, res) {
			var username = req.session.passport.user.username;
			req.session.destroy();
			res.render('logout',{username:username});
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
		},
	
		getCompassPage : function(req,res) {
			var target_user = req.body.target_user;
			var source_user = req.body.source_user;
			res.render('compass', {source : source_user, target : target_user});
		},

		getCompassUser: function(req,res) {
			var other_user = req.body.target_user;
			User.getUser(other_user, function(err,user){
				if (err){
					res.json({username:other_user, lat:undefined, lon:undefined, gps_enabled:undefined});
				} else {
					res.json({username:other_user, lat:user.lat, lon:user.lon, gps_enabled:user.gps_enabled});
				}
			});
		},

		getGPSPage : function(req,res){
			res.render('gps');
		},

		changeGPSCoords : function(req, res) {
			var username = req.session.passport.user.username;
			var lat = req.body.lat;
			var lon = req.body.lon;
			var gps_enabled = req.body.gps_enabled;
			User.changeGPS(username, lat, lon, gps_enabled, function(err,result){
				if (err){
					res.json({err_message:'Error setting gps location', success_message: null});
				} else {
					res.json({err_message:null, success_message: "successfully updated gps coordinates"});
				}
			});
		},

		/******************* routes start ****************/
		clearDB : function(req, res) {
			User.clearDB();
			res.render('login', {message: req.flash('LoginMessage')});
		}
	};
};
