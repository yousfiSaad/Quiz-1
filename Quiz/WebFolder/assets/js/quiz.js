'use strict ';

(function() {
	angular
		.module('app')
		.controller('QuizCtrl', ['$q', '$scope', '$wakanda', '$routeParams', function($q, $scope, $wakanda, $routeParams) {
			$scope.time = 0;
			$scope.response = null;
			$scope.current = 0;

			var ds = $wakanda.$ds;
			var interval;

			var questions = $scope.questions = ds.Question.$find({
				filter: 'exam.ID == :1',
				params: [$routeParams.id]
			});

			$scope.questions.$promise.then(function() {
				interval = setInterval(function() {
					$scope.time += 1000;
					$scope.$apply();
				}, 1000);
				
				format();
			});

			var getSavedResponse = function(q){
				return $q(function(resolve, reject){
					ds.Utils.getResponse(q.__KEY)
						.then(function (res) {
							var results = res.result;
							if(results){
								console.log(results);
								resolve(results)
							}
							else{
								reject(res);
							}
						});

				})
			};

			function format() {
				var q = questions[$scope.current];
				$scope.response = null;

				switch (q.type) {
					case 'Q':
					case 'M':
						if (typeof q.options === 'string') {
							q.options = JSON.parse(q.options)
						}
						break;
				}
				getSavedResponse(q)
					.then(function(resp){
						$scope.response = resp;
					});
				$scope.progress = parseInt(100 * ($scope.current + 1) / questions.$totalCount);
				$scope.question = q;
			}

			$scope.next = function next(resp) {
				var q = $scope.question;

				$scope.current++;

				function respond(r){
					ds.Utils.respond(q.__KEY, r).then(function(res){
						if(res.result === false){
							location.href = '#/';
						}
					});
				}

				if(typeof resp !== 'undefined' && resp !== null){
					switch(q.type){
						case 'Q':
						case 'G':
							respond(resp);
							break;
						case 'M':
							var r = [];
							for(var attr in resp){
								if(resp[attr] === true){
									r.push(parseInt(attr));
								}
							}
							respond(r);
							break;
						case 'T':
							respond(resp == '1');
							break;
					}
				}

				if($scope.current === questions.$totalCount){
					ds.Utils.end();
					location.href = '#/' + $routeParams.id + '/finish';
					return;
				}

				switch (true) {
					case $scope.current >= questions.length:
						if ($scope.current < questions.$totalCount) {
							questions.$more().then(format);
						}
						break;
					default:
						format();
						break;
				}
			};

			$scope.previous = function() {
				if ($scope.current > 0) {
					$scope.current = $scope.current - 1;
					format();
				}
			};
		}]);
})();