(function(){
	var m = model.Exam;
	var methods = m.methods;
	var eMethods = m.entityMethods;

	eMethods.start = function start (user) {
		var s = new ds.Session.createNew(user);
		
		s.exam = this;
		s.save();
		
		return s;
	};
})();