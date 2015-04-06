module.exports = function(_, io, online_users) {

	io.on("connection",function(socket){
		socket.on('new online user', function(message){
			online_users[message.username] = message.user;
			socket.username = message.username;
			io.sockets.emit('add connection', {online_users: online_users});
		});

		// socket.on('disconnect', function(){
		// 	console.log('socket server side' +socket.username);
		// 	delete online_users[socket.username];
		// 	io.sockets.emit('remove connection',{online_users: online_users});
		// });

		//broadcast message to all users
		socket.on('new public message', function(data){
			io.sockets.emit('new public message', data);
		});
		//broadcast announcements to all users
		socket.on('new announcement', function(data){
			io.sockets.emit('new announcement', data);
		});
		//broadcast new status to all users
		socket.on('change status', function(data){
			online_users[data.username] = {username: data.username, user_status : data.user_status, change_status_time: data.change_status_time};
			io.sockets.emit('change status', {online_users: online_users, user_info: data});
		});

	});
}