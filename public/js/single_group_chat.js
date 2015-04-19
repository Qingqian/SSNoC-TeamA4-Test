var client_socket = io.connect();
var source_user_self = source_user + "-source";
var current_members;
client_socket.on('connect', function(){
	//get previous group messages
	$.ajax({
		url: '/group-history',
		type: 'POST',
		data: {chatname: chatname},
		dataType: 'json'
	}).done(function(data){
		displayGroupMessages(data.group_messages,chatname);
	}).fail(function(){
		console.log('error on getting all previous chat messages');
	});
	
	//get list of group members
	$.ajax({
		url: '/get-members',
		type: 'POST',
		data: {chatname: chatname},
		dataType: 'json'
	}).done(function(data){
		displayGroupMembers(data.members);
	}).fail(function(){
		console.log('error on getting members');
	});
	
	$.ajax({
		url: '/get-invitelist',
		type: 'POST',
		data: {chatname: chatname},
		dataType: 'json'
	}).done(function(data){
		displayInviteList(data.invitelist);
	}).fail(function(){
		console.log('error on getting members');
	});
	
});



//form self message block
var message_self_html1 = '<li class="media"><div class="media-body">\
							<div class="media-body">\
								<h4 class="media-heading pull-right">';
var message_self_html2 = '<small class="text-muted">';
var message_self_html3 = '</small><br><p>';
var message_self_html4 = '</p></div>\
								<div class="media-right"><a href="#" class="pull-right"><img src="/imgs/profile_image.png" height=50/></a>\
								</div></div></li>';

//form target message block
var message_target_html1 = '<li class="media"><div class="media-left"><a herf="#" class="pull-left">\
							<img src="/imgs/profile_image.png", height=50/></a></div></div>\
							<div class="media-body">\
								<h4 class="media-heading">';
var message_target_html2 = '<small class="text-muted">';
var message_target_html3 = '</small><br><p>';
var message_target_html4 = '</p></div></li>';

function comparator(a,b) {
	var time1 = a.post_time.split("@");
	var time2 = b.post_time.split("@");
	if(time1[0].trim() < time2[0].trim()) {
		return -1;
	} else if(time1[0].trim() > time2[0].trim()) {
		return 1;
	} else {
		if(time1[1].trim() < time2[1].trim()) {
			return -1;
		} else if(time1[1].trim() > time2[1].trim()) {
			return 1;
		} else {
			return 0;
		}
	}
}
function displayInviteList(list) {
	$('#invite_list').html('');
	for(var i = 0; i < list.length; i++) {
		var user = list[i];
		var option = new Option(user, user);
		$('#invite_list').append($(option));
	}
}

function displayInvited(username) {
	$('#invited').html(username+" was just invited!!");
}
function displayGroupMembers(members) {
	$('#members').html("Members : ");
	for(var i = 0; i < members.length; i++) {
		$('#members').append(members[i] +", ");
	}
	current_members = members;
}


function displayGroupMessages(messages, chatname) {
	$('#group_messages').html('');
	$('#roomTitle').html(chatname);

	for(var i=0;i<messages.length;i++) {
		var group_message = messages[i];
		var message_html;
		if(group_message.source_user == source_user) {
			message_html = message_self_html1 + source_user + message_self_html2 + group_message.post_time + message_self_html3 +
								group_message.message_text + message_self_html4;
		} else {
			message_html = message_target_html1 + group_message.source_user + message_target_html2 + group_message.post_time + message_target_html3 +
							group_message.message_text + message_target_html4;
		}
		$('#group_messages').append(message_html);
	}
	
}

//current user is receiving group messages from others
client_socket.on(source_user, function(message){
	var group_message_html = "";
		console.log("from others");
	group_message_html = message_target_html1 + message.source_user + " " + message_target_html2 + message.post_time + message_target_html3 + 
							message.message_text + message_target_html4;
	$('#group_messages').append(group_message_html);
});

//current user is receiving group messages from himself
client_socket.on(source_user_self, function(message){
	var group_message_html = "";
	console.log("from himself");
	group_message_html = message_self_html1 + source_user + " " + message_self_html2 + message.post_time + message_self_html3 + 
							message.message_text + message_self_html4;
	$('#group_messages').append(group_message_html);
});

$('#invite').click(function() {
	var username = $('#invite_list :selected').val();
	
	$.ajax({
		url: '/invite',
		type: 'POST',
		data: {chatname: chatname, username: username},
		dataType: 'json'
	}).done(function(data){
		displayInvited(data.newGuest.guest_name);
		$('#members').append(" " + data.newGuest.guest_name);
		$('#invite_list option:selected').remove();
	}).fail(function(){
		console.log('error on getting members');
	});
	
});
$('#send_group_message_btn').click(function(){
	var message_text = $('#group_message_content').val();
	var currentdate = new Date();
	var datetime = (currentdate.getMonth()+1)  + "/"
				+ currentdate.getDate()  + "/" 
				+ currentdate.getFullYear() + " @ "  
				+ currentdate.getHours() + ":"  
				+ currentdate.getMinutes() + ":" 
				+ currentdate.getSeconds();
	$('#group_message_content').val('');
	client_socket.emit('send group message',{source_user: source_user, target_user: current_members, message_text: message_text, post_time: datetime});
	//post message to target user
    $.ajax({
		url: '/new-group-message',
		type: 'POST',
		data: {source_user:source_user, target_user: chatname, message_text: message_text, post_time: datetime},
		dataType: 'json'
	}).done(function(data){
		//console.log('success on posting private message');
	}).fail(function(){
		console.log('error on posting this message');
	});
});
