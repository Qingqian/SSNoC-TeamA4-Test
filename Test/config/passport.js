var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/user');

module.exports = function(passport) {
	/*****set up session*****/
	passport.serializeUser(function(user, done) {
  		done(null, {username: user.username});
	});
	passport.deserializeUser(function(user, done) {
  		User.getUser(user.username, function(err, user) {
    		done(err, user);
  		});
  	});

  	/**********LOCAL LOGIN*************/
  	passport.use('local-login', new LocalStrategy({
  		//override default
  		usernameField: 'username',
  		passwordField: 'password',
  		passReqToCallback :true

  		},
  		function(req, username, password, done) {
  			//async
  			process.nextTick(function() {
  				User.getUser(username, function(err, user) {
  					if(err) {
              			console.log(err);
  						return done(err);
  					}
  					if(!user) {
              			console.log('no such user');
  						return done(null,false, req.flash('loginMessage','No user found.'));
  					}
  					user.isValidPassword(password, function(isValid){
                        if(isValid) {
                            console.log('login successfully')
                            return done(null,user);
                        } else {
                            console.log('invalid pwd');
                            return done(null, false, req.flash('loginMessage','wrong password'));
                        }
                    });
  				});
  			});
  		}
  	));

  	/*****************LOCAL SIGNUP********************/
  	passport.use('local-signup', new LocalStrategy({
  		//override default
  		usernameField : 'username',
  		passwordField : 'password',
  		passReqToCallback : true
  		},
  		function(req, username, password, done) {
  			//async
  			process.nextTick(function() {
  				if(!req.user) {
  					User.getUser(username, function(err, user) {
  						if(err) {
  							return done(err);
  						}
                        if(user) {
                            return done(null, user);
                        } else {
                            User.saveNewUser(username, password, function(err, newUser){
                                if(err)
                                    return done(null, false, req.flash('signupMessage','Signup fail at ' + err));
                                return done(null, newUser);
                            });
  						}
  					});
  				} else {
  					return done(null,req.user);
  				}
  				
  			});
  		}
  	));
};