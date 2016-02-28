var FitFrog = FitFrog || {};

FitFrog.Intro = function(){};

FitFrog.Intro.prototype = {
    preload: function() {
        // Change the background color of the game
        this.game.stage.backgroundColor = '#71c5cf';
        this.game.load.image('btn_play', 'assets/btn_play.png'); 
    },

    create: function() {
        var game = this.game;
        var centerX = game.world.centerX;
        var centerY = game.world.centerY;
        this.title = game.add.text(centerX, centerY - 20, "FitFrog", { font: "30px Arial", fill: "#ffffff" }); 
        this.input = document.createElement("input");
        this.input.type = "text";
        this.gameDiv = document.getElementById("game");
        //name of the user
        this.input.style.position = "absolute";
        this.input.id = "user-input-field";
        this.input.style.top = centerY+20 + "px";
        this.input.style.left = centerX-30 + "px";
        this.gameDiv.appendChild(this.input); // put it into the DOM        
        var button = game.add.button(centerX, centerY + 50, 'btn_play', this.actionOnClick, this, 2, 1, 0);
    },

    actionOnClick: function() { 
        this.name = document.getElementById('user-input-field').value;  // first element in DOM  (index 0) with name="txtJob"
        this.gameDiv.removeChild(this.input);
        
        if(window.localStorage.getItem("username") != this.name) {
            //user has not logged in before
            window.localStorage.setItem("username", this.name);
            console.log("This is new user "+this.name);
        }
        else {
            //Already run this app before. Recognized user. 
            window.localStorage.setItem("username", this.name);
            console.log("This is existing user "+this.name);
        }
        this.state.start('Game');  
    }
};