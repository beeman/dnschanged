'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global', 'socket',
    function ($scope, Global, socket) {

        $scope.messages = [];

        $scope.global = Global;

        socket.on('init', function (data) {
            $scope.name = data.name;
            $scope.users = data.users;
        });

        socket.on('connect', function () {
            $scope.status = 'online';
            pushMessage('chatroom', 'Connected.');
        });

        socket.on('disconnect', function () {
            $scope.status = 'offline';
            pushMessage('chatroom', 'Disconnected.');
        });

        socket.on('send:message', function (message) {
            console.log('send:message');
            pushMessage(message.user, 'message.text');
//            alert('hoi');
        });

        socket.on('change:name', function (data) {
            changeName(data.oldName, data.newName);
            pushMessage('chatroom', 'User ' + data.oldName + ' is now known as ' + data.newName + '.');
        });

        socket.on('user:join', function (data) {
            $scope.users.push(data.name);
            pushMessage('chatroom', 'User ' + data.name + ' has joined.');
        });

        // add a message to the conversation when a user disconnects or leaves the room
        socket.on('user:left', function (data) {
            pushMessage('chatroom', 'User ' + data.name + ' has left.');
            var i, user;
            for (i = 0; i < $scope.users.length; i++) {
                user = $scope.users[i];
                if (user === data.name) {
                    $scope.users.splice(i, 1);
                    break;
                }
            }
        });

        // Private helpers
        // ===============

        var pushMessage = function (user, text) {
            $scope.messages.push({
                user: user,
                text: text
            });
            showIt('last');
        };
        
        var changeName = function (oldName, newName) {
            // rename user in list of users
            var i;
            for (i = 0; i < $scope.users.length; i++) {
                if ($scope.users[i] === oldName) {
                    $scope.users[i] = newName;
                }
            }
            pushMessage('chatroom', 'User ' + oldName + ' is now known as ' + newName + '.');
        };


        // Methods published to the scope
        // ==============================
        $scope.changeName = function () {
            socket.emit('change:name', {
                name: $scope.newName
            }, function (result) {
                if (!result) {
                    $scope.messages.push({
                        user: 'chatroom',
                        text: 'There was an error changing your name.'
                    });
                } else {
                    changeName($scope.name, $scope.newName);
                    $scope.name = $scope.newName;
                    $scope.newName = '';
                }
            });
        };

        $scope.sendMessage = function () {
            socket.emit('send:message', {
                message: $scope.message
            });

            // add the message to our model locally
            pushMessage($scope.name, $scope.message);

            // clear message box
            $scope.message = '';
        };

    }
]);