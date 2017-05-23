// var BASE_HOST = "https://neversleep.herokuapp.com";
var BASE_HOST = "http://localhost:5000";
var http = new XMLHttpRequest();

$(document).ready(function(){
	$("#btn_remove").click(function(event){
		event.preventDefault();
	});
})

function monitoring() {
	var params = "domain=" + $("#input_url").val() + "&email=" + $("#input_email").val();
	$("input").val("");
	http.open("POST", BASE_HOST + "/monitoring", true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.onreadystatechange = function() {//Call a function when the state changes.
	    if(http.readyState == XMLHttpRequest.DONE) {

	    	$(".response").text("");

	    	if (http.status === 200) {
	    		$(".response").text(JSON.parse(http.responseText)["msg"]);

	    		$("#info span").remove();

	    		if (JSON.parse(http.responseText)["sum"] > 1) {
	    			$("#info").prepend("<span>There are <b>" + JSON.parse(http.responseText)["sum"] + "</b> domains using Nerversleep service. Thankyou for sharing.</span>");
	    		}else {
	    			$("#info").prepend("<span>There are <b>" + JSON.parse(http.responseText)["sum"] + "</b> domains using Nerversleep service. Thankyou for sharing.</span>");
	    		}
	    	}
	    }
	}
	http.send(params);
}

function stopMonitoring() {
	$('#myModal').modal('hide');

	var params = "domain=" + $("#input_url_remove").val();
	$("input").val("");
	http.open("POST", BASE_HOST + "/stop", true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.onreadystatechange = function() {//Call a function when the state changes.
	    if(http.readyState == XMLHttpRequest.DONE) {

	    	$(".link p").remove();

	    	if (http.status === 200) {
	    		$(".response").text(JSON.parse(http.responseText)["msg"]);

	    		$("#info span").remove();

	    		if (JSON.parse(http.responseText)["sum"] > 1) {
	    			$("#info").prepend("<span>There are <b>" + JSON.parse(http.responseText)["sum"] + "</b> domains using Nerversleep service. Thankyou for sharing.</span>");
	    		}else {
	    			$("#info").prepend("<span>There are <b>" + JSON.parse(http.responseText)["sum"] + "</b> domains using Nerversleep service. Thankyou for sharing.</span>");
	    		}
	    	}
	    }
	}
	http.send(params);
}