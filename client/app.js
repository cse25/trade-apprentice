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

	$scope.searchTermExists = false;

	$scope.portfolio = []

	$scope.portfolioTotalValue = 0;

	$scope.getPortfolioTotalValue = function() {
		$scope.portfolioTotalValue = $scope.portfolio.map(function(item) {
			return item.total;
		}).reduce(function(a,b) {
			return a + b;
		})
	};

	$scope.stocksymbol = {
		symbol: ''
	};

	$scope.numShares;

	$scope.portfolioSnapshot = [];

	$scope.takeSnapshot = function() {
		$scope.portfolioSnapshot.push($scope.portfolioTotalValue);
	};

	$scope.checkPortfolioPerformance = function() {
		if ($scope.portfolioSnapshot.length < 2) {
			console.log("0% Gains");
		} else {
			var mostRecentSnapshot = $scope.portfolioSnapshot[$scope.portfolioSnapshot.length -1];
		}
	};

	$scope.getStockPrice = function() {
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
			$scope.searchTermExists = true;
		  }, function errorCallback(response) {
		  	console.log('Error');
		  });
	};

	$scope.buyShares = function() {
		console.log('Buying ' + $scope.numShares + ' Shares of ' + $scope.retrievedData.symbol + ' for $' + ($scope.numShares * $scope.retrievedData.price));
		var purchase = {
			shares: $scope.numShares,
			symbol: $scope.retrievedData.symbol,
			sharePrice: $scope.retrievedData.price,
			total: $scope.numShares * $scope.retrievedData.price
		};
		$scope.portfolio.push(purchase);
		console.log($scope.portfolio);
		$scope.getPortfolioTotalValue();
		$scope.takeSnapshot();
		console.log($scope.portfolioSnapshot);
	};
});