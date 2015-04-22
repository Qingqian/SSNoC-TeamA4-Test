var $signUpForm = $('#signUpForm');
var $loginForm = $('#loginForm');
var $adminLoginForm = $('#adminLoginForm');
var reserved = "about access account accounts add address adm admin administration adult advertising affiliate affiliates ajax analytics android anon anonymous api app apps archive atom auth authentication avatar backup banner banners bin billing blog blogs board bot bots business chat cache cadastro calendar campaign careers cgi client cliente code comercial compare config connect contact contest create code compras css dashboard data db design delete demo design designer dev devel dir directory doc docs domain download downloads edit editor email ecommerce forum forums faq favorite feed feedback flog follow file files free ftp gadget gadgets games guest group groups help home homepage host hosting hostname html http httpd https hpg info information image img images imap index invite intranet indice ipad iphone irc java javascript job jobs js knowledgebase log login logs logout list lists mail mail1 mail2 mail3 mail4 mail5 mailer mailing mx manager marketing master me media message microblog microblogs mine mp3 msg msn mysql messenger mob mobile movie movies music musicas my name named net network new news newsletter nick nickname notes noticias ns ns1 ns2 ns3 ns4 old online operator order orders page pager pages panel password perl pic pics photo photos photoalbum php plugin plugins pop pop3 post postmaster postfix posts profile project projects promo pub public python random register registration root ruby rss sale sales sample samples script scripts secure send service shop sql signup signin search security settings setting setup site sites sitemap smtp soporte ssh stage staging start subscribe subdomain suporte support stat static stats status store stores system tablet tablets tech telnet test test1 test2 test3 teste tests theme themes tmp todo task tasks tools tv talk update upload url user username usuario usage vendas video videos visitor win ww www www1 www2 www3 www4 www5 www6 www7 wwww wws wwws web webmail website websites webmaster workshop xxx xpg you yourname yourusername yoursite yourdomain";
var reserved_usernames = reserved.split(" ");

jQuery.validator.addMethod("validUsername", function(value, element){
	return this.optional(element) || reserved_usernames.indexOf(value) == -1;
}, "You picked up a reserved username. Please pick another one.");

$signUpForm.validate({
	rules: {
		username: {
			required: true,
			minlength:3,
			validUsername: true
		},
		password : {
			required : true,
			minlength: 4
		},
		password_confirmation : {
			equalTo : "#password",
			minlength:4
		}
	},
		messages: {
			username : {
				required: "Please enter your  username",
				minlength: "Your first name should be at least 3 characters"
			},
			password : {
				required: "Please enter your password",
				minlength: "Your password should be at least 4 characters"
			},
			password_confirmation : {
				equalTo: "Passwords are not the same. Please check and provide another one.",
				minlength: "Your password should be at least 4 characters"
			}
		},
		submitHandler: function(form) {
			form.submit();
		}
});

$loginForm.validate({
	rules : {
		username: {
			required : true,
			minlength : 3
		},
		password : {
			required : true,
			minlength :4
		}
	},
	messages : {
		username : {
			required: "Please enter your username",
			minlength: "Your first name should be at least 3 characters"
		},
		password : {
			required: "Please enter your password",
			minlength: "Your password should be at least 4 characters"
		}
	},
	submitHandler: function(form) {
		form.submit();
	}
});

$adminLoginForm.validate({
	rules : {
		admin_username: {
			required : true,
			minlength : 3
		},
		admin_password : {
			required : true,
			minlength :4
		}
	},
	messages : {
		admin_username : {
			required: "Please enter your username",
			minlength: "Your first name should be at least 3 characters"
		},
		admin_password : {
			required: "Please enter your password",
			minlength: "Your password should be at least 4 characters"
		}
	},
	submitHandler: function(form) {
		form.submit();
	}
});

