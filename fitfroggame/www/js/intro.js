var FitFrog = FitFrog || {};

FitFrog.Intro = function(){};

FitFrog.Intro.prototype = {
    preload: function() {
        // Change the background color of the game
        this.game.stage.backgroundColor = '#71c5cf';
        this.game.load.image('btn_play', 'assets/round_playButton.png'); 
        this.game.load.image('btn_restart', 'assets/round_restartButton.png'); 
        this.game.load.image('btn_resume', 'assets/round_resumeButton.png'); 
        this.game.load.image('leader_board_btn', 'assets/trophy-gold.png');
        this.game.load.image('logo', 'assets/logo.png');
    },

    create: function() {
        var game = this.game;
        var centerX = game.world.centerX;
        var centerY = game.world.centerY;
        var w = window.innerWidth - 75;
        var h = 20;

        // this.title = game.add.text(centerX-60, centerY - 25, "FitFrog", { font: "30px Arial", fill: "#ffffff" }); 
        // var titleWidth = this.title.width;
        // this.title.x = centerX - titleWidth/2;
        this.logo = this.game.add.sprite(centerX, centerY - 70, 'logo');
        this.logo.anchor.setTo(0.5);

        var leader_button = game.add.button(w, h, 'leader_board_btn', this.leaderboardOnClick, this, 2, 1, 0);

        if(window.localStorage.getItem("username") == null) {
            //user has not logged in before
            //redirect to new login page
            console.log("This is new user");
            this.input = document.createElement("input");
            this.input.type = "text";
            this.input.placeholder = "Enter your name"
            this.input.addEventListener("keyup",this.keyBoardHideHandler.bind(this));
            this.gameDiv = document.getElementById("game");
            //name of the user
            this.input.style.position = "absolute";
            this.input.id = "user-input-field";
            this.input.style.top = centerY+20 + "px";
            this.input.style.left = centerX/2 + "px";
            this.input.style.width = centerX + "px";
            this.gameDiv.appendChild(this.input); // put it into the DOM        
            var play_button = game.add.button(centerX-45, centerY + 60, 'btn_play', this.actionPlayOnClick, this, 2, 1, 0);

        }
        else {
            //Already run this app before. Recognized user. 
            //redirect to resume page
            console.log("This is returning user");
            var resume_button = game.add.button(centerX-67, centerY + 30, 'btn_resume', this.actionResumeOnClick, this, 2, 1, 0);
            var restart_button = game.add.button(centerX-67, centerY + 90, 'btn_restart', this.actionRestartOnClick, this, 2, 1, 0);
        }
    },

    keyBoardHideHandler: function(e) {
        var theEvent = e || window.event;
        var keyPressed = theEvent.keyCode || theEvent.which;
        if (keyPressed == 13) {
            cordova.plugins.Keyboard.close();
            this.actionPlayOnClick();
        }
    },

    actionPlayOnClick: function() { 
        //TODO: check if user exists on server. If yes, pull info. if not, just start game.
        this.name = document.getElementById('user-input-field').value;  // first element in DOM  (index 0) with name="txtJob"
        this.gameDiv.removeChild(this.input);
        window.localStorage.setItem("username", this.name);
        console.log("this is my name "+this.name);
        this.state.start('Game');  
    },

    actionResumeOnClick: function() {
        //check user in local storage, and grab user info from server. Then go back to game.
        if(window.localStorage.getItem("username") != this.name) {
            //if user info not stored 
            console.log("ERROR STAHP");
            this.state.start('Game');  
        } 
        else {
            //get score from server, assign to score in game, and return to previous game
            this.state.start('Game');  
        }
    },

    actionRestartOnClick: function() {
        //delete user from local storage, and go back to login page
        window.localStorage.removeItem("username");
        this.state.start('Intro');  
    },

    leaderboardOnClick: function() {
        var ref = cordova.InAppBrowser.open('http://fitfrog2.azurewebsites.net/', '_self', 'location=no,zoom=no');
    }
};