var client_socket = io.connect();
var username;
var gps_lat;
var gps_lon;
var gps_enabled;

client_socket.on('connect', function(){
	 $.ajax({
	 	url:'/gps',
	 	type:'GET',
		dataType:'json'
	 }).done(function(data){
	 	username = data.user_info.username;
	 	client_socket.username = username;
	 	var user_info = data.user_info;
	 }).fail(function(data){
	 	console.log('Error on getting gps');
	 });
});

function updateGPSLocation(){
	if (!gps_enabled) return;
	//success
	navigator.geolocation.watchPosition(function(pos){
		gps_lat = Math.round(10000 * pos.coords.latitude) / 10000;
		gps_lon = Math.round(10000 * pos.coords.longitude) / 10000;
		$('#gps_coords').html('latitude:' + gps_lat + '  ' + 'longitude:' + gps_lon);
	}, 
	//error
	function(err){
		$('#gps_coords').html('failed to get gps location');
		console.log("Error getting gps info");
		var gps_loc_block = $('#gps_coords');
		gps_loc_block.append('gps is not working');
	},
	//options
	{
		  enableHighAccuracy: true,
		  timeout: 5000,
		  maximumAge: 0
	});
}

$("#enable_gps").click(function(){
	if (gps_enabled){
		navigator.geolocation.clearWatch();
	}
	else {
		updateGPSLocation();
	}
	gps_enabled = !gps_enabled;
});


$("#update_gps_btn").click(function(){
	updateGPSLocation();
	$.ajax({
		url: '/gps',
		type:'POST',
		data: {lat:gps_lat, lon:gps_lon, gps_enabled: true},
		dataType:'json'
	}).done(function(data){
	}).fail(function(){
		console.log('error on changing user status');
	});
});
