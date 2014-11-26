var email;
var body;
window.onload = function() {
	document.getElementById("text").addEventListener("onkeyup",onSubmitChat);
	document.getElementById("text").addEventListener("onkeydown",onSubmitChat);
	document.getElementById("text").addEventListener("onkeypress",onSubmitChat);
	body = document.getElementById("tbody");
	document.getElementById("back").onclick = function(){
		window.location = "listPeople.html";
	};
	chrome.storage.local.get("currentConversation", function(result){
		email = result["currentConversation"];
		document.getElementById("conversationTitle").innerHTML = "Conversation avec "+email;
		
		chrome.storage.local.get(email, function(result){
			body = tableCreate(body, result[email]);
		});
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
function onSubmitChat() {
    var key = window.event.keyCode;

    // If the user has pressed enter
    if (key == 13) {
        document.getElementById("text").value =document.getElementById("text").value + "\n";
		sendChatMessage();
        return false;
    }
    else {
        return true;
    }
}
function sendChatMessage()
{
	chrome.storage.local.get("myLocalRegid", function(result){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
			//document.getElementById("list").innerHTML = xhr.responseText;
			console.log(xhr.responseText);
			
			
			var tr=document.createElement('tr');
			var td=document.createElement('td');
			tr.appendChild(td);
			
			td=document.createElement('td');
			var text = document.getElementById("text").value;
			td.appendChild(document.createTextNode(text));
			tr.appendChild(td);
			
			body.appendChild(tr);
			
		  }
		  
		}
		xhr.open("GET", "http://oxiane.com/google-push/sendmessage.php?from="+result["myLocalRegid"]+"&message="+document.getElementById("text").value+"&nom="+email, true);
		xhr.send();
	  });
}