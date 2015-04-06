var client_socket = io.connect();

client_socket.on('connect', function(){
	 $.ajax({
	 	url:'/user',
	 	type:'GET',
		dataType:'json'
	 }).done(function(data){
	 	var username = data.user.username;
	 	client_socket.username = username;
	 	console.log('signup emit new online user' + username);
	 	client_socket.emit('new online user',{username: username, current_user: data.user});
	 }).fail(function(data){
	 	console.log('Error on getting current user');
	 });
});
