'use strict';

angular.module('mean.users').controller('UsersController', ['$scope', '$routeParams', '$location', 'Global', 'Users', function ($scope, $routeParams, $location, Global, Users) {
    $scope.global = Global;

    $scope.create = function() {
        var user = new Users({
            title: this.title,
            content: this.content
        });
        user.$save(function(response) {
            $location.path('users/' + response._id);
        });

        this.title = '';
        this.content = '';
    };

    $scope.remove = function(user) {
        if (user) {
            user.$remove();

            for (var i in $scope.users) {
                if ($scope.users[i] === user) {
                    $scope.users.splice(i, 1);
                }
            }
        }
        else {
            $scope.user.$remove();
            $location.path('users');
        }
    };

    $scope.update = function() {
        var user = $scope.user;
        if (!user.updated) {
            user.updated = [];
        }
        user.updated.push(new Date().getTime());

        user.$update(function() {
            $location.path('users/' + user._id);
        });
    };

    $scope.find = function() {
        Users.query(function(users) {
            $scope.users = users;
        });
    };

    $scope.findOne = function() {
        Users.get({
            userId: $routeParams.userId
        }, function(user) {
            $scope.user = user;
        });
    };
}]);