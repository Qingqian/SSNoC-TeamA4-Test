var client_socket = io.connect();
var session_id = "";

var online_list = $("#online_users");
var offline_list = $("#offline_users");

client_socket.on("connect", function(){
	session_id = client_socket.id;
	$.ajax({
		url: '/user_socket',
		type: 'GET',
		dataType: 'json'
	}).done(function(data){
		client_socket.emit('new user', {session_id: session_id, current_user: data.current_user, total_users: data.total_users});
	});
});

client_socket.on("add connection", function(message){
	updateDirectory(message.citizens);
});

function updateDirectory(citizens) {
	online_list.html('');
	offline_list.html('');
	var online_users = citizens.online;
	var total_users = citizens.total;
	//generate online user map, key is username ,value is the session id.
	var online_map = {};
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
		var status="Show status";
		switch(user_status) {
			case 'HELP': 
				status = '<br><img class="img-circle" src="../imgs/status_help.png" height=20/> Need Help!';
			case 'EMERGENCY':
				status = '<br><img class='img-circle' src='../imgs/status_emergency.png' height=20/> Emergency!";
			default:
				status = "<br><img class='img-circle' src='../imgs/status_ok.png' height=20/> I am OK!";
		}
		var photo = "<div class='col-xs-3 col-sm-2 col-md-1 col-lg-1'>\
						<img src='../imgs/online.png' height=10/><br/>\
						<img src='../imgs/profile_image.png' height=40/></div>";
		var username = "<div class='col-xs-8 col-sm-9 col-md-10 col-lg-10'><strong>" + online_usernames[i] + "</strong><br>" + status + "</div>";
		var dropdown_icon = session_id == online_map[online_usernames[i]].session ? "" : "<i class='glyphicon glyphicon-chevron-down text-muted'></i>"
		var personal_info = "<div class='row' id='" + online_usernames[i] + "'>" + photo + username + dropdown_icon + "</div>";
		var dropdown_info = "<div class='row'><button type='button' name='" + online_usernames[i]+"'" +
          						"class='btn btn-info col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xs-offset-3 col-sm-offset-3 col-md-offset-3 col-lg-offset-3'>Chat</button>";
		if(session_id == online_map[online_usernames[i]].session) {
			online_list.append(personal_info);
			console.log(personal_info);
		} else {
			online_list.append(personal_info);
			online_list.append(dropdown_info);
		}
	}
}

