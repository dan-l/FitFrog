var FitFrog = FitFrog || {};

FitFrog.Game = function(){};

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

FitFrog.Game.prototype = {
    preload: function() { 
        var game = this.game;
        // Change the background color of the game
        game.stage.backgroundColor = '#71c5cf';

        // Load the ground
        game.load.image('ground', 'assets/platform.png');  

        //Frog animation
        game.load.spritesheet('frog', 'assets/frog_spritesheet.png',74,74,8); 

        //Coin animation
        game.load.spritesheet('coin', 'assets/coin_animation.png', 40, 40);

        // Audio
        game.load.audio('jump', 'assets/jump.wav');  

    },

    create: function() { 
        var game = this.game;
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // Display the frog on the screen        
        this.frog = this.game.add.sprite(100, game.world.height - 150, 'frog');
        this.frog.animations.add('walk');
        this.frog.animations.play('walk',8,true);
        
        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = this.game.add.group();
        // Adding a coin to a coins group
        this.coins = this.game.add.group();
        
        //  We will enable physics for any object that is created in this group
        this.platforms.enableBody = true;

        // Here we create the ground.
        var ground = this.platforms.create(0, game.world.height - 64, 'ground');
        
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(window.innerWidth/400, 2);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;

        //  Add gravity to the frog to make it fall
        game.physics.arcade.enable(this.frog);
        //  Player physics properties. Give the little guy a slight bounce.
        this.frog.body.bounce.y = 0.2;
        this.frog.body.gravity.y = 300;
        this.frog.body.collideWorldBounds = true;
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
        var coin = this.game.add.sprite(SCREEN_WIDTH - 60, SCREEN_HEIGHT - 120, 'coin');
        coin = this.coins.create(SCREEN_WIDTH - 60, SCREEN_HEIGHT - 120, 'coin');
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

    update: function() {
        var game = this.game;
        //  Collide the player and the stars with the this.platforms
        game.physics.arcade.collide(this.frog, this.platforms);

        //  As we don't need to exchange any velocities or motion we can the 'overlap' check instead of 'collide'
        game.physics.arcade.overlap(this.frog, this.coins, this.hitCoin, null, this);

        // If the frog is out of the world (too high or too low), call the 'restartGame' function
        if (this.frog.inWorld == false)
            this.restartGame();
    },

    hitCoin: function(a, b) {
        var game = this.game;
        console.log("hit coin");
        //this.coin.outOfBoundsKill = true;
        // If the frog has already hit a pipe, we have nothing to do
        b.kill();
        this.score+=1;
        this.labelScore.text = this.score;     
    },

    hitPipe: function() { 
        var game = this.game; 
        // If the frog has already hit a pipe, we have nothing to do
        if (this.frog.alive == false)
            return;

        // Set the alive property of the frog to false
        this.frog.alive = false;

        // Prevent new pipes from appearing
        game.time.events.remove(this.timer);

        // Go through all the pipes, and stop their movement
        this.pipes.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
    },

    // Make the frog jump 
    jump: function() {  
        var game = this.game;
        if (this.frog.alive == false)  
            return; 

        // Play jump sound
        this.jumpSound.play(); 

        // Add a vertical velocity to the frog
        this.frog.body.velocity.y = -200;
    },

    // Restart the game
    restartGame: function() { 
        var game = this.game; 
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },
};