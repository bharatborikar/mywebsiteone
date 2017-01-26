var SITE_PATH = window.location.protocol + "//" + window.location.hostname + "/";
recognizer = null;
var transcription = null;
var intrimResults = null;
/*var appsCommands = [
	{"appname":"Expense Management","link":SITE_PATH + "exm","triggers":["expense manager","expense management","manage expense"]},
	{"appname":"Notes Management","link":SITE_PATH + "ntm","triggers":["note manager","take a note","note down","create a note","make a note","add note","my note","please note","please note down"]}
	
	]*/
function make_listen(text)
{	
	return new Promise(function(resolve,reject){
	/*window.SpeechRecognition = window.SpeechRecognition        ||
                                    window.webkitSpeechRecognition  ||
                                    null;*/
									
	SpeechRecognition =	window.webkitSpeechRecognition;
	if(!SpeechRecognition){ 
	 console.log("Speech Recognisation is not working!"); 
	}
	recognizer = new SpeechRecognition();
	//recognizer.continuous = true;
	recognizer.interimResults = true; 
	recognizer.addEventListener('result', function(event) {
               transcription = '';
				for (var i = event.resultIndex; i < event.results.length; i++) {
                  if (event.results[i].isFinal) {
                     transcription = event.results[i][0].transcript;
					 
					 resolve(transcription);
					 
                  } else {  
                     intrimResults += event.results[i][0].transcript;
					 console.log(intrimResults);
                  }
				  if(transcription && transcription != "" && transcription != null){
					$("#commandList").append("<li>" + transcription + "</li>");
				 }
				 $("#speechbar").html(intrimResults); 
               }
			   
    });
	recognizer.onstart = function() { 
		 console.log('Recognisation started'); 
	}
	recognizer.onerror = function(event) { 
		 console.log('Recognisation error!'); reject("Recognised Error: " + transcription); 
	}
	recognizer.onend = function() { 
		 console.log('Recognisation end!'); 
		 /*var commandLink = findCommand();
		 if(commandLink && commandLink != "")
		 { 
			window.location = commandLink;
		 } */
		 
		 recognizer.start();
	}
	});
}
function findCommand()
{
	var cmdlink = false;
	$.each(appsCommands,function(i,ele){
		$.each(ele.triggers,function(index,triggerCommand){
			if(transcription.toString().indexOf(triggerCommand.toString()) >= 0)
			{
				if(cmdlink == false){
					cmdlink = ele.link;
				}
			}
		});
	});
		return cmdlink;
}
function findCommandLink()
{
	var commandIndex = findCommand();
	
	if(commandIndex !== false)
	{	
		var result = { commandName:"",commandLink:"" };
		result.commandName = appsCommand[commandIndex];
		console.log(commandIndex);
		switch(commandIndex)
		{
			case 0:
			case 2:
			case 4:
				result.commandLink = appsCommandLink[0];
			break;
			case 1:
			case 3:
			case 5:
				result.commandLink = appsCommandLink[0];
			break;
		}
	}
	else{ return false; }
	return result;
}
$(function(){
	
	make_listen("Start Command").then(function(result){  });
	recognizer.start();
	
});
