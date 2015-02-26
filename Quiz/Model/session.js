(function(){
	var m = model.Session;
	var methods = m.methods;
	var eMethods = m.entityMethods;

	eMethods.endSession = function endSession () {
		this.end = new Date();
		this.save();
		return this;
	};
	
	eMethods.send = function(){
		if(this.start && this.end){
			return require('utils').sendResponse(this);
		}
		
		return false;
	};
	eMethods.send.scope = 'public';

	methods.createNew = function createNew (user) {
		if(!user){
			user = sessionStorage.name;
		}
		
		var s = new ds.Session({
			user: user,
			start: new Date()
		});
		s.save();
		return s;
	};
})();