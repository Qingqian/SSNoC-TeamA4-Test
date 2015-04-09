var stop_words = ["a","able","about","across","after","all","almost","also", "am","among","an","and","any","are","as","at","be","because","been",
			 "but","by","can","cannot","could","dear","did","do","does","either","else","ever","every","for","from","get","got","had",
			 "has","have","he","her", "hers","him","his","how","however","i","if","in","into","is","it","its","just","least","let","like",
			 "likely","may","me","might","most","must","my","neither","no","nor","not","of","off","often","on","only","or","other","our","own",
			 "rather","said","say","says","she","should","since","so","some","than","that","the","their","them","then","there","these","they",
			"this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which","while","who","whom","why","will","with","would","yet","you","your"];

var error_block = '<div class="alert alert-danger alert-dismissible" role="alert">\
  						<button type="button" class="close" data-dismiss="alert" aria-label="Close">\
  							<span aria-hidden="true">&times;</span></button>\
  						<strong>Warning!</strong> Please enter valid search word! </div>';

var result_heading = '<div class="panel panel-success">\
  							<div class="panel-heading">\
    							<h4 class="panel-title text-center">Directory</h4>\
    						</div>';
//form each message block
var message_html1 = '<div class="media panel-body">\
							<div class="media-left">\
								<a herf="#"><img src="/imgs/profile_image.png", height=50/></a></div>\
							<div class="media-body">\
								<h4 class="media-heading">';
var message_html2 = '<small class="text-muted pull-right">';
var message_html3 = '</small><br><p>';
var message_html4 = '</p></div></div>';

$('#search_btn').click(function(){
	var selection = $('#search_options').val();
	var content = $('#search_content').val().trim();
	if(content.length ==0) {
		$('#error').append(error_block);
	} else {
		$('#error').html('');
		if(selection == "username") {
			searchByUser(content,'/search-user');
		} else if(selection == "status") {
			searchByUser(content,'/search-status');
		} else if(selection == "public_message") {
			searchByPublicMessage(content);
		} else if(selection == "announcement") {
			searchByAnnouncement(content);
		} else if(selection == "private_message") {
			searchByPrivateMessage(content);
		}
	}
});

function searchByUser(search_content, url) {
	$.ajax({
		url: url,
		type: 'POST',
		data:{search_word:search_content},
		dataType: 'json'
	}).done(function(data){
		displayUsers(data.online_users,data.offline_users);
	}).fail(function(){
		console.log('error on getting all previous chat messages');
	});
}

function searchByPublicMessage(search_content) {
	var words = search_content.split(" ");
	var filter_words = [];
	for(var i=0;i<words.length;i++) {
		if(stop_words.indexOf(words[i]) == -1) {
			filter_words.push(words[i]);
		}
	}
	if(filter_words.length >0) {
		$.ajax({
			url: '/search-public-message',
			type: 'POST',
			data:{words:filter_words},
			dataType: 'json'
		}).done(function(data){
			displayMessages(data.public_messages);
		}).fail(function(){
			console.log('error on getting all previous chat messages');
		});
	} else {
		$('#result').html('');
		$('#error').html('');
		$('#error').append(error_block);
	}
}

function searchByAnnouncement(search_content) {
	var words = search_content.split(" ");
	var filter_words = [];
	for(var i=0;i<words.length;i++) {
		if(stop_words.indexOf(words[i]) == -1) {
			filter_words.push(words[i]);
		}
	}
	if(filter_words.length >0) {
		$.ajax({
			url: '/search-announcement',
			type: 'POST',
			data:{words:filter_words},
			dataType: 'json'
		}).done(function(data){
			displayAnnouncements(data.announcements);
		}).fail(function(){
			console.log('error on getting all previous chat messages');
		});
	} else {
		$('#result').html('');
		$('#error').html('');
		$('#error').append(error_block);
	}
}

