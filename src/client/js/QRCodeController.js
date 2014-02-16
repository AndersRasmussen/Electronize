var QRCodeController = function($scope, $location) {
	if ($location.host() == 'localhost' || $location.host() == '127.0.0.1')
		return;
	$scope.url = 'http://chart.apis.google.com/chart?chs=369x369&cht=qr&chl=' + $location.absUrl();
}