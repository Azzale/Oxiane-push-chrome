function tableCreate(arrayLine){
	var now = new Date();
	var body=document.getElementsByTagName('body')[0];
	var tbl=document.createElement('table');
	tbl.style.width='100%';
	//tbl.setAttribute('border','1');
	var tbdy=document.createElement('tbody');
	for(var i=0;i<arrayLine.length;i++){
		var tr=document.createElement('tr');
		for(var j=0;j<2;j++){
			var firstPipe = arrayLine[i].indexOf("||");
			var secondPipe = arrayLine[i].lastIndexOf("||");
			var td=document.createElement('td');
			if(j==0)
			{
				var email = arrayLine[i].substr(0,firstPipe);
				if(email == "")
					email = "Inconnu";
				td.appendChild(document.createTextNode(email));
				tr.onclick = function(){
					openConversation(this);
				};
			}
			else{
				var lastOnline = arrayLine[i].substr(secondPipe+2);
				var lastOnlineD = new Date(lastOnline);
				var text = "Unknown";
				if(now - lastOnlineD < 5*60*1000)
				{
					text = "Online";
				}
				else if(now -lastOnlineD >= 5*60*1000)
				{
					text = "Away";
				}
				
				td.appendChild(document.createTextNode(text));
			}
			tr.appendChild(td);
		}
		tbdy.appendChild(tr);
	}
	tbl.appendChild(tbdy);
	body.appendChild(tbl)
}

function getListPeople()
{
	chrome.storage.local.get("registrationID", function(result){
	var regid = result["regid"];
	var xhr2 = new XMLHttpRequest();
    xhr2.onreadystatechange = function() {
      if (xhr2.readyState == 4) {
	  var response = xhr2.responseText;
	  if(response.indexOf("<br/>")>-1)
	  {
		response = response.substr(response.indexOf("<br/>")+5, response.length - 7);
	  }
        tableCreate(makeArray(response));
        console.log(xhr2.responseText);
      }
      
    }
    xhr2.open("GET", "http://www.oxiane.com/google-push/list.php?regid="+regid, true);
    xhr2.send();
	});
	
}
function makeArray(g1)
{
	var arr1 = new Array;
  if (g1.indexOf("<br/>") != -1)
    {arr1 = g1.split("<br/>");}
  else if (g1.indexOf("\r\n") != -1)
    {arr1 = g1.split("\r\n");}
  else if (g1.indexOf("\n") != -1)
    {arr1 = g1.split("\n");}
  else if (g1.indexOf(",") != -1)
    {arr1 = g1.split(",");}
  else if (g1.indexOf("\t") != -1)
    {arr1 = g1.split("\t");}
  else{arr1 = g1.split(" ");}   
return arr1;  
}
function openConversation(email)
{
	var storage = chrome.storage.local;

	var myKey = 'currentConversation';

	var obj= {};

	obj[myKey] = email.cells[0].innerHTML;

	storage.set(obj, function(result){
		window.location = "conversation.html";	
	});
}
window.onload = function() {
	getListPeople();
}