"use strict";

angular.module('Player.player', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/player', { templateUrl: './player/player.html', controller: 'PlayerCtrl' })
    }])

    .controller('PlayerCtrl', ['$scope', '$location', function($scope, $location){

        $scope.musicSelected = false;
        $scope.trackName = null;
        $scope.songList = null;

        // Receive the music directory from main.js
        const ipc = require('electron').ipcRenderer;

        ipc.on('modal-file-content', function (event, arg) {
            console.log(arg);
            $scope.songList = arg.files;
            let songsArrayForPlaying = [];

            console.log($scope.songList.length);

            for (let i = 0; i < $scope.songList.length; i++) {
                songsArrayForPlaying.push({
                    title: arg.path + "/" + $scope.songList[i],
                    file: arg.path + "/" + $scope.songList[i],
                    howl: null,
                    name: $scope.songList[i]
                })
            }

            console.log(songsArrayForPlaying);
            $scope.player = new Player(songsArrayForPlaying);
            $scope.musicSelected = true;
            $scope.$apply()
        });
        
        // Play music function
        $scope.playMusic = function () {
            $scope.player.play();
        };

        // Player object
        const Player = function (playList) {
            this.playList = playList;
            this.index = 0;
        };

        Player.prototype = {

            // Player play function
            play: function (index) {
                let self = this;
                console.log(self.playList);
                let sound = null;
                index = typeof index === 'number' ? index : self.index;
                let data = self.playList[index];
                console.log(data);

                $scope.trackName = data.name;

                if (data.howl) {
                    sound = data.howl
                } else {
                    sound = data.howl = new Howl({
                        src: [data.file],
                        html5: true
                    })
                }

                sound.play();
                self.index = index;
            },

            // Player pause function
            pause: function () {
                let self = this;
                let sound = self.playList[self.index].howl;
                sound.pause()
            },

            // Player skip function
            skip: function (direction) {
                let self = this;
                let index = 0;

                if (direction === 'prev') {
                    index = self.index - 1;

                    if (index < 0) {
                        index = self.playList.length - 1;
                    }

                } else {
                    index = self.index + 1;

                    if (index >= self.playList.length) {
                        index = 0;
                    }
                }

                self.skipTo(index);
            },
            
            skipTo: function (index) {
                let self = this;
                if (self.playList[self.index].howl) {
                    self.playList[self.index].howl.stop()
                }
                self.play(index)
            },

            seek: function (time) {
                let self = this;
                let sound = self.playList[self.index].howl;

                if (sound.playing()) {
                    sound.seek(sound.duration() * time)
                }
            }
        }

    }]);