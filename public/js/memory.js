var client_socket = io.connect();
var monitor;

client_socket.on('connect', function(){
	//get current source user
	$.ajax({
		url: '/user',
		type: 'GET',
		dataType: 'json'
	}).done(function(data){
		monitor = data.user.username;
	}).fail(function(){
		console.log('error on getting current user');
	});
});

client_socket.on('not allowed memory testing', function(data){
	$("#btn_start").prop("disabled",true);
	if(data.monitor != monitor) {
		$('#alert_bar').html('Another monitor has already started testing on memory. Stop it first if you want to start a new one.');
		$('#alert_bar').show();	
	} 
});

client_socket.on('allowed memory testing', function(data){
	$('#spinner').hide();
	$("#btn_start").prop("disabled",false);
	if(on_test) {
		on_test=false;
		clearTimeout(task);
		current_number =0;
		get_memory_usage();
		$('#alert_bar').html('Testing on memory usage is halted by other user.');
		$('#alert_bar').show();
	} else {
		$('#alert_bar').html('You can start monitoring memory!!');
		$('#alert_bar').show();
	}
	
});

$('#alert_bar').hide();
$('#spinner').hide();

var on_test = false;
var total_number = 60;
var current_number = 0;
var task;

$('#btn_start').click(function(){
	var oldTable = $('#result_table');
	if(oldTable){
		$('#result_table').remove();
	}
	if(!on_test) {
		$(this).prop("disabled",true);
		on_test = true;
		$('#alert_bar').hide();
		$('#spinner').show();
		client_socket.emit('memory testing',{monitor: monitor});
		run_test();	
	}
	
});

function run_test() {
	if(current_number > total_number)
		return;
	//start testing
	$.ajax({
		url: '/start-memory',
		type: 'POST',
		dataType: 'json'
	}).done(function(data){
		current_number++;
		task = setTimeout(run_test,60000);
	}).fail(function(){
		console.log('error on starting testing on memory usage');
	});
}

$('#btn_stop').click(function(){
	if(on_test) {
		$('#spinner').hide();
		on_test = false;
		$("#btn_start").prop("disabled",false);
		clearTimeout(task);
		current_number =0;
		get_memory_usage();
		$('#alert_bar').html('Testing on memory usage is halted by the user.');
		$('#alert_bar').show();
		client_socket.emit('stop memory testing',{monitor: monitor});
	} else {
		get_memory_usage();
		client_socket.emit('stop memory testing',{monitor: monitor});
	}
});

$('#btn_view').click(function(){
	get_memory_usage();
});

function get_memory_usage() {
	//start testing
	$.ajax({
		url: '/get-memory-usage',
		type: 'GET',
		dataType: 'json'
	}).done(function(data){
		refreshResultTable(data.memory_usages);
	}).fail(function(){
		console.log('error on getting all memory usage');
	});
}

function refreshResultTable(memory_usages) {
	var oldTable = $('#result_table');
	if(oldTable){
		$('#result_table').remove();
	}
	if(!memory_usages) {
		$('#alert_bar').html('No test results in last hour');
		$('#alert_bar').show();
	} else {
		var table = $("<table id='result_table'></table>").addClass("table");
		table.append("<thead><tr><td>Timestamp</td><td>Used Memory</td><td>Free Memory</td><td>Used NV Memory</td><td>Free NV Memory</td></tr></thead>");
		for(var i=0;i<memory_usages.length;i++) {
			var row = $('<tr></tr>');
			var date = new Date(parseFloat(memory_usages[i].timestamp)).toLocaleString();
			row.append($('<td></td>').text(date));
			row.append($('<td></td>').text(memory_usages[i].used_volatile_memory));
			row.append($('<td></td>').text(memory_usages[i].free_volatile_memory));
			row.append($('<td></td>').text(memory_usages[i].used_non_volatile_memory));
			row.append($('<td></td>').text(memory_usages[i].free_non_volatile_memory));
			table.append(row);
		}
		$('#result_container').append(table);
	}
}
