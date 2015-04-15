var client_socket = io.connect();
var source_user = "";
var current_chatroom = "";
var current_members=[];
client_socket.on('connect', function(){
	//get current source user
	$.ajax({
		url: '/user',
		type: 'GET',
		dataType: 'json'
	}).done(function(data){
		source_user = data.user.username;
		client_socket.username = source_user;
	}).fail(function(){
		console.log('error on getting current user');
	});
	//get previous group chat list
	$.ajax({
		url: '/get-groupchat-list',
		type: 'GET',
		dataType: 'json'
	}).done(function(data){
		displayGroupChatList(data.groupchats);
	}).fail(function(){
		console.log('error on getting all previous group chat list');
	});
});

var message_html1 = '<li class="media">\
						<div class="media-left">\
							<a herf="#"><img src="/imgs/profile_image.png", height=50/></a></div>\
						<div class="media-body">\
							<h4 class="media-heading">';
var message_html2 = '<small class="text-muted pull-right">';
var message_html3 = '</small><br><p>';
var message_html4 = '</p></div></li>';


function displayGroupChatList(list) {
	$('#group_chat_list').html('');
	for(var i=0;i<list.length;i++) {
		var group = list[i];
		var option = new Option(group, group);
		$('#group_chat_list').append($(option));
	}
}

function displayGroupMessages(messages, chatname) {
	$('#chatTitle').html("Current chat room : " + chatname);
	$('#groupChatMessages').html('');

	for(var i=0;i<messages.length;i++) {
		var message = messages[i];
		var message_html = message_html1 + message.source_user + message_html2 + message.post_time + 
							message_html3 + message.message_text + message_html4;
		$('#groupChatMessages').append(message_html);
	}
}

function displayGroupMembers(members) {
	$('#members').html("Members : ");
	for(var i = 0; i < members.length; i++) {
		$('#members').append(members[i] + ", ");
	}
	$('#invited').html('');
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
	$('#invited').html(username + " invited.");
}
$('#create_group_chat').click(function(){
    var chatName = $('#new_group_chat').val();
    $('#new_group_chat').val('');
    //client_socket.emit('new group chat',chatName);
    //post message to public wall
    
    var username = source_user;
    $.ajax({
		url: '/new-group-chat',
		type: 'POST',
		data: {chatname: chatName, username: username},
		dataType: 'json'
	}).done(function(data){
		var name = data.chatname;
		var option = new Option(name, name);
		$('#group_chat_list').append($(option));
	}).fail(function(){
		console.log('error on creating new group chat');
	});

});

$('#sendGroupMessage').click(function(){
    var chatName = current_chatroom;
    var message = $('#postGroupMessage').val();

    $('#postGroupMessage').val(' ');
    var currentdate = new Date();
	var datetime = (currentdate.getMonth()+1)  + "/"
				+ currentdate.getDate()  + "/" 
				+ currentdate.getFullYear() + " @ "  
				+ currentdate.getHours() + ":"  
				+ currentdate.getMinutes() + ":" 
				+ currentdate.getSeconds();
    //client_socket.emit('new group message',{source_user:source_user, message_text: message, target_user: chatName, post_time: datetime});
    //post message to public wall
    $.ajax({
		url: '/new-group-message',
		type: 'POST',
		data: {source_user: source_user, message_text: message, target_user: chatName, post_time: datetime},
		dataType: 'json'
	}).done(function(data){
		var message = data.group_message;
		
		var message_html = message_html1 + message.source_user + message_html2 + message.post_time + 
							message_html3 + message.message_text + message_html4;
		$('#groupChatMessages').append(message_html);
		
		//console.log(message.message_text);
	}).fail(function(){
		console.log('error on creating new group chat');
	});

});

$('#invite').click(function(){
    
    var chatname = current_chatroom;
    var username = $('#invite_list :selected').val();
    //client_socket.emit('open group chat',chatname);
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
		console.log('error on creating new group chat');
	});
});

$('#open_group_chat').click(function(){
    
    var chatname = $('#group_chat_list :selected').val();
    current_chatroom = chatname;
    //client_socket.emit('open group chat',chatname);
    $.ajax({
		url: '/open-group-chat',
		type: 'POST',
		data: {chatname: chatname},
		dataType: 'json'
	}).done(function(data){
		displayGroupMessages(data.group_messages, data.chatname);
	}).fail(function(){
		console.log('error on creating new group chat');
	});

	$.ajax({
		url: '/get-members',
		type: 'POST',
		data: {chatname: current_chatroom},
		dataType: 'json'
	}).done(function(data){
		displayGroupMembers(data.members);
	}).fail(function(){
		console.log('error on creating new group chat');
	});

	$.ajax({
		url: '/get-invitelist',
		type: 'POST',
		data: {chatname: current_chatroom},
		dataType: 'json'
	}).done(function(data){
		displayInviteList(data.invitelist);
	}).fail(function(){
		console.log('error on creating new group chat');
	});
});
