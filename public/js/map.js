var client_socket = io.connect();
var source_user = "";

var users;
var my_lat;
var my_lon;

client_socket.on('connect', function(){
	//get current source user
	$.ajax({
		url: '/user',
		type: 'GET',
		dataType: 'json'
	}).done(function(data){
		source_user = data.user.username;
		client_socket.username = source_user;
	}).fail(function(){
		console.log('error on getting current user');
	});
	//get previous group chat list
	$.ajax({
		url: '/users',
		type: 'GET',
		dataType: 'json'
	}).done(function(data){
		users = data;
	}).fail(function(){
		console.log('error on getting all previous group chat list');
	});
});

updateGPSLocation();

function updateGPSLocation(){
	//success
	navigator.geolocation.watchPosition(function(pos){
		my_lat = pos.coords.latitude;
		my_lon = pos.coords.longitude;
	}, 
	//error
	function(err){
		console.log("Error getting gps info");
		drawOnMap(users);
	},
	//options
	{
		  enableHighAccuracy: true,
		  timeout: 5000,
		  maximumAge: 0
	});
}

drawOnMap(users);
function drawOnMap(user_list) {
	//var map = document.getElementById("map_canvas");
	var map = $('#map_canvas')[0].getContext("2d");
	//var ctx = map.getContext("2d");
	//for (user in user_list){
	for (var i=0; i<100; i++){
	/*
		if ((user.lat != undefined) && (user.lon != undefined)){
			var dlat = user.lat - my_lat;
			var dlon = user.lon - my_lon;
			var x = dlon * 1800/150 + 150;
			var y = -1 * dlat * 3600/100 + 100;
			ctx.arc(x, y, 2, 0, 2 * Math.PI);
			var user_html = "<br><p>" + user.username + "<lat:" + user.lat + ", long:" + 
				user.lon + "></p>";
			$('#users').append(user_html);
		}*/
		x = Math.random() * 800;
		y = Math.random() * 800;
		map.arc(x, y, 20, 0, 2 * Math.PI);
	}
}
