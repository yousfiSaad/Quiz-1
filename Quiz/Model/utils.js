(function(){
	var m = model.Utils;
	var methods = m.methods;
	var utils = require('utils');

	methods.start = function start (user, exam) {
		if(!user || typeof user !== 'string'){
			return false;
		}

		if(exam){
			exam = ds.Exam(exam);
		} else {
			exam = ds.Exam.first();
		}

		if(exam){
			sessionStorage.name = user;
			sessionStorage.start = new Date();
			
			var s = exam.start(user);

			if(s){
				currentSession().promoteWith('student');
				sessionStorage.SESS_ID = s.getKey();
			}
			
			return s;
		}

		return false;
	};
	methods.start.scope = 'public';

	methods.end = function end () {
		var id = sessionStorage.SESS_ID;
		
		if(id){
			var s = ds.Session(id);
			
			if(s){
				currentSession().promoteWith('student');
				s.endSession();
				sessionStorage.removeItem('SESS_ID');
				sessionStorage.removeItem('start');

				utils.sendResponse(s);
			}
			
			return true;
		}

		return false;
	};
	methods.end.scope = 'public';

	methods.getResponse = function(qID){
		var id = sessionStorage.SESS_ID;
		var resp = null;
		if(id){
			var s = ds.Session(id);
			var q = ds.Question(qID);
			if(s && q && q.exam.ID == s.exam.ID){
				var r = s.responses.find('question.ID == :1', q.ID);
				if(r){
					resp = JSON.parse(r.response);
				}
			}
		}
		return resp;
	};
	methods.getResponse.scope = 'public';
	methods.respond = function respond (qID, response) {
		var id = sessionStorage.SESS_ID;
		
		if(id){
			var s = ds.Session(id);
			var q = ds.Question(qID);

			if(s && q && q.exam.ID == s.exam.ID){
				currentSession().promoteWith('student');

				var r = s.responses.find('question.ID == :1', q.ID);

				if(!r){
					r = new ds.Response({
						question: q,
						session: s
					});
				}

				r.response = JSON.stringify(response);
				r.save();

				return true;
			}
		}

		return false;
	};
	methods.respond.scope = 'public';
})();