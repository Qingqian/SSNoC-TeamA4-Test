var client_socket = io.connect();
var username;

// other user info
var user_info = {username:undefined, lat:undefined, lon:undefined, gps_enabled:undefined};
/*var other_username;
var other_lat;
var other_lon;
var other_gps_enabled;
*/
var gps_lat;
var gps_lon;
var gps_enabled;

client_socket.on('connect', function(){
	 $.ajax({
	 	url:'/compass-user',
	 	type:'POST',
		data:{source_user:source_user, target_user:target_user},
		dataType:'json'
	 }).done(function(data){
	 	client_socket.username = username;
	 	var username = data.username;
		user_info.lat = data.lat;
		user_info.lon = data.lon;
		user_info.gps_enabled = data.gps_enabled;
		console.log(data);
	 }).fail(function(data){
	 	console.log('Error getting compass page');
	 });
});
		
$('#distance_info').html('Collecting GPS data...');

updateGPSLocation();

/* lat/long distance calculation code courtesy of geodatasource.com */
function distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
		var radlat2 = Math.PI * lat2/180
		var radlon1 = Math.PI * lon1/180
		var radlon2 = Math.PI * lon2/180
		var theta = lon1-lon2
		var radtheta = Math.PI * theta/180
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
		dist = dist * 180/Math.PI
		dist = dist * 60 * 1.1515
		if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}     

function angle(lat1, lon1, lat2, lon2){
	var dlon = lon2 - lon1;
	var dlat = lat2 - lat1;
	var ang = Math.atan(dlat/dlon);
	if (dlon < 0)
		ang = (ang - 270) * (-1);
	else
		ang = (ang - 90) * (-1);
	return ang;
}

function updateGPSLocation(){
	//success
	navigator.geolocation.watchPosition(function(pos){
		gps_lat = Math.round(10000 * pos.coords.latitude) / 10000;
		gps_lon = Math.round(10000 * pos.coords.longitude) / 10000;
		var dist = distance(gps_lat, gps_lon, user_info.lat, user_info.lon, "K")/1000;
		var rel_angle = angle(gps_lat, gps_lon, user_info.lat, user_info.lon);
		rel_angle = Math.round(rel_angle * 100)/100;
		var comp_direction;
		/* get angle into 0 to 360 range */
		while (rel_angle < 0){
			rel_angle += 360;
		}
		if (rel_angle < 22.5) comp_direction = "North";
		else if (rel_angle < 67.5) comp_direction = "North-East";
		else if (rel_angle < 112.5) comp_direction = "East";
		else if (rel_angle < 157.5) comp_direction = "South-East";
		else if (rel_angle < 202.5) comp_direction = "South";
		else if (rel_angle < 247.5) comp_direction = "South-West";
		else if (rel_angle < 292.5) comp_direction = "West";
		else if (rel_angle < 337.5) comp_direction = "North-West";
		else comp_direction = "North";

		console.log("angle : " + rel_angle);
		$('#compass').rotate({animateTo: rel_angle + 90});
		dist = Math.round(dist * 100)/100;
		$('#distance_info').html('User: ' + target_user + ' distance = ' + dist + 
			'meters\ndirecton: ' + rel_angle + " degrees (" + comp_direction + ")");
	 $.ajax({
	 	url:'/gps',
	 	type:'POST',
		data:{username:username, lat:gps_lat, lon:gps_lon, gps_enabled:true},
		dataType:'json'
	 }).done(function(data){
		console.log(data);
	 }).fail(function(data){
	 	console.log('Error setting compass');
	 });
	}, 
	//error
	function(err){
		console.log("Error getting gps info");
	},
	//options
	{
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	});
}
