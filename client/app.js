//create Angular module named 'myApp'
var app = angular.module('myApp', []);

app.controller('FormController', function($scope, $http) {
	$scope.retrievedData = {
		name: null,
		symbol: null,
		price: null,
		timestamp: null,
		open: null,
		high: null,
		low: null
	};

	$scope.state = false;

	$scope.portfolio = []

	$scope.stocksymbol = {
		symbol: ''
	};

	$scope.numShares;

	$scope.inputStockSymbol = function() {
		$http({
		  method: 'GET',
		  url: 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=' + $scope.stocksymbol.symbol + '&callback=myFunction'
		}).then(function successCallback(response) {
			var string = response.data;
			var newString = string.slice(11,-1);
			var dataObject = JSON.parse(newString);
			$scope.retrievedData.name = dataObject.Name;
			$scope.retrievedData.symbol = dataObject.Symbol
			$scope.retrievedData.price = dataObject.LastPrice;
			$scope.retrievedData.timestamp = dataObject.Timestamp;
			$scope.retrievedData.open = dataObject.Open;
			$scope.retrievedData.high = dataObject.High;
			$scope.retrievedData.low = dataObject.Low;
			$scope.state = true;
		  }, function errorCallback(response) {
		  	console.log('Error');
		  });
	};

	$scope.buyShares = function() {
		console.log('Buying ' + $scope.numShares + ' Shares of ' + $scope.retrievedData.symbol + ' for $' + ($scope.numShares * $scope.retrievedData.price));
		var purchase = {
			shares: $scope.numShares,
			symbol: $scope.retrievedData.symbol,
			total: $scope.numShares * $scope.retrievedData.price
		};
		$scope.portfolio.push(purchase);
		console.log($scope.portfolio);
	};
});