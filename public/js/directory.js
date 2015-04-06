var client_socket = io.connect();
var total_users;
var current_username;

client_socket.on("connect", function(){
	//get all users in the system
	$.ajax({
		url: '/users',
		type: 'GET',
		dataType: 'json'
	}).done(function(data){
		total_users = data.total_users;
	}).fail(function(){
		console.log('error on getting all users in the system');
	});
	//get current user
	$.ajax({
		url : '/user',
		type:'GET',
		dataType:'json'
	}).done(function(data){
		current_username = data.user.username;
		client_socket.username = current_username;
		client_socket.emit('new online user',{username: current_username, user: data.user});
	}).fail(function(data){
		console.log('Error on getting current user');
	});

});

client_socket.on("add connection", function(message){
	updateDirectory(message.online_users);
});

client_socket.on('remove connection', function(message){
	updateDirectory(message.online_users);
});

client_socket.on('change status', function(message){
	updateDirectory(message.online_users);
});


function updateDirectory(online_users) {
	var online_list = $("#online_users");
	var offline_list = $("#offline_users");
	online_list.html('');
	offline_list.html('');
	var offline = [];
	var online_usernames = Object.keys(online_users).sort();
	//generate online html
	for(var i=0;i<online_usernames.length;i++) {
		var user_status =online_users[online_usernames[i]].user_status;
		var status=getStatus(user_status);
		var photo = '<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3"><img src="../imgs/online.png" height=10/><br><img src="../imgs/profile_image.png" height=40/></div>';
		var username = '<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8"><strong>' + online_usernames[i] + '</strong><br>' + status + '</div>';
		var dropdown_icon = current_username == online_usernames[i] ? "" : '<i class="glyphicon glyphicon-chevron-down text-muted"></i>';
		var dropdown = '<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1 dropdown-user" data=".' + online_usernames[i] + '">' + dropdown_icon + '</div>';
		var personal_info = '<div class="row user-row" id="' + online_usernames[i] + '">' + photo + username + dropdown + '</div>';
		var dropdown_info = '<div class="row dropdown-info ' + online_usernames[i]+ '"><button type="button" name="' + online_usernames[i]+'" ' +
          						'class="btn btn-success col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xs-offset-4 col-sm-offset-4 col-md-offset-4 col-lg-offset-4">Chat</button>' + 
          						'<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1"></div></div>';
		if(current_username == online_usernames[i]) {
			online_list.append(personal_info);
		} else {
			online_list.append(personal_info);
			online_list.append(dropdown_info);
		}
	}

	//generate offline users
	for(var i=0;i<total_users.length;i++) {
		if(online_usernames.indexOf(total_users[i].username) == -1) {
			offline.push(total_users[i]);
		}
	}
	for(var i=0;i<offline.length;i++) {
		var user_status =offline[i].user_status;
		var status=getStatus(user_status);
		var photo = '<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3"><img src="../imgs/offline.png" height=10/><br><img src="../imgs/profile_image.png" height=40/></div>';
		var username = '<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8"><strong>' + offline[i].username + '</strong><br>' + status + '</div>';
		var dropdown_icon = '<i class="glyphicon glyphicon-chevron-down text-muted"></i>';
		var dropdown = '<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1 dropdown-user" data=".' + offline[i].username + '">' + dropdown_icon + '</div>';
		var personal_info = '<div class="row user-row" id="' + offline[i].username + '">' + photo + username + dropdown + '</div>';
		var dropdown_info = '<div class="row dropdown-info ' + offline[i].username + '"><button type="button" name="' + offline[i].username+'" ' +
          						'class="btn btn-success col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xs-offset-4 col-sm-offset-4 col-md-offset-4 col-lg-offset-4">Chat</button>' + 
          						'<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1"></div></div>';
        offline_list.append(personal_info);
        offline_list.append(dropdown_info);
	}
	//clickable on dropdown and pushup
	$('.dropdown-info').hide();
    $('.dropdown-user').click(function() {
    	var username = $(this).attr('data');
    	var icon = $(this);
    	$(username).slideToggle("slow", function(){
    		if($(username).is(":visible")) {
    			icon.html('<i class="glyphicon glyphicon-chevron-up text-muted"></i>')
    		} else {
    			icon.html('<i class="glyphicon glyphicon-chevron-down text-muted"></i>')
    		}
    	});
    });
}

function getStatus(user_status) {
	var status="Show status";
		switch(user_status) {
			case 'HELP': 
				status = '<br><img class="img-circle" src="../imgs/status_help.png" height=20/> Need Help!';
				break;
			case 'EMERGENCY':
				status = '<br><img class="img-circle" src="../imgs/status_emergency.png" height=20/> Emergency!';
				break;
			default:
				status = '<br><img class="img-circle" src="../imgs/status_ok.png" height=20/> I am OK!';
		}

	return status;
} 

