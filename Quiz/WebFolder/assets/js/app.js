'use strict';

(function() {
	var app = angular
		.module('app', [
			'ngRoute',
			'ngSanitize',
			'wakanda'
		]);

	app.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'assets/views/home.html',
				controller: 'HomeCtrl',
				resolve: {
					app: function ($wakanda) {
						return $wakanda.init();
					}
				}
			})
			.when('/:id', {
				templateUrl: 'assets/views/home.html',
				controller: 'HomeCtrl',
				resolve: {
					app: function ($wakanda, $q, $routeParams) {
						return $wakanda.init();
					}
				}
			})
			.when('/:id/quiz', {
				templateUrl: 'assets/views/quiz.html',
				controller: 'QuizCtrl',
				resolve: {
					app: function ($wakanda, $q, $routeParams) {
						return $wakanda.init();
					}
				}
			})
			.when('/:id/finish', {
				templateUrl: 'assets/views/result.html',
				controller: 'ResultCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
	});
})();