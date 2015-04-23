var client_socket= io.connect();
client_socket.on('connect', function(){
	client_socket.username = username;
	client_socket.emit('remove connection',{username: username});
});