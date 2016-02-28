var FitFrog = FitFrog || {};

FitFrog.Game = function(){};

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

FitFrog.Game.prototype = {
    preload: function() { 
        var game = this.game;
        // Change the background color of the game
        game.stage.backgroundColor = '#71c5cf';

        // Load the bird sprite
        game.load.image('bird', 'assets/bird.png'); 

        // Coin animation
        game.load.spritesheet('coin', 'assets/coin_animation.png', 40, 40);

        // Audio
        game.load.audio('jump', 'assets/jump.wav');  

    },

    create: function() { 
        var game = this.game;
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the bird on the screen
        this.bird = this.game.add.sprite(100, 245, 'bird');

        // Add gravity to the bird to make it fall
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;  

        // Call the 'jump' function when touched
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        game.input.onDown.add(this.jump, this);   
        
        this.timer = game.time.events.loop(1000, this.addOneCoin, this); 

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" }); 

        // Sounds
        this.jumpSound = game.add.audio('jump');  
    },

    addOneCoin: function() { 
        var game = this.game; 
        var coin = this.game.add.sprite(SCREEN_WIDTH - 60, SCREEN_HEIGHT - 60, 'coin');
        coin.animations.add('idle');
        coin.animations.play('idle', 6, true);
        game.physics.arcade.enable(coin);
        coin.body.allowGravity = false;

        // Add velocity to the coin to make it move left
        coin.body.velocity.x = -200; 

        // Kill the coin when it's no longer visible 
        coin.checkWorldBounds = true;
        coin.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {  
        var game = this.game;
        // Add the 6 pipes 
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1) 
                this.addOnePipe(i * 60 + 10, SCREEN_HEIGHT - 60);  
        
        this.score += 1;  
        this.labelScore.text = this.score; 
    },

    update: function() {
        var game = this.game;
        // If the bird is out of the world (too high or too low), call the 'restartGame' function
        if (this.bird.inWorld == false)
            this.restartGame();

        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this); 
    },

    hitPipe: function() { 
        var game = this.game; 
        // If the bird has already hit a pipe, we have nothing to do
        if (this.bird.alive == false)
            return;

        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing
        game.time.events.remove(this.timer);

        // Go through all the pipes, and stop their movement
        this.pipes.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
    },

    // Make the bird jump 
    jump: function() {  
        var game = this.game;
        if (this.bird.alive == false)  
            return; 

        // Play jump sound
        this.jumpSound.play(); 
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;
    },

    // Restart the game
    restartGame: function() { 
        var game = this.game; 
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },
};