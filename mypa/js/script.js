var APP_PATH = "/bharatborikar/mywebsiteone/gh-pages/mypa/";
var SITE_PATH = window.location.protocol + "//" + window.location.hostname + APP_PATH;
var APP_MODULE_PATH = SITE_PATH + "js/apps_modules"; //apps module path
function _e(text){ console.log(text); }

recognizer = utterance = null;
commandRunning = commandHandler = false;
var transcription = intrimResults = null;

var appsCommands = [
	{"appname":"Expense Management","handler":"expensemanager","link":SITE_PATH + "exm","triggers":["expense manager","expense management","manage expense"]},
	{"appname":"Notes Management","handler":"takeanote","link":SITE_PATH + "ntm","triggers":["note manager","take a note","note down","create a note","make a note","add note","my note","please note","please note down"]}
	]
	
function load_apps_module(index)
	{
		if(index && index != '')
		{
			var handler = appsCommands[index].handler;
			var scriptname = APP_MODULE_PATH + "/" + handler + ".js"; 
			if(scriptname != "")
			{
				$.getScript(scriptname)
				.done(function( script, textStatus ) {
					console.log(appsCommands[index].appname + " Loaded");
					eval(handler + '.initialise();');
				})
				.fail(function( jqxhr, settings, exception ) {
					console.log(appsCommands[index].appname + "Not Loaded");
				});
			}
		}
	}
	
function doTask(command)
{
	if(command && command != '')
	{
		if(commandRunning === false){ 
		ci = findCommand(command);
		var replyline = "";
		if(ci !== false)
			{
				replyline = command + " command is found!"; 
				load_apps_module(ci);
			}
		else{
				replyline = "Command not found!";  
				make_speak(replyline);
			}
		}
	}
}	
function make_listen(text)
{	
	return new Promise(function(resolve,reject){
	window.SpeechRecognition = window.SpeechRecognition        ||
                                    window.webkitSpeechRecognition  ||
                                    null;
									
	//SpeechRecognition =	window.webkitSpeechRecognition;
	if(!SpeechRecognition){ 
	 console.log("Speech Recognisation is not working!"); 
	}
	recognizer = new SpeechRecognition();
	recognizer.continuous = true;
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
					$("#commandList").append("<li class='myspeech'><input type='text' id='' name='' value='" + transcription + "'/></li>");
					if(commandRunning)
					{ 
						var fieldname = commandHandler.conversations()[commandHandler.currentConversation]['fieldname']; 
						var resultRow = {"fieldname":fieldname,"fieldvalue":transcription};
						commandHandler.results.push(resultRow); 
						commandHandler.currentConversation += 1; 
						commandHandler.startConversation();
					}
					else { _e("Command note running"); }
					doTask(transcription);
				 }
				 $("#speechbar").html(transcription); 
               }
			   
    });
	recognizer.onstart = function() { 
		 console.log('Recognisation started'); 
	}
	recognizer.onerror = function(event) { 
		 console.log('Recognisation error!'); 
		 console.log('Speech recognition error detected: ' + event.error);
		console.log('Additional information: ' + event.message);
		 reject("Recognised Error: " + transcription); 
	}
	recognizer.onend = function() { 
		 console.log('Recognisation end!'); 
		 recognizer.start();
	}
	});
}

function make_speak(text) 
{
	return new Promise(function(resolve,reject){
	if (!SpeechSynthesisUtterance) { _e('SpeechSynthesisUtterance is not working!'); return false; }
	
	var selectedOption = 'Google UK English Female';
	var selectedVoice = speechSynthesis
                  .getVoices()
                  .filter(function(voice) {
                     return voice.voiceURI === selectedOption;
                  })
                  .pop();
 
               // Create the utterance object setting the chosen parameters
               utterance = new SpeechSynthesisUtterance();
               utterance.text = text;
               utterance.voice = selectedVoice;  
               utterance.lang = 'en-GB';
               utterance.rate = 1;
               utterance.pitch = 1; 
			
               utterance.addEventListener('start', function() {
                  // console.log('Speaker started: ' + text); 
				  $("#commandList").append("<li class='yourspeech'><input type='text' id='' name='' value='" + text + "'/></li>");
				  resolve('Speaker started: ' + text);
				  
               });
               utterance.addEventListener('end', function() {
                  // console.log('Speaker finished!'); 
				  recognizer.start();
               });
				utterance.addEventListener('error', function (event) {
					// console.log('Error occured while speacking!');
					reject('Error occured while speacking!' + text);
				});
               speechSynthesis.speak(utterance);
			   });
}

function findCommand(command)
{
	var cmdIndex = false;
	$.each(appsCommands,function(i,ele){
		$.each(ele.triggers,function(index,triggerCommand){
			if(command.toString().indexOf(triggerCommand.toString()) >= 0)
			{
				if(cmdIndex == false){
					cmdIndex = i;
				}
			}
		});
	});
		return cmdIndex;
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
	make_listen("Start Command");
	recognizer.start();
});