var QRCodeController = function($scope, $location) {
	console.log($location);
	if ($location.host() == 'localhost' || $location.host() == '127.0.0.1')
		return;
		
	var url = $location.protocol() + '://' + $location.host() + ":" + $location.port();
	$scope.url = 'http://chart.apis.google.com/chart?chs=310x210&cht=qr&chl=' + url;
}