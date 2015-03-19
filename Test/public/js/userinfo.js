var $signUpForm = $('#signUpForm');
var $loginForm = $('#loginForm');

$signUpForm.validate({
	rules: {
		username: {
			required: true,
			minlength:3
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
				required: "Please enter your first name",
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

$loginForm.validate({
	rules : {
		username: {
			required : true,
			email : true
		},
		password : {
			required : true,
			minlength :4
		}
	},
	messages : {
		username : {
			required: "Please enter your email",
			email: "Please enter a valid email address!!!"
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


