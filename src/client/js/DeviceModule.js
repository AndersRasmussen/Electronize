angular.module('deviceModule',['ngRoute','IoC']).config( function($routeProvider){
	$routeProvider.
		when('/', {controller:DeviceController}).
		otherwise({redirectTo:'/'});
});