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
			console.log('response.data :', response.data);
			var string = response.data;
			var newString = string.slice(11,-1);
			console.log('newString: ', newString);
			var dataObject = JSON.parse(newString);
			console.log('parsedString: ', dataObject);
			console.log('dataObject.Name: ', dataObject.Name);
			console.log('dataObject.LastPrice: ', dataObject.LastPrice);
			$scope.retrievedData.symbol = dataObject.Name;
			$scope.retrievedData.price = dataObject.LastPrice;
			// console.log('retrievedData.symbol: ', retrievedData.symbol);
			// console.log('retrievedData.price: ', retrievedData.price);
		    
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