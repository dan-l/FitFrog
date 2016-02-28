var FitFrog = FitFrog || {};

FitFrog.Intro = function(){};

FitFrog.Intro.prototype = {
    preload: function() {
        // Change the background color of the game
        this.game.stage.backgroundColor = '#71c5cf';
        this.game.load.image('btn_play', 'assets/btn_play.png'); 
        this.game.load.image('leader_board_btn', 'assets/trophy-gold.png');
    },

    create: function() {
        var game = this.game;
        var centerX = game.world.centerX;
        var centerY = game.world.centerY;
        var w = window.innerWidth - 75;
        var h = 20;
        this.title = game.add.text(centerX, centerY - 20, "FitFrog", { font: "30px Arial", fill: "#ffffff" }); 
        var button = game.add.button(centerX, centerY + 20, 'btn_play', this.actionOnClick, this, 2, 1, 0);
        var leader_button = game.add.button(w, h, 'leader_board_btn', this.leaderboardOnClick, this, 2, 1, 0);
    },

    actionOnClick: function() {
        this.state.start('Game');  
    },

    leaderboardOnClick: function() {
        var ref = cordova.InAppBrowser.open('http://fitfrog2.azurewebsites.net/', '_blank', 'location=no');
    }

};