var emailDestinataire;
var body;
var myRegId;
window.onload = function() {
	 var message = document.getElementById('text');

	  message.onkeydown = function (e) {
	    if (13 == e.keyCode) {
	    	sendChatMessage();
	      return false;
	    }
	  };
	
	
	body = document.getElementById("tbody");
	document.getElementById("back").onclick = function(){
		window.location = "listPeople.html";
	};
	chrome.storage.local.get("currentConversation", function(result){
		emailDestinataire = result["currentConversation"];
		document.getElementById("conversationTitle").innerHTML = "Conversation avec "+emailDestinataire;
		
		chrome.storage.local.get(emailDestinataire, function(result){
			body = tableCreate(body, result[emailDestinataire]);
		});
	});
chrome.storage.local.get("registrationId", function(result){
		console.log("regid: "+result["registrationId"]);
		myRegId = result["registrationId"];
	  });
	
}

function tableCreate(tbl, arrayLine){
	//tbl.style.width='100%';
	//tbl.setAttribute('border','1');
	//var tbdy=document.createElement('tbody');
	for(var i=0;i<arrayLine.length;i++){
		var tr=document.createElement('tr');
		
		var td=document.createElement('td');
		var text = arrayLine[i];
		td.appendChild(document.createTextNode(text));
		
		tr.appendChild(td);
		
		tbl.appendChild(tr);
	}
	return tbl;
}

function sendChatMessage()
{
		
//	var form = post('http://oxiane.com/google-push/sendmessage.php', 
//			{from: myRegId, 
//			 message: document.getElementById("text").value , 
//			 'nom[0]' : emailDestinataire});
	postAjax('http://oxiane.com/google-push/sendmessage.php', 
			{from: myRegId, 
			 message: document.getElementById("text").value , 
			 'nom[0]' : emailDestinataire,
			 'submit': 'Send'});
//	form.submit();
//	postRequest();
	
	var body = document.getElementById("tbody");
	var tr=document.createElement('tr');
	
	var td=document.createElement('td');
	tr.appendChild(td);
	
	td=document.createElement('td');
	var text = document.getElementById("text").value;
	td.appendChild(document.createTextNode(text));
	tr.appendChild(td);
	
	body.appendChild(tr);
	
	document.getElementById("text").value = '';

    //body.removeChild(form);
}
function postRequest()
{
	var http = new XMLHttpRequest();
	var url = "http://oxiane.com/google-push/sendmessage.php";
	var params = "from="+myRegId+"&message="+document.getElementById("text")+"&nom[0]="+emailDestinataire+"&submit=Send";
	http.open("POST", url, true);

	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.setRequestHeader("Content-length", params.length);
	http.setRequestHeader("Connection", "close");

	http.onreadystatechange = function() {//Call a function when the state changes.
	    if(http.readyState == 4 && http.status == 200) {
	        alert(http.responseText);
	    }
	}
	http.send(params);
}
function postAjax(theurl, params)
{
	$.ajax({
	    type: "POST",
	    url: theurl,
	    data: params,
	    success: function(data) {
	        console.log(data);
	    }
	});	
}
var count = 0;
function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("id","myform"+(count++))
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }
    //submit: "Send"
    var submitButton = document.createElement("submit");
    submitButton.setAttribute("name", "submit");
    submitButton.setAttribute("value", "Send");
    form.appendChild(submitButton);
    
    document.body.appendChild(form);
    return form;
}