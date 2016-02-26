var app = angular.module('routeApp', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'RegisterController'
        })
        .when('/registerConfirm', {
            templateUrl: 'views/registerConfirm.html',
            controller: 'LoginController'
        })
        .when('/choose', {
            templateUrl: 'views/choose.html',
            controller: 'ChooseController'
        })
        .when('/save', {
            templateUrl: 'views/save.html',
            controller: 'SaveController'
        })
        .when('/show', {
            templateUrl: 'views/show.html',
            controller: 'ShowController'
        })
        .when('/delete', {
            controller: 'DeleteController'
        });
    $locationProvider.html5Mode(true);
}]);

app.controller('LoginController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.logIn = function() {
        $http.post('/login', $scope.data).then(function(response){
            console.log(response);
            if (response.data == "success") {
                $location.path('/choose');
            }
        });
    };
}]);

app.controller('RegisterController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.submitContact = function() {
        $http.post('/register', $scope.data).then(function(response){
            console.log(response);
            $location.path('/registerConfirm');
        });
    };
}]);

app.controller('ChooseController', ['$scope', function($scope) {
    //Use for choose route\\
}]);

app.controller('SaveController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.saveLeftover = function() {
        $http.post('/save', $scope.data).then(function(response) {
            console.log(response);
            $location.path('/choose');
        });
    };
}]);

app.controller('ShowController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    function showLeftovers() {
        $http.get('/show').then(function(response) {
            $scope.leftovers = response.data;
            $scope.foodItem = response.data.foodItem;
            $scope.entryDate = response.data.entryDate;
            $location.path('/show');
        });
    }
    showLeftovers();

    $scope.toDelete = function(leftover) {
        console.log("testing delete function", leftover);
        $http.delete('/delete', leftover).then(function(response) {
        });
    };
}]);

  //(((((((((((((((((((((((((((()))))))))))))))))))))))))))\\
  //right now delete functionality is in the show controller\\
  //(((((((((((((((((((((((((((())))))))))))))))))))))))))))\\
// app.controller('DeleteController', ['$scope', '$http', '$location', function($scope, $http, $location) {
//     $scope.toDelete = function() {
//         console.log("testing the delete function");
//     };
//     $scope.toDelete = function() {
//        $http.delete('/delete', $scope.data).then(function(response) {
//            console.log($scope.data);
//            console.log('in delete controller', response);
//        });
//     };
//
// }]);

//app.controller('ContactController', ['$scope', '$http', '$location', function($scope, $http, $location) {
//
//    function showLeftovers() {
//        $http.get('/contact').then(function(response) {
//            console.log("in contact controller", response);
//            $scope.leftovers = response.data;
//            $scope.foodItem = response.data.foodItem;
//            $scope.entryDate = response.data.entryDate;
//            $location.path('/show');
//
//        });
//    };
//    showLeftovers();
//}]);
