angular.module('application',['ngRoute']).config( function($routeProvider){
		$routeProvider.
			when('/', {controller:ScreenController}).
			otherwise({redirectTo:'/'})
	});