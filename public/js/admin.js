var client_socket = io.connect();
var selected_username;
var selected_password;
var admin;
var $profileForm = $('#profile_form');
var reserved = "about access account accounts add address adm admin administration adult advertising affiliate affiliates ajax analytics android anon anonymous api app apps archive atom auth authentication avatar backup banner banners bin billing blog blogs board bot bots business chat cache cadastro calendar campaign careers cgi client cliente code comercial compare config connect contact contest create code compras css dashboard data db design delete demo design designer dev devel dir directory doc docs domain download downloads edit editor email ecommerce forum forums faq favorite feed feedback flog follow file files free ftp gadget gadgets games guest group groups help home homepage host hosting hostname html http httpd https hpg info information image img images imap index invite intranet indice ipad iphone irc java javascript job jobs js knowledgebase log login logs logout list lists mail mail1 mail2 mail3 mail4 mail5 mailer mailing mx manager marketing master me media message microblog microblogs mine mp3 msg msn mysql messenger mob mobile movie movies music musicas my name named net network new news newsletter nick nickname notes noticias ns ns1 ns2 ns3 ns4 old online operator order orders page pager pages panel password perl pic pics photo photos photoalbum php plugin plugins pop pop3 post postmaster postfix posts profile project projects promo pub public python random register registration root ruby rss sale sales sample samples script scripts secure send service shop sql signup signin search security settings setting setup site sites sitemap smtp soporte ssh stage staging start subscribe subdomain suporte support stat static stats status store stores system tablet tablets tech telnet test test1 test2 test3 teste tests theme themes tmp todo task tasks tools tv talk update upload url user username usuario usage vendas video videos visitor win ww www www1 www2 www3 www4 www5 www6 www7 wwww wws wwws web webmail website websites webmaster workshop xxx xpg you yourname yourusername yoursite yourdomain";
var reserved_usernames = reserved.split(" ");

$('#alert_bar').hide();

jQuery.validator.addMethod("validUsername", function(value, element){
	return this.optional(element) || reserved_usernames.indexOf(value) == -1;
}, "You picked up a reserved username. Please pick another one.");

client_socket.on('connect', function(){
	getAllUsers();
});

function getAllUsers() {
	//get current admin
	$.ajax({
		url: '/user',
		type: 'GET',
		dataType: 'json'
	}).done(function(data){
		admin = data.user.username;
	}).fail(function(){
		console.log('error on getting all users');
	});
	//get all users in the system
	$.ajax({
		url: '/users',
		type: 'GET',
		dataType: 'json'
	}).done(function(data){
		update_user_list(data.total_users);
	}).fail(function(){
		console.log('error on getting all users');
	});
}

function update_user_list(total_users) {
	$('#user_directory').html('');
	for(var i=0;i<total_users.length;i++) {
		var current_user = total_users[i];
		if(current_user.username != admin)
			update_one_user(current_user);
	}
}

function update_one_user(current_user) {
	var icon_element = '<div class="col-xs-2 col-sm-2 col-md-1 col-lg-1"><a name="'+ current_user.username +'" class="edit_profile" href="#profile_modal" data-toggle="modal"><i class="glyphicon glyphicon glyphicon-pencil text-muted"></i></a></div>'
	var image_element = '<div class="col-xs-3 col-sm-2 col-md-1 col-lg-1"><img src="../../imgs/profile_image.png" height=40/></div>';
	var name_element = '<div class="col-xs-7 col-sm-8 col-md-10 col-lg-10"><h5><strong>' + current_user.username + '</strong></h5></div>';
	var info_element = '<div class="row user-row search_item">' + image_element + name_element + icon_element + '</div>';
	$('#user_directory').append(info_element);
}

$('body').on("click", ".edit_profile", function(){
	var username = $(this).attr('name');
	//get the profile of this current user
	$.ajax({
		url: '/user',
		type: 'POST',
		data : {username: username},
		dataType: 'json'
	}).done(function(data){
		if(data.selected_user) {
			$('#username_header').html(data.selected_user.username + "'s Profile");
			$('#username').val(data.selected_user.username);
			$('#password').val(data.selected_user.password);
			$('#account_status_selection').val(data.selected_user.account_status);
			$('#privilege_selection').val(data.selected_user.privilege_level);
			selected_username = data.selected_user.username;
			selected_password = data.selected_user.password;
		}
	}).fail(function(){
		console.log('error on getting this user');
	});
});

$profileForm.validate({
	rules : {
		username: {
			required : true,
			minlength : 3,
			validUsername: true
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
		$.ajax({
			url:'/update-profile',
			type :'post',
			data:{username: $('#username').val(), password: $('#password').val(), account_status: $('#account_status_selection').val(), privilege_level: $('#privilege_selection').val(), old_username: selected_username},
			dataType : 'json'
		}).done(function(data){
			if(data.err_message) {
				$('#alert_bar').html(err_message);
				$('#alert_bar').show();
			} else {
				$('#profile_modal').modal('hide');
				getAllUsers();
			}
		}).fail(function(){
			console.log('error on updating users');
		});
		
	}
});

