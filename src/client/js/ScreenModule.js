angular.module('screenModule',['ngRoute','IoC']).config( function($routeProvider){
		$routeProvider.
			when('/', {controller:ScreenController}).
			otherwise({redirectTo:'/'});
	});