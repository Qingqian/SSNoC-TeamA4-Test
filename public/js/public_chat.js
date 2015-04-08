var client_socket = io.connect();
var source_user = "";
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
	//get previous public messages
	$.ajax({
		url: '/get-public-messages',
		type: 'GET',
		dataType: 'json'
	}).done(function(data){
		displayPublicMessages(data.public_messages);
	}).fail(function(){
		console.log('error on getting all previous chat messages');
	});
});

var public_history = $('#publicMessages');
var post_message = $('#postPublicMessage');
var send_button = $('#sendPublicMessage');

//form each message block
var message_html1 = '<li class="media">\
						<div class="media-left">\
							<a herf="#"><img src="/imgs/profile_image.png", height=50/></a></div>\
						<div class="media-body">\
							<h4 class="media-heading">';
var message_html2 = '<small class="text-muted pull-right">';
var message_html3 = '</small><br><p>';
var message_html4 = '</p></div></li>';

//receive broadcast messages
client_socket.on('new public message', function(message){
	var message_html = message_html1 + message.source_user + message_html2 + message.post_time + 
							message_html3 + message.message_text + message_html4;
	public_history.append(message_html);
});

function displayPublicMessages(public_messages) {
	for(var i=0;i<public_messages.length;i++) {
		var message = public_messages[i];
		var message_html = message_html1 + message.source_user + message_html2 + message.post_time + 
							message_html3 + message.message_text + message_html4;
		public_history.prepend(message_html);
	}
}

send_button.click(function(){
	var currentdate = new Date();
	var datetime = (currentdate.getMonth()+1)  + "/"
				+ currentdate.getDate()  + "/" 
				+ currentdate.getFullYear() + " @ "  
				+ currentdate.getHours() + ":"  
				+ currentdate.getMinutes() + ":" 
				+ currentdate.getSeconds();
    var message = post_message.val();
    post_message.val('');
    client_socket.emit('new public message',{source_user:source_user, message_text: message, post_time: datetime});
    //post message to public wall
    $.ajax({
		url: '/post-public-message',
		type: 'POST',
		data: {source_user:source_user, message_text: message, post_time: datetime},
		dataType: 'json'
	}).done(function(){
		//console.log('success on posting public message');
	}).fail(function(){
		console.log('error on posting this message');
	});

});

