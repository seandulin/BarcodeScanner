var exampleApp = angular.module('starter', ['ionic', 'ngCordova']).run(function($ionicPlatform) {
    
  $ionicPlatform.ready(function() {

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

exampleApp.config(function ($compileProvider) {
    
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
});

exampleApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            controller: 'MenuController',
            templateUrl: 'templates/app.html'
        })
        .state('app.product', {
            url: '/product',
            views: {
                'menuContent' :{
                  templateUrl: 'templates/product.html',
                  controller: 'ProductController'
                }
            }
        })
        .state('app.coupon', {
            url: '/coupon',
            views: {
                'menuContent' :{
                  templateUrl: 'templates/coupon.html',
                  controller: 'CouponController'
                }
            }
        })
        .state('app.multi', {
            url: '/multi',
            views: {
                'menuContent' :{
                  templateUrl: 'templates/multi.html',
                  controller: 'MultiController'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/product');
    }
]);

exampleApp.controller("ProductController", function($scope, BarcodeService) {
  
    $scope.products = [];
    
    $scope.scanBarcode = function() {
        BarcodeService.scan('product').then(function(products) {
          
          $scope.products = products;
        });
    };
});

exampleApp.controller("CouponController", function($scope, BarcodeService) {
    
    $scope.coupons = [];
    
    $scope.scanBarcode = function() {
        BarcodeService.scan('coupon').then(function(coupons) {
          
          $scope.coupons = coupons;
        });
    };
});

exampleApp.controller("MultiController", function($scope, BarcodeService) {
    
    $scope.items = [];
    
    $scope.scanBarcode = function() {
        BarcodeService.scan('both').then(function(items) {
          
          $scope.items = items;
        });
    };
});

exampleApp.controller("MenuController", function($scope, $state) {
    
    
});

exampleApp.factory('BarcodeService', function($cordovaBarcodeScanner, $q, DataService) {
    var errorLogging = function(error) {
        var errorMessage = "An error happened";
        console.log(errorMessage + " -> " + error);
        return $q.when(errorMessage);
    };
    
  return {
    scan: function(scanType) {
        
      return $cordovaBarcodeScanner.scan().then(function(imageData) {
        
            if(scanType === "product") {
                return DataService.getProductData(imageData.text);
            } else if (scanType === "coupon") {
                return DataService.getCouponData(imageData.text);
            }
            else {
                var products = DataService.getProductData(imageData.text);
                var coupons = DataService.getCouponData(imageData.text);
                return $q.all([products, coupons]).then(function (data) {
                  console.log('done both');
                  return $q.when(data[0].concat(data[1]));
                });
            }
        }, errorLogging);
    }
  };
  
});

exampleApp.factory('DataService', function($q) {
    
    //TODO: add http calls
    
  return {
    getProductData: function(barcodeText) {
        
      var deferred = $q.defer(); 
      setTimeout(function() {
          console.log('done product');
          deferred.resolve([{
             name: "Product 1",
             upc: "12345-67890" 
          }]);
      }, 3000);
      return deferred.promise;
    },
    getCouponData: function(barcodeText) {
        
      var deferred = $q.defer();
      setTimeout(function() {
          console.log('done coupon');
          deferred.resolve([{
             name: "Coupon 1",
             upc: "98765-43210" 
          }]);
      }, 1000); 
      return deferred.promise;
    }
  };
  
});