function sortArraybByKey(array,key) {
	return array.sort(function(a,b){
		var x=a[key];
		var y=b[key];
		return ((x<y) ? -1 : ((x>y) ? 1:0));
	});
}

function loadPage(href) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", href, false);
	xmlhttp.send();
	return xmlhttp.responseText;
}

function linkPage(href, js) {
	$("#FRAME").html(loadPage("login.html")); 
	$.getScript(js);
}


