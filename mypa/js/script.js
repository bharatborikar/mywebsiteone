//var APP_PATH = "/bharatborikar/mywebsiteone/gh-pages/mypa/";
var APP_PATH = "/mywebsiteone/mypa/";
//var APP_PATH = "/pa/";
var SITE_PATH = window.location.protocol + "//" + window.location.hostname + APP_PATH;
console.log(SITE_PATH);
var APP_MODULE_PATH = SITE_PATH + "js/apps_modules"; //apps module path
function _e(text){ console.log(text); } 
masterConversation = [];
recognizer = utterance = null;
commandRunning = commandHandler = false;
var transcription = intrimResults = null;


var appsCommands = [
	{"appname":"Remember My Stuff","handler":"remembermystuff","triggers":["take a note","create a note","please remember","remember this","store this","save this"]},
	{"appname":"Expense Management","handler":"expensemanager","triggers":["expense manager","expense management","manage expense"]},
	{"appname":"Manager apps command","handler":"allcommands","triggers":["show command","so command","show commands","so commands","all command","list all command","show all command"]}
	

	/*{"appname":"Notes Management","handler":"takeanote","triggers":["note manager","take a note","note down","e","make a note","add note","my note","please note","please note down"]}*/
	]
	
function load_apps_module(index)
	{
		
		/*if(index != '')
		{*/
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
					console.log(appsCommands[index].appname + " Not Loaded");
				});
			}
		/*}*/
	}
	
function doTask(command)
{
	_e("Command here:" + command);
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
		else {
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
	recognizer.continuous = false;
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
					var eleid = new Date().getTime();
					$("#commandList").append("<li class='myspeech'  id='"+ eleid+ "_li'   "+ commandHandler.applyBackgroundColor + "><textarea id='"+ eleid+ "_txt' name='"+ eleid+ "_txt'>" + transcription + "</textarea></li>");
					$("html, body").animate({ scrollTop: $(document).height() }, 1000);
					masterConversation.push("my_line:" + transcription); 
					save_local();
					if(commandRunning)
					{ 
						if(commandHandler.currentConversation !== false){
						var fieldname = commandHandler.conversations()[commandHandler.currentConversation]['fieldname']; 
						var resultRow = {"fieldname":fieldname,"fieldvalue":transcription};
						commandHandler.results.push(resultRow); 
						commandHandler.currentConversation += 1; 
						commandHandler.startConversation();
						}
						
					}
					else { _e("Command note running"); }
					doTask(transcription);
				 }
				 $("#speechbar > #chat_msg").val(transcription); 
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
		 //recognizer.start(); //uncomment this line
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
				  var eleid = new Date().getTime();
				  $("#commandList").append("<li class='yourspeech' " + commandHandler.applyBackgroundColor + "><textarea id='"+ eleid+ "_txt' name='"+ eleid+ "_txt'>" + text + "</textarea></li>");
				  masterConversation.push("app_line:"+ new Date().getTime() + ":" + text);
				  save_local();
				  $("html, body").animate({ scrollTop: $(document).height() }, 1000);
				  resolve('Speaker started: ' + text);
				  
               });
               utterance.addEventListener('end', function() {
                  // console.log('Speaker finished!'); 
				 // recognizer.start(); //uncomment this line
               });
				utterance.addEventListener('error', function (event) {
					// console.log('Error occured while speacking!');
					reject('Error occured while speacking!' + text);
				});
               speechSynthesis.speak(utterance);
			   });
}

function make_type(text) 
{
	$("#commandList").append("<li class='yourspeech'>"+ text + "</li>");
	$("html, body").animate({ scrollTop: $(document).height() }, 1000);
	masterConversation.push("app_line:" + text);
	save_local();
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
function save_local()
{
	localStorage.setItem("mypa_master_conversation",JSON.stringify(masterConversation));
	getConversation = JSON.parse(localStorage.getItem("mypa_master_conversation")); 
	if(getConversation != null)
	{ 
	_e(getConversation.length);
	$("#chat_counter").text(getConversation.length); }
	else{ $("#chat_counter").text(0); } 
	
	
}


$(function(){
	var oldConversation = JSON.parse(localStorage.getItem("mypa_master_conversation"));
	if(oldConversation != null)
	{
		$.each(oldConversation,function(i,arr){
				masterConversation.push(arr); 
			});
		$("#chat_counter").text(oldConversation.length);	
	}
	else{ $("#chat_counter").text(0);  }

	make_listen("Start Command");
	recognizer.start(); //uncomment this line
	$("#chat_btn").click(function(){ 
		transcription = $("#chat_msg").val();
	 if(transcription && transcription != "" && transcription != null){ 
				var eleid = new Date().getTime();
				$("#commandList").append("<li class='myspeech'  id='"+ eleid+ "_li'   "+ commandHandler.applyBackgroundColor + "><textarea id='"+ eleid+ "_txt' name='"+ eleid+ "_txt'>" + transcription + "</textarea></li>");
				$("html, body").animate({ scrollTop: $(document).height() }, 1000);
				masterConversation.push("my_line:"+ new Date().getTime() + ":" + transcription); 
				save_local();
				if(commandRunning)
				{ 
					if(commandHandler.currentConversation !== false){
					var fieldname = commandHandler.conversations()[commandHandler.currentConversation]['fieldname']; 
					var resultRow = {"fieldname":fieldname,"fieldvalue":transcription};
					commandHandler.results.push(resultRow); 
					commandHandler.currentConversation += 1;  
					commandHandler.startConversation();
					}
					
				}
				else { _e("Command note running"); }
				doTask(transcription);
				$("#chat_msg").val('');
			 }
	});
	
	$("#chat_counterlink").click(function(){
		var allConversation = JSON.parse(localStorage.getItem("mypa_master_conversation"));
		console.log(allConversation);
		//google drive file: https://docs.google.com/spreadsheets/d/15dKAvMJJlbz-w2hKadZXzEugC6gH1FGYYxGR2R7866Q/edit
		$.ajax({
			url:"https://script.google.com/macros/s/AKfycbwvSsNispI7dRkaTFn8PHqhKdA_s9nX7ufIT82MSwLgq6Cpw8NX/exec",
			type:"post",
			data:{"conversationlines":JSON.stringify(allConversation)},   
			success:function(data){ console.log(data); localStorage.removeItem("mypa_master_conversation"); $("#chat_counter").text("0"); }, 
			error:function(){ console.log(error); }
		});
		//console.log(allConversation);
	});
	
});
