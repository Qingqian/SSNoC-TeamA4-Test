module.exports = function(_, io, online_users) {

	io.on("connection",function(socket){
		socket.on('new online user', function(message){
			online_users[message.username] = message.user;
			socket.username = message.username;
			io.sockets.emit('add connection', {online_users: online_users});
		});

		socket.on('remove connection', function(data){
			delete online_users[data.username];
			io.sockets.emit('remove connection',{online_users: online_users});
		});

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

		//handle with the private messages
		socket.on('send private message', function(data){
			var source_user = data.source_user + "-source";
			io.sockets.emit(source_user,data);
			io.sockets.emit(data.target_user,data);
		});
		socket.on('send group message', function(data){
			var target_users = data.target_user;
			for(var i = 0; i < target_users.length; i++) {
				if(data.source_user == target_users[i]) {
					console.log("self");
					io.sockets.emit(target_users[i] + "-source",data);
				} else {
					console.log("others");
					io.sockets.emit(target_users[i],data);
				}
			}
		});	

		socket.on('memory testing', function(data){
			io.sockets.emit("not allowed testing",data);
		});	
		socket.on('stop memory testing', function(data){
			io.sockets.emit("allowed testing",data);
		});	

	});
}
