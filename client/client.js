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
        });


    $locationProvider.html5Mode(true);
}]);

app.controller('LoginController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.logIn = function() {
        $http.post('/login', $scope.data).then(function(response){
            console.log(response);
           // $location.path(response.data);//
            $location.path('/choose');
        });
    };
}]);

app.controller('RegisterController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    //$scope.data = {};//
    $scope.submitContact = function() {
        $http.post('/register', $scope.data).then(function(response){
            console.log(response);
            $location.path('/registerConfirm');
        });
    };
}]);

app.controller('ChooseController', ['$scope', '$http', '$location', function($scope, $http, $location) {

}]);

app.controller('SaveController', ['$scope', '$http', '$location', function($scope, $http, $location) {

    $scope.saveLeftover = function() {
        $http.post('/save', $scope.data).then(function(response) {
            console.log(response);
            $location.path('/login');
        });
    };

}]);

//app.factory('CurrentUserService', ['$scope', function($scope) {
//    var user = $scope.data.username;
//
//    console.log("in the factory", user);
//}]);