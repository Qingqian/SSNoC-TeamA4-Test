var client_socket = io.connect();
var username;

client_socket.on('connect', function(){
	 $.ajax({
	 	url:'/status',
	 	type:'GET',
		dataType:'json'
	 }).done(function(data){
	 	username = data.user_info.username;
	 	client_socket.username = username;
	 	var user_info = data.user_info;
	 	updateUserStatus(user_info);
	 }).fail(function(data){
	 	console.log('Error on getting current user');
	 });
});

function updateUserStatus(data) {
	$('#status_information').html('');
	var status_block = $('#status_information');
	var user_status = data.user_status;
	var change_status_time = data.change_status_time;

	var status_html1 = '<strong>';
	var status_html2 = '</strong>';
	var status_html3 = getStatus(user_status);
	var status_html4 = '<p> Posted Time: ';
	var status_html5 = '</p>';

	var status_html = status_html1 + username + status_html2 + status_html3 + status_html4 + change_status_time + status_html5;
	status_block.append(status_html);

}

function getStatus(user_status) {
	var status;
	switch(user_status) {
		case 'HELP': 
			status = '<br><img class="img-circle" src="../imgs/status_help.png" height=20><strong> Need Help!</strong><br>';
			break;
		case 'EMERGENCY':
			status = '<br><img class="img-circle" src="../imgs/status_emergency.png" height=20><strong> Emergency!</strong><br>';
			break;
		default:
			status = '<br><img class="img-circle" src="../imgs/status_ok.png" height=20><strong> I am OK!</strong><br>';
	}

	return status;
} 

client_socket.on('change status', function(data){
	updateUserStatus(data.user_info);
});

$("#change_status_btn").click(function(){
	var selection = $('#status_options').val();
	var currentdate = new Date();
	var datetime = currentdate.getDate() + "/"
				+ (currentdate.getMonth()+1)  + "/" 
				+ currentdate.getFullYear() + " @ "  
				+ currentdate.getHours() + ":"  
				+ currentdate.getMinutes() + ":" 
				+ currentdate.getSeconds();
	client_socket.emit('change status',{username: username, user_status : selection, change_status_time: datetime});
	$.ajax({
		url: '/share-status',
		type:'POST',
		data: {user_status: selection, change_status_time : datetime},
		dataType:'json'
	}).done(function(data){
	}).fail(function(){
		console.log('error on changing user status');
	});
});
