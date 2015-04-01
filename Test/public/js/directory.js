var client_socket = io.connect();
var session_id = "";

client_socket.on("connect", function(){
	session_id = client_socket.id;
	$.ajax({
		url: '/users',
		type: 'GET',
		dataType: 'json'
	}).done(function(data){
		client_socket.emit('new user', {session_id: session_id, current_user: data.current_user, total_users: data.total_users});
	}).fail(function(){
		console.log('error on getting all users in the system');
	});
});

client_socket.on("add connection", function(message){
	updateDirectory(message.citizens);
});

client_socket.on('remove connection', function(message){
	updateDirectory(message.citizens);
});


function updateDirectory(citizens) {
	var online_list = $("#online_users");
	var offline_list = $("#offline_users");
	online_list.html('');
	offline_list.html('');
	var online_users = citizens.online;
	var total_users = citizens.total;
	//generate online user map, key is username ,value is the session id.
	var online_map = {};
	var offline = [];
	for(var session in online_users) {
		var username = online_users[session].username;
		var user_status = online_users[session].user_status;
		if(!(username in online_map) || session != online_map[username].session) {
			//put new username in map or update session in the map
			online_map[username] = {'session':session, 'user_status': user_status};
		}
	}
	var online_usernames = Object.keys(online_map).sort();
	//generate online html
	for(var i=0;i<online_usernames.length;i++) {
		var user_status =online_map[online_usernames[i]].user_status;
		var status=getStatus(user_status);
		var photo = '<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3"><img src="../imgs/online.png" height=10/><br><img src="../imgs/profile_image.png" height=40/></div>';
		var username = '<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8"><strong>' + online_usernames[i] + '</strong><br>' + status + '</div>';
		var dropdown_icon = session_id == online_map[online_usernames[i]].session ? "" : '<i class="glyphicon glyphicon-chevron-down text-muted"></i>';
		var dropdown = '<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1 dropdown-user" data=".' + online_usernames[i] + '">' + dropdown_icon + '</div>';
		var personal_info = '<div class="row user-row" id="' + online_usernames[i] + '">' + photo + username + dropdown + '</div>';
		var dropdown_info = '<div class="row dropdown-info ' + online_usernames[i]+ '"><button type="button" name="' + online_usernames[i]+'" ' +
          						'class="btn btn-success col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xs-offset-4 col-sm-offset-4 col-md-offset-4 col-lg-offset-4">Chat</button>' + 
          						'<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1"></div></div>';
		if(session_id == online_map[online_usernames[i]].session) {
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
			case 'EMERGENCY':
				status = '<br><img class="img-circle" src="../imgs/status_emergency.png" height=20/> Emergency!';
			default:
				status = '<br><img class="img-circle" src="../imgs/status_ok.png" height=20/> I am OK!';
		}
	return status;
} 