function searchByPrivateMessage(search_content) {
	var words = search_content.split(" ");
	var filter_words = [];
	for(var i=0;i<words.length;i++) {
		if(stop_words.indexOf(words[i]) == -1) {
			filter_words.push(words[i]);
		}
	}
	if(filter_words.length >0) {
		$.ajax({
			url: '/search-private-message',
			type: 'POST',
			data:{words:filter_words},
			dataType: 'json'
		}).done(function(data){
			displayPrivateMessages(data.private_messages);
		}).fail(function(){
			console.log('error on getting all previous chat messages');
		});
	} else {
		$('#result').html('');
		$('#error').html('');
		$('#error').append(error_block);
	}
}

function displayUsers(online_users, offline_users) {
	$('#result').html('');
    $('#result').append(result_heading);
    online_users.sort();
	offline_users.sort();
	//display online users
	for(var i=0;i<online_users.length;i++) {
		var user_status =online_users[i].user_status;
		var status=getStatus(user_status);
		var photo = '<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3"><img src="../imgs/online.png" height=10/><br><img src="../imgs/profile_image.png" height=40/></div>';
		var username = '<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8"><strong>' + online_users[i].username + '</strong><br>' + status + '</div>';
		var personal_info = '<div class="panel-body user-row" id="' + online_users[i].username + '">' + photo + username + '</div>';
        $('#result').append(personal_info);
	}
	//dispaly offline users
	for(var i=0;i<offline_users.length;i++) {
		var user_status =offline_users[i].user_status;
		var status=getStatus(user_status);
		var photo = '<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3"><img src="../imgs/offline.png" height=10/><br><img src="../imgs/profile_image.png" height=40/></div>';
		var username = '<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8"><strong>' + offline_users[i].username + '</strong><br>' + status + '</div>';
		var personal_info = '<div class="panel-body user-row" id="' + offline_users[i].username + '">' + photo + username + '</div>';
        $('#result').append(personal_info);
	}
}

function displayMessages(messages) {
	messages.sort(comparator);
	$('#result').html('');
    $('#result').append(result_heading);
    displayPublicMessageHelper(messages);
}

function displayPublicMessageHelper(messages) {
	var length = messages.length >10 ? 10: messages.length;
	for(var i=0;i<length;i++) {
		var message = messages[i];
		var message_html = message_html1 + message.source_user + message_html2 + message.post_time + 
							message_html3 + message.message_text + message_html4;
		$('#result').append(message_html);
	}
	if(messages.length >10) {
		var button_block = '<div class="panel-body"><button class="btn btn-default btn-block" id="load_btn"> Load More...</div>';
		$('#result').append(button_block);
		$('#load_btn').click(function(){
			displayPublicMessageHelper(messages.splice(10, messages.length));
		});
	}
}

function displayPrivateMessages(messages) {
	messages.sort(comparator);
	$('#result').html('');
    $('#result').append(result_heading);
    displayPrivateMessageHelper(messages);
}

function displayPrivateMessageHelper(messages) {
	var length = messages.length >10 ? 10: messages.length;
	for(var i=0;i<length;i++) {
		var message = messages[i];
		var message_html = message_html1 + "<small>Target: </small>" + message.target_user + message_html2 + message.post_time + 
							message_html3 + message.message_text + message_html4;
		$('#result').append(message_html);
	}
	if(messages.length >10) {
		var button_block = '<div class="panel-body"><button class="btn btn-default btn-block" id="load_btn"> Load More...</div>';
		$('#result').append(button_block);
		$('#load_btn').click(function(){
			displayPrivateMessageHelper(messages.splice(10, messages.length));
		});
	}
}

function displayAnnouncements(announcements) {
	announcements.sort(comparator);
	$('#result').html('');
    $('#result').append(result_heading);

    for(var i=0;i<announcements.length;i++) {
		var announcement = announcements[i];
		var announcement_html = message_html1 + announcement.username + message_html2 + announcement.post_time + 
							message_html3 + announcement.post_content + message_html4;
		$('#result').append(announcement_html);
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

function comparator(a,b) {
	var time1 = a.post_time.split("@");
	var time2 = b.post_time.split("@");
	if(time1[0].trim() < time2[0].trim()) {
		return 1;
	} else if(time1[0].trim() > time2[0].trim()) {
		return -1;
	} else {
		if(time1[1].trim() < time2[1].trim()) {
			return 1;
		} else if(time1[1].trim() > time2[1].trim()) {
			return -1;
		} else {
			return 0;
		}
	}
}