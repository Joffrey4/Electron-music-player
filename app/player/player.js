"use strict";

angular.module('Player.player', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/player', { templateUrl: './player/player.html', controller: 'PlayerCtrl' })
    }])

    .controller('PlayerCtrl', ['$scope', '$location', function($scope, $location){

        // Receive the music directory from main.js
        $scope.musicSelected = false;
        const ipc = require('electron').ipcRenderer;

        ipc.on('modal-file-content', function (event, arg) {
            console.log(arg);
            $scope.song = new Howl({
                src: arg
            });

            $scope.musicSelected = true;
            $scope.$apply()
        });
        
        // Play music function
        $scope.playMusic = function () {
            $scope.song.play();
        }
    }]);