var client_socket = io.connect();
var source_user_self = source_user + "-source";
client_socket.on('connect', function(){
	//get previous private messages
	$.ajax({
		url: '/private-history',
		type: 'POST',
		data:{source_user:source_user, target_user:target_user},
		dataType: 'json'
	}).done(function(data){
		displayPrivateMessages(data.source_private_messages,data.target_private_messages);
	}).fail(function(){
		console.log('error on getting all previous chat messages');
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

function displayPrivateMessages(source_private_messages, target_private_messages) {
	$('#private_messages').html('');
	var private_message_blocks = [];
	for(var i=0;i<source_private_messages.length;i++) {
		private_message_blocks.push(source_private_messages[i]);
	}
	for(var i=0;i<target_private_messages.length;i++) {
		private_message_blocks.push(target_private_messages[i]);
	}
	private_message_blocks.sort(comparator);
	for(var i=0;i<private_message_blocks.length;i++) {
		var private_message = private_message_blocks[i];
		var message_html;
		if(private_message.source_user == source_user) {
			message_html = message_self_html1 + source_user + message_self_html2 + private_message.post_time + message_self_html3 +
								private_message.message_text + message_self_html4;
		} else {
			message_html = message_target_html1 + target_user + message_target_html2 + private_message.post_time + message_target_html3 +
							private_message.message_text + message_target_html4;
		}
		$('#private_messages').append(message_html);
	}
	
}
//current user is receiving private messages from others
client_socket.on(source_user, function(message){
	var private_message_html = message_target_html1 + target_user + message_target_html2 + message.post_time + message_target_html3 + 
								message.message_text + message_target_html4;
	$('#private_messages').append(private_message_html);
});
//current user is receiving private messages from himself
client_socket.on(source_user_self, function(message){
	var private_message_html = message_self_html1 + source_user + message_self_html2 + message.post_time + message_self_html3 + 
								message.message_text + message_self_html4;
	$('#private_messages').append(private_message_html);
});

$('#send_private_message_btn').click(function(){
	var message_text = $('#private_message_content').val();
	var currentdate = new Date();
	var datetime = (currentdate.getMonth()+1)  + "/"
				+ currentdate.getDate()  + "/" 
				+ currentdate.getFullYear() + " @ "  
				+ currentdate.getHours() + ":"  
				+ currentdate.getMinutes() + ":" 
				+ currentdate.getSeconds();
	$('#private_message_content').val('');
	client_socket.emit('send private message',{source_user: source_user, target_user: target_user, message_text: message_text, post_time: datetime});
	//post message to target user
    $.ajax({
		url: '/private-message',
		type: 'POST',
		data: {source_user:source_user, target_user: target_user, message_text: message_text, post_time: datetime},
		dataType: 'json'
	}).done(function(){
		//console.log('success on posting private message');
	}).fail(function(){
		console.log('error on posting this message');
	});
});
