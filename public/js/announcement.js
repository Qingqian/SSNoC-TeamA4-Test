var client_socket = io.connect();
var user = "";
client_socket.on('connect', function(){
	//get current user
	$.ajax({
		url: '/user',
		type: 'GET',
		dataType: 'json'
	}).done(function(data){
		user = data.user.username;
		client_socket.username = user;
	}).fail(function(){
		console.log('error on getting current user');
	});
	//get previous announcements
	$.ajax({
		url: '/all-announcements',
		type: 'GET',
		dataType: 'json'
	}).done(function(data){
		displayAnnouncements(data.announcements);
	}).fail(function(){
		console.log('error on getting all previous chat messages');
	});
});

var announcement_history = $('#announcements');

var announcement_html1 = '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">';
var announcement_html2 = '<small class="text-muted">'
var announcement_html3 = '</small></h3></div><div class="panel-body">';
var announcement_html4 = '</div></div>';

$('#post_announcement_btn').click(function(){
	var announcement_title = $('#announcement_title').val();
	var announcement_content = $('#announcement_content').val();
	var currentdate = new Date();
	var datetime = (currentdate.getMonth()+1)  + "/"
				+ currentdate.getDate()  + "/" 
				+ currentdate.getFullYear() + " @ "  
				+ currentdate.getHours() + ":"  
				+ currentdate.getMinutes() + ":" 
				+ currentdate.getSeconds();
	$('#announcement_title').val('');
	$('#announcement_content').val('');
	client_socket.emit('new announcement', {user: user, post_title: announcement_title, post_content: announcement_content, post_time: datetime});
	$.ajax({
		url: '/announcement',
		type:'POST',
		data: {post_title: announcement_title, post_content : announcement_content, post_time: datetime},
		dataType:'json'
	}).done(function(){
	}).fail(function(){
		console.log('error on posting announcement from client side');
	});

});

client_socket.on('new announcement',function(data){
	var announcement_html = announcement_html1 + data.post_title + announcement_html2 + data.post_time + announcement_html3 + 
							data.post_content + announcement_html4;
	announcement_history.append(announcement_html);
});

function displayAnnouncements(announcements) {
	for(var i=0;i<announcements.length;i++) {
		var announcement = announcements[i];
		var announcement_html = announcement_html1 + announcement.post_title + announcement_html2 + 
								announcement.post_time + announcement_html3 + announcement.post_content + 
								announcement_html4;
		announcement_history.prepend(announcement_html);
	}

}