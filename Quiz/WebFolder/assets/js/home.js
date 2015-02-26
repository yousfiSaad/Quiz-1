'use strict ';

(function() {
	angular
		.module('app')
		.controller('HomeCtrl', ['$scope', '$routeParams', '$wakanda', function($scope, $routeParams, $wakanda) {
			var ds = $wakanda.$ds;

			$scope.start = function (user) {
				var args = [user.fullname];

				if($routeParams.id){
					args.push($routeParams.id);
				}

				var res = ds.Utils.start.apply(ds.Utils, args);
				res.then(function(res){
					if(res){
						location.href = '#/' + res.result.exam.relKey + '/quiz';
					}
				});
			};
		}]);
})();