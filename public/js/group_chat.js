var client_socket = io.connect();
var source_user = "";
var current_chatroom = "";
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


$('#open_group_chat').click(function(){
    
    var chatname = $('#group_chat_list :selected').val();
    current_chatroom = chatname;
    
    var form = $("<form method='post', action='/open-group-chat'></form>");
    var input_chatname = $("<input type='hidden', name='chatname'>");
    var input_source = $("<input type='hidden', name='source_user'>");
    
    input_chatname.val(chatname);
    input_source.val(source_user);
    form.append(input_chatname);
    form.append(input_source);
    form.submit();
});
