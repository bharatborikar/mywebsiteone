var allcommands = {
	results:[], 
	currentConversation:0, 
	totalConversation:0,
	conversations: function(){ return []; },
	initialise: function()
	{
		commandRunning = true;
		commandHandler = this;
		
		this.startConversation(); 
	},
	startConversation: function()
	{
		var cs = this.conversations();
		this.currentConversation = false;
		if(cs.length > 0)
		{
			/*this.totalConversation = cs.length;
			//_e("CurrentConversation: " + this.currentConversation); 
			if(this.currentConversation < this.totalConversation)
			{
				make_speak(cs[this.currentConversation].question);
			}
			else{
				var yourline = transcription;
				var yourline = yourline.replace(/i /gi,"you "); 
				var yourline = yourline.replace(/my/gi,"your"); 
				make_speak("I know!, " + yourline);	
				commandRunning = commandHandler = transcription = intrimResults = false;
				_e(this.results);
			}*/
		}
		else
		{
			var yourline = "<h3>Below are the list of all available commands.</h3>";
			make_type(yourline);
			yourline = "";
			$.each(appsCommands,function(index,ele){
				yourline = "<h5>" + ele.appname + "</h5>" + ele.triggers.join(", ");
				make_type(yourline);
			});
			commandRunning = commandHandler = transcription = intrimResults = false;
			
		}
	}
	
}