var app = angular.module('myApp', []);

angular.module('angular-app', [
  'ui.materialize'
])

app.controller('FormController', function($scope, $http) {
	//Variable Declarations
	$scope.depositAmount;

	$scope.accountBalance = 0;

	$scope.stocksymbol = {
		symbol: ''
	};

	$scope.numShares;

	$scope.portfolioSnapshot = [];

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

	$scope.portfolio = [];

	$scope.portfolioTotalValue = 0;

	$scope.symbolPricePairs = {};

	//Function Declarations
	$scope.depositToAccount = function() {
		$scope.accountBalance += $scope.depositAmount;
	}

	$scope.updatePortfolioTotalValue = function() {
		$scope.portfolioTotalValue = $scope.portfolio.map(function(item) {
			return item.total;
		}).reduce(function(a,b) {
			return a + b;
		})
	};

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
			console.log('string :', string);
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
		if ($scope.numShares > 0 && $scope.accountBalance > ($scope.stockData.price * $scope.numShares)) {
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
			$scope.accountBalance -= purchase.total;
		} else {
			console.log('Account Balance Too Low');
		}
	};

	$scope.sellShares = function() {
		console.log('Selling ' + $scope.numShares + ' Shares of ' + $scope.stockData.symbol + ' for $' + ($scope.numShares * $scope.stockData.price));
		var sale = {
			shares: -($scope.numShares),
			symbol: $scope.stockData.symbol,
			sharePrice: $scope.stockData.price,
			total: -($scope.numShares * $scope.stockData.price)
		};
		$scope.portfolio.push(sale);
		console.log($scope.portfolio);
		$scope.updatePortfolioTotalValue();
		$scope.takeSnapshot();
		console.log($scope.portfolioSnapshot);
		$scope.accountBalance -= sale.total;
	};

	//NEW FUNCTIONS

	$scope.getSymbolsInPortfolio = function() {
		//Make AJAX calls to API and update Price and Total
		var symbols = [];
		var vm = $scope
		$scope.portfolio.forEach(function(item) {
			symbols.push(item.symbol);
			console.log('symbols: ', symbols);
		})
		symbols.forEach(function(symbol) {
			$scope.getUpdatedStockData(symbol);
		})
		setTimeout(function() {vm.updatePortfolio()},2000);
	};

	$scope.getUpdatedStockData = function(symbol) {
		$http({
		  method: 'GET',
		  url: 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=' + symbol + '&callback=myFunction'
		}).then(function successCallback(response) {
			var string = response.data;
			//console.log('string :', string);
			var newString = string.slice(11,-1);
			var dataObject = JSON.parse(newString);
			//console.log('dataObject.LastPrice: ', dataObject.LastPrice);
			$scope.symbolPricePairs[symbol] = dataObject.LastPrice;			
			console.log('$scope.symbolPricePairs: ', $scope.symbolPricePairs);
			// $scope.updatedPrices.push(dataObject.LastPrice);
			// console.log($scope.updatedPrices);
		  }, function errorCallback(response) {
		  	console.log('Error');
		  });
	};

	$scope.updatePortfolio = function() {
		console.log('$scope.symbolPricePairs inside updatePortfolio', $scope.symbolPricePairs);
		for (var i = 0; i < $scope.portfolio.length; i++) {

			console.log('$scope.symbolPricePairs', $scope.symbolPricePairs);
			console.log('$scope.portfolio',$scope.portfolio[i])
			$scope.portfolio[i].price = $scope.symbolPricePairs[$scope.portfolio[i].symbol];
		}
		console.log('$scope.portfolio updated', $scope.portfolio);
	}
});