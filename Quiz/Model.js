(function () {
	var files = ['utils', 'exam', 'session'];
	files.map(function(f){
		include('Model/' + f + '.js');
	});
})();