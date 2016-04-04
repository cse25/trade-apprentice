//create Angular module named 'myApp'
var app = angular.module('myApp', []);

app.controller('FormController', function($scope, $http) {
	$scope.retrievedData = {
		symbol: null,
		price: null
	};

	$scope.stocksymbol = {
		symbol: ''
	};

	$scope.inputStockSymbol = function() {
		console.log('inside inputStockSymbol', $scope.stocksymbol)
		// $scope.retrievedData.price = '$100';
		// $scope.retrievedData.symbol = 'APL';
		$http({
		  method: 'GET',
		  url: 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=' + $scope.stocksymbol.symbol + '&callback=myFunction'
		}).then(function successCallback(response) {
			console.log('response', response);
		    // this callback will be called asynchronously
		    // when the response is available
		  }, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
		//http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=GOOG&callback=myFunction
		//when I get info back from get request:
		//display information
		//make get request
		//with promise/callback
		//when data is sent back
		//upon no error
		//assign to retrievedData object
	};
});