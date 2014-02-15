angular.module('application',['ngRoute','IoC']).config( function($routeProvider){
		$routeProvider.
			when('/', {controller:ScreenController}).
			otherwise({redirectTo:'/'});
	});