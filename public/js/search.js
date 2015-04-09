$('#search_btn').click(function(){
	var selection = $('#search_options').val();
	var content = $('#search_content').val();
	if(content.length ==0) {
		var block = '<div class="alert alert-danger alert-dismissible" role="alert">\
  						<button type="button" class="close" data-dismiss="alert" aria-label="Close">\
  							<span aria-hidden="true">&times;</span></button>\
  						<strong>Warning!</strong> Please enter valid search word! </div>';
		$('#error').append(block);
	} else {
		$('#error').html('');
		if(selection == "username") {
			searchByUsername(content);
		} else if(selection == "status") {
			searchByStatus(content);
		} else if(selection == "public_message") {

		} else if(selection == "announcement") {

		} else if(selection == "private_message") {

		}
	}
});

function searchByUsername(search_content) {
	$.ajax({
		url: '/search-user',
		type: 'POST',
		data:{username:search_content},
		dataType: 'json'
	}).done(function(data){
		displayUsers(data.online_users,data.offline_users);
	}).fail(function(){
		console.log('error on getting all previous chat messages');
	});
}

function searchByStatus(search_content) {
	$.ajax({
		url: '/search-status',
		type: 'POST',
		data:{user_status:search_content},
		dataType: 'json'
	}).done(function(data){
		displayUsers(data.online_users,data.offline_users);
	}).fail(function(){
		console.log('error on getting all previous chat messages');
	});
}

function displayUsers(online_users, offline_users) {
	$('#result').html('');
	//display online users
	for(var i=0;i<online_users.length;i++) {
		var user_status =online_users[i].user_status;
		var status=getStatus(user_status);
		var photo = '<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3"><img src="../imgs/online.png" height=10/><br><img src="../imgs/profile_image.png" height=40/></div>';
		var username = '<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8"><strong>' + online_users[i].username + '</strong><br>' + status + '</div>';
		var personal_info = '<div class="row user-row" id="' + online_users[i].username + '">' + photo + username + '</div>';
        $('#result').append(personal_info);
	}
	//dispaly offline users
	for(var i=0;i<offline_users.length;i++) {
		var user_status =offline_users[i].user_status;
		var status=getStatus(user_status);
		var photo = '<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3"><img src="../imgs/offline.png" height=10/><br><img src="../imgs/profile_image.png" height=40/></div>';
		var username = '<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8"><strong>' + offline_users[i].username + '</strong><br>' + status + '</div>';
		var personal_info = '<div class="row user-row" id="' + offline_users[i].username + '">' + photo + username + '</div>';
        $('#result').append(personal_info);
	}
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