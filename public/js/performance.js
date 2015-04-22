var client_socket = io.connect();

$('#alert_bar').hide();
$('#spinner').hide();
$('#total_posts').html(0);
$('#post_per_sec').html(0);
$('#total_gets').html(0);
$('#get_per_sec').html(0);

var on_test = false;
var post_request_count = 0;
var get_request_count=0;
var temp_time;
var test_start_time;
var real_test_time;
var source_user;
var test_duration;
var finish_time;
var timeout;

client_socket.on('connect', function(){
	//get current source user
	$.ajax({
		url: '/user',
		type: 'GET',
		dataType: 'json'
	}).done(function(data){
		source_user = data.user.username;
	}).fail(function(){
		console.log('error on getting current user');
	});
});

//tests whether entered value is an integer
function isInt(value) {
	return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
}

$('#btn_start').click(function(){
	test_duration = $('#test_duration').val();
	if(!isInt(test_duration)) {
		$('#alert_bar').show();
		$('#alert_bar').html('Please enter a valid time duration');
	} else {
		var loading_block = '<div class="text-center"><img src="../../imgs/spinner.gif" alt ="Calculating" label="Calculating..." height=30></div>';
		$('#total_posts').html(loading_block);
		$('#post_per_sec').html(loading_block);
		$('#total_gets').html(loading_block);
		$('#get_per_sec').html(loading_block);
		if(parseInt(test_duration) >5) {
			$('#alert_bar').show();
			$('#alert_bar').html('Due to test Duration Tolerance Rule, the system only tests the application performance for 5 seconds');
			test_duration = 5;
		} else {
			$('#alert_bar').hide();
			$('#spinner').show();
			test_duration = parseInt(test_duration);
		}
		on_test = true;
		post_request_count = 0;
		get_request_count=0;
		//time variables
		test_duration = test_duration*1000;
		test_start_time = new Date().getTime();
		finish_time = test_start_time + test_duration;

		post_request(finish_time);
		get_request(finish_time);
	}
	$('#test_duration').val('');
});

function post_request(finish_time) {
	var current_time = new Date().getTime();
	if(current_time >= finish_time) {
		on_test = false;
		finish_test(true);
		return;
	}
	if(post_request_count >=1000) {
		$('#alert_bar').html('Tests run out of memory');
		$('#spinner').hide();
		finish_test(false);
		return;
	}
	if(!on_test) {
		$('#alert_bar').html('Testing is stopped already.');
		$('#spinner').hide();
		finish_test(false);
	} else {
		var currentdate = new Date();
		var datetime = (currentdate.getMonth()+1)  + "/"
					+ currentdate.getDate()  + "/" 
					+ currentdate.getFullYear() + " @ "  
					+ currentdate.getHours() + ":"  
					+ currentdate.getMinutes() + ":" 
					+ currentdate.getSeconds();
		//post request
		$.ajax({
			url: '/post-test-message',
			type: 'POST',
			data: {source_user : source_user, message_text : "test message12345678", post_time: datetime},
			dataType: 'json'
		}).done(function(data){
			post_request_count +=1;
			post_request(finish_time);
		}).fail(function(){
			console.log('error on posting test message');
		});
	}
}

function get_request(finish_time) {
	var current_time = new Date().getTime();
	if(current_time >= finish_time) {
		on_test = false;
		finish_test(true);
		return;
	} 
	if(!on_test) {
		$('#alert_bar').html('Testing is stopped already.');
		$('#spinner').hide();
		finish_test(false);
	} else {
		//get request
		$.ajax({
			url: '/get-test-messages',
			type: 'GET',
			dataType: 'json'
		}).done(function(data){
			get_request_count +=1;
			get_request(finish_time);
		}).fail(function(){
			console.log('error on getting test messages');
		});
	}
}

function finish_test(finished) {
	$('#spinner').hide();
	
		if(!finished) {
			temp_time = new Date().getTime();
			real_test_time = temp_time-test_start_time;
		} else {
			real_test_time = test_duration;
		}
		$('#total_posts').html(post_request_count);
		$('#total_gets').html(get_request_count);
		$('#post_per_sec').html(((post_request_count/real_test_time)*1000).toFixed(1));
		$('#get_per_sec').html(((get_request_count/real_test_time)*1000).toFixed(1));
		$.ajax({
			url: '/performance-shutdown',
			type: 'POST',
			dataType: 'json'
		}).done(function(data){
		}).fail(function(){
			console.log('error on shutting down performance db');
		});
	
}

$('#btn-stop').click(function(){
	on_test = false;
	finish_test(false);
});