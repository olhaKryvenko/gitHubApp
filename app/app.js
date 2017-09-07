'use strict';

var app = angular.module('app', ['ngRoute', 'ngMaterial']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'users-view.html',
            controller: 'DataUsersController'
        })
        .when('/user', {
            templateUrl: 'user-view.html',
            controller: 'userViewController'
        })
        .when('/repo', {
            templateUrl: 'repo-view.html',
            controller: 'repoViewController'
        })
});


app.factory('userFactory', function () {
    return {};
});


app.controller('AppCtrl', ['$scope','$location', function ($scope, $location) {
    $scope.$back = function () {
        window.history.back();
    };

    $scope.isNotHome = function() {
        return "/" !== $location.path();
    };

    $scope.topFunction= function (scrollDuration) {
        var scrollStep = -window.scrollY / (scrollDuration / 15),
            scrollInterval = setInterval(function () {
                if (window.scrollY != 0) {
                    window.scrollBy(0, scrollStep);
                }
                else clearInterval(scrollInterval);
            }, 15);
    };

    window.onscroll = function () {
        scrollFunction()
    };

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById("btn-top").style.display = "block";
        } else {
            document.getElementById("btn-top").style.display = "none";
        }
    }

}])
    .controller('DataUsersController', ['$scope', '$http', 'userFactory', function ($scope, $http, userFactory) {
        $scope.userFactory = userFactory;
        $scope.usersData = [];
        var clientId = "9b0d9763583852100acc",
            clientSecret = "22d7a620e5bcb62c65a003f57580aaf0dfa85e44";
        $http.get("https://api.github.com/users")
            .success(function (data) {

                data.forEach(function (user) {
                    $http.get("https://api.github.com/users/" + user.login + "?client_id=" + clientId + "&client_secret=" + clientSecret)
                        .success(function (resp) {
                            $scope.usersData.push(resp);
                        });
                });
            });
        $scope.setUser = function (user) {
            $scope.userFactory.user = user;
        }
    }])
    .controller('userViewController', function ($scope, userFactory, $http) {
        $scope.userFactory = userFactory;
        var repos_url = $scope.userFactory.user.repos_url;

        $http.get(repos_url)
            .success(function (data) {
                $scope.reposData = data;
                console.log($scope.reposData);
            });
        $scope.setRepo = function (repo) {
            $scope.userFactory.repo = repo;
        }
    })
    .controller('repoViewController', function ($scope, userFactory, $http) {
        $scope.userFactory = userFactory;
        console.log($scope.userFactory.repo);

        var branches_url = sliceUrl($scope.userFactory.repo.branches_url),
            commits_url = sliceUrl($scope.userFactory.repo.commits_url);

        $http.get(branches_url)
            .success(function (data) {
                $scope.branchesData = data;
            });

        $http.get(commits_url)
            .success(function (data) {
                $scope.commitsData = data;
                console.log($scope.commitsData);
            });

        function sliceUrl(url) {
            var endUrl = url.indexOf("{");

            return url.slice(0, endUrl);
        }
    });







