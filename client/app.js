var app = angular.module('myApp', []);

app.controller('FormController', function($scope, $http) {
	$scope.stockData = {
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

	$scope.updatePortfolioTotalValue = function() {
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

	$scope.viewHistoricPortfolioPerformance = function() {
		//use portfolioSnapshot to make a graph of value
	};

	$scope.getStockData = function() {
		$http({
		  method: 'GET',
		  url: 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=' + $scope.stocksymbol.symbol + '&callback=myFunction'
		}).then(function successCallback(response) {
			var string = response.data;
			var newString = string.slice(11,-1);
			var dataObject = JSON.parse(newString);
			$scope.stockData.name = dataObject.Name;
			$scope.stockData.symbol = dataObject.Symbol
			$scope.stockData.price = dataObject.LastPrice;
			$scope.stockData.timestamp = dataObject.Timestamp;
			$scope.stockData.open = dataObject.Open;
			$scope.stockData.high = dataObject.High;
			$scope.stockData.low = dataObject.Low;
			$scope.searchTermExists = true;
		  }, function errorCallback(response) {
		  	console.log('Error');
		  });
	};

	$scope.buyShares = function() {
		console.log('Buying ' + $scope.numShares + ' Shares of ' + $scope.stockData.symbol + ' for $' + ($scope.numShares * $scope.stockData.price));
		var purchase = {
			shares: $scope.numShares,
			symbol: $scope.stockData.symbol,
			sharePrice: $scope.stockData.price,
			total: $scope.numShares * $scope.stockData.price
		};
		$scope.portfolio.push(purchase);
		console.log($scope.portfolio);
		$scope.updatePortfolioTotalValue();
		$scope.takeSnapshot();
		console.log($scope.portfolioSnapshot);
	};

	$scope.updatePortfolioToMarketValue = function() {
		console.log('Inside updatePortfolioToMarketValue');
		//for each item in portfolio...
		$scope.portfolio = $scope.portfolio.forEach(function(item){
			console.log(item);
			$scope.getStockData();
		})
	}
});