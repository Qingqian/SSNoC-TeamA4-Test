var client_socket= io.connect();
var username;

client_socket.on('connect', function(){
	 $.ajax({
	 	url:'/user',
	 	type:'GET',
		dataType:'json'
	 }).done(function(data){
	 	username = data.user.username;
	 	client_socket.username = username;
	 	client_socket.emit('remove connection',{username: username});
	 }).fail(function(data){
	 	console.log('Error on getting current user');
	 });
});