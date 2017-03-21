var remembermystuff = {
	results:[], 
	currentConversation:0, 
	totalConversation:0,
	applyBackgroundColor:false,
	background_color:"#80DEEA",
	conversations: function(){ return [
		{"question":"Please tell me","fieldname":"mystuff"},
	]},
	initialise: function()
	{
		commandRunning = true;
		commandHandler = this;
		
		this.startConversation(); 
	},
	startConversation: function()
	{
		var cs = this.conversations();
		if(cs.length > 0)
		{
			this.applyBackgroundColor = "style='background:"+this.background_color + "'";
			this.totalConversation = cs.length;
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
				commandRunning = commandHandler = transcription = intrimResults = this.applyBackgroundColor = false;
				_e(this.results);
			}
		}
	}
	
}