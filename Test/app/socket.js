module.exports = function(_, io, citizens) {

	io.on("connection",function(socket){
		//console.log('a user connected to server.');
		socket.on('new user', function(message){
			citizens.online[message.session_id] = {'username': message.current_user.username,'user_status': message.current_user.user_status};
			citizens.total = message.total_users;
			//console.log(citizens);
			io.sockets.emit('add connection', {citizens: citizens});
		});

		socket.on('disconnect', function(){
			//console.log(socket.id)
			delete citizens.online[socket.id];
			io.sockets.emit('remove connection',{id:socket.id, citizens: citizens});
		});
		//broadcast message to all users
		socket.on('new public message', function(data){
			io.sockets.emit('new public message', data);
		});

	});
}