// Returns a new notification ID used in the notification.
function getNotificationId() {
  var id = Math.floor(Math.random() * 9007199254740992) + 1;
  return id.toString();
}
var lastMessageReceivedEmail;

function messageReceived(message) {
  // A message is an object with a data property that
  // consists of key-value pairs.

  // Concatenate all key-value pairs to form a display string.
  var messageString = "";
  var messageFrom = message.data["From"];
  for (var key in message.data) {
    if (messageString != "")
		messageString += ", "
    messageString += key + ":" + message.data[key];
  }
  saveMessage(messageFrom, messageString);
  saveLastEmetteur(messageFrom);
  
  lastMessageReceivedEmail = messageFrom;
  
  console.log("Message received: " + messageString);

  // Pop up a notification to show the GCM message.
  chrome.notifications.create(getNotificationId(), {
    title: 'Message de '+messageFrom,
    iconUrl: 'ic_launcher.png',
    type: 'basic',
    message: message.data["Notice"]
  }, function() {
  });
}

function openConversationFromLastEmetteur()
{
	chrome.storage.local.get("currentConversation", function(result) {
		if(result['currentConversation'])
		{
		chrome.tabs.create({'url': chrome.extension.getURL('conversation.html')}, function(tab) {
			// Tab opened.
		});
		//chrome.management.launchApp("lklacpdhafkihndnabfpdebogcgmeaki");
		  
		 return;
		}
	});
}
function saveMessage(from, message)
{
	var storage = chrome.storage.local;

	var myKey = from;

	storage.get(myKey, function(result){
		if(result[myKey])
		{
			var arrayMessages = result[myKey];
			arrayMessages.push(message);
			var obj= {};
			obj[myKey] = arrayMessages;
			storage.set(obj);
		}
		else{
			var arrayMessages = new Array();
			arrayMessages.push(message);
			var obj= {};
			obj[myKey] = arrayMessages;
			storage.set(obj);
		}
	});
	
}
function saveLastEmetteur(from)
{
	var storage = chrome.storage.local;

	var myKey = 'currentConversation';

	var obj= {};

	obj[myKey] = from;

	storage.set(obj);
}
var registerWindowCreated = false;

function firstTimeRegistration() {
  chrome.storage.local.get("registered", function(result) {
	  chrome.storage.local.get("registrationId", function(result2){
		console.log("onInstalled registered: "+result["registered"] +" id: "+ result2["registrationId"]);
	  });
  });
}
function onStartup(){
  chrome.storage.local.get("registered", function(result) {
  chrome.storage.local.get("registrationId", function(result2){
		console.log("onstartup registered: "+result["registered"] +" id: "+ result2["registrationId"]);
	  });
    // If already registered, bail out.
    if (result["registered"])
	{
		chrome.app.window.create(
		  "listPeople.html",
		  {  width: 500,
			 height: 400,
			 frame: 'chrome'
		  },
		  function(appWin) {}
		);
		 return;
	}
     

    registerWindowCreated = true;
    chrome.app.window.create(
      "register.html",
      {  width: 500,
         height: 400,
         frame: 'chrome'
      },
      function(appWin) {}
    );
  });
}

// Set up a listener for GCM message event.
chrome.gcm.onMessage.addListener(messageReceived);

// Set up listeners to trigger the first time registration.
chrome.runtime.onInstalled.addListener(firstTimeRegistration);
chrome.runtime.onStartup.addListener(onStartup);
chrome.notifications.onButtonClicked.addListener(openConversationFromLastEmetteur);
chrome.notifications.onClicked.addListener(openConversationFromLastEmetteur);

