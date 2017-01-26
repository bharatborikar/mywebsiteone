var takeanote = {
	results:[], 
	currentConversation:0, 
	totalConversation:0,
	conversations: function(){ return [
		{"question":"Tell me your note 1","fieldname":"testing1"},
		{"question":"Please tell me your note 2","fieldname":"testing2"},
		{"question":"What to note down 3","fieldname":"testing3"},
		{"question":"What is your note 4","fieldname":"testing4"},
		{"question":"What is note 5","fieldname":"testing5"}
	]},
	initialise: function()
	{
		commandRunning = true;
		commandHandler = this;
		_e(this.startConversation()); 
	},
	startConversation: function()
	{
		var cs = this.conversations();
		if(cs.length > 0)
		{
			this.totalConversation = cs.length;
			_e("CurrentConversation: " + this.currentConversation);
			if(this.currentConversation < this.totalConversation)
			{
				make_speak(cs[this.currentConversation].question);
			}
			else{
				make_speak("Expense saved successfully");	
				commandRunning = commandHandler = false;
				_e(results);
			}
		}
	}
	
}
