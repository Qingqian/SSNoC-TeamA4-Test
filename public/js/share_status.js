$("#change_status_btn").click(function(){
	var selection = $('#status_options').val();
	var currentdate = new Date();
	var datetime = currentdate.getDate() + "/"
				+ (currentdate.getMonth()+1)  + "/" 
				+ currentdate.getFullYear() + " @ "  
				+ currentdate.getHours() + ":"  
				+ currentdate.getMinutes() + ":" 
				+ currentdate.getSeconds();
	$.ajax({
		url: '/share-status',
		type:'POST',
		data: {user_status: selection, change_status_time : datetime},
		dataType:'json'
	}).done(function(){
	}).fail(function(){
		console.log('error on changing user status');
	});
});
