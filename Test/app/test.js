//entity class Message
function Message(citizen, message, timestamp) {
this.citizen=citizen;
this.message = message;
this.timestamp = timestamp;
}


//update the SSNoC directory
function updateDirectory(socket,online,offline) {
offline.push(socket.citizen);
online.splice(online.indexOf(socket.citizen),1);
}


io.sockets.on('connection', function(socket){
//load previous messages
socket.on('load messages', function(data){
socket.emit('show messages',publicMessages);
});
// Directory Request
socket.on("directory", function(data){
socket.emit('citizens', {online:onlineUsers, offline:offlineUsers});
});

// Handle User Registration
socket.on('new user', function(data, callback){
var index = checkUser(citizens, data.username);
if(index === -2) {
callback(2);
} else if(index === -1) {
//create new citizen
var hash = getHash(data.password);
var citizen = new Citizen(data.username, hash);
socket.citizen = citizen;
onlineUsers.push(socket.citizen);
citizens.push(socket.citizen);
queryUser(data.username, function(present){
if (!present)
addNewUser(data.username, hash);
});
io.sockets.emit('citizens', {online:onlineUsers, offline:offlineUsers});
callback(0);
} else {
//getPassword(data.username, function(oldHash) {
var oldHash = citizens[index].password;
var isValid = isValidPassword(data.password,oldHash);
if(isValid) {
callback(3);
var citizen = citizens[index];
socket.citizen = citizen;
updateDirectory(socket,offlineUsers,onlineUsers);
io.sockets.emit('citizens',{online:onlineUsers, offline:offlineUsers});
} else {
callback(1);
}
//});
}
});
// Login Request
socket.on("login", function(data, callback) {
var index = checkUser(citizens, data.username);
if(index === -2 || index === -1) {
callback(2);
} else {
//getPassword(data.username, function(oldHash) {
var oldHash = citizens[index].password;
var isValid = isValidPassword(data.password,oldHash);
if(isValid) {
callback(3);
var citizen = citizens[index];
socket.citizen = citizen;
updateDirectory(socket,offlineUsers,onlineUsers);
io.sockets.emit('citizens',{online:onlineUsers, offline:offlineUsers});
} else {
callback(1);
}
//});
}
});

//get messages from client side
socket.on('send message', function(data){
var time = moment();
    var timestamp = time.format('HH:mmA ');
    var message = new Message(socket.citizen, data, timestamp);
    publicMessages.push(message);
    addNewMsg(socket.citizen + timestamp + ": " + data);
if(publicMessages.length >3) {
    publicMessages.splice(0,publicMessages.length-3);
    }
console.log("New mesage!" + socket.citizen);
        io.sockets.emit('new message',message);
});

// listen to logout event
socket.on('logout',function(data){
if(!socket.citizen)
return;
updateDirectory(socket,onlineUsers,offlineUsers);
io.sockets.emit('citizens',{online:onlineUsers, offline:offlineUsers});
});

//listen to disconnect event
socket.on('disconnect', function(data){
if(!socket.citizen)
return;
if(onlineUsers.indexOf(socket.citizen) !=-1) {
onlineUsers.splice(onlineUsers.indexOf(socket.citizen),1);
}
if(offlineUsers.indexOf(socket.citizen) == -1) {
offlineUsers.push(socket.citizen);
}
io.sockets.emit('citizens',{online:onlineUsers, offline:offlineUsers});
});

});