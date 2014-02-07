'use strict';

//Global service for global variables
angular.module('mean.system').factory('Global', [

    function () {
        var _this = this;
        _this._data = {
            user: window.user,
            authenticated: !! window.user
        };

        return _this._data;
    }
]);

//angular.factory('socket', function ($rootScope) {
//    var socket = io.connect();
//    return {
//        on: function (eventName, callback) {
//            socket.on(eventName, function () {
//                var args = arguments;
//                $rootScope.$apply(function () {
//                    callback.apply(socket, args);
//                });
//            });
//        },
//        emit: function (eventName, data, callback) {
//            socket.emit(eventName, data, function () {
//                var args = arguments;
//                $rootScope.$apply(function () {
//                    if (callback) {
//                        callback.apply(socket, args);
//                    }
//                });
//            });
//        }
//    };
//});