// Initialize Phaser
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'game');

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

// Create our 'main' state that will contain the game
var mainState = {

    preload: function() { 
        // Change the background color of the game
        game.stage.backgroundColor = '#71c5cf';

        // Load the ground
        game.load.image('ground', 'assets/platform.png');  

        // Load the frog sprite/animation
        game.load.spritesheet('frog', 'assets/frog_spritesheet.png',74,74,8); 

        // Coin animation
        game.load.spritesheet('coin', 'assets/coin_animation.png', 40, 40);

        // Audio
        game.load.audio('jump', 'assets/jump.wav');  

    },

    create: function() { 
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the frog on the screen        
        this.frog = this.game.add.sprite(100, 400, 'frog');
        this.frog.animations.add('walk');
        this.frog.animations.play('walk',8,true);
        
        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = this.game.add.group();
        
        //  We will enable physics for any object that is created in this group
        this.platforms.enableBody = true;

        // Here we create the ground.
        var ground = this.platforms.create(0, game.world.height - 64, 'ground');
        
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(window.innerWidth/400, 2);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;

        //game.add.sprite(0, 0, 'ground');

        // Add gravity to the frog to make it fall
        game.physics.arcade.enable(this.frog);
          //  Player physics properties. Give the little guy a slight bounce.
        this.frog.body.bounce.y = 0.2;
        this.frog.body.gravity.y = 300;
        this.frog.body.collideWorldBounds = true;

        // Call the 'jump' function when touched
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        game.input.onDown.add(this.jump, this);   
        this.addOneCoin();
        this.timer = game.time.events.loop(1000, this.addOneCoin, this); 

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" }); 

        // Sounds
        this.jumpSound = game.add.audio('jump');  
    },

    addOneCoin: function() {  
        var coin = this.game.add.sprite(SCREEN_WIDTH - 60, SCREEN_HEIGHT - 120, 'coin');
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
        // Add the 6 pipes 
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1) 
                this.addOnePipe(i * 60 + 10, SCREEN_HEIGHT - 60);  
        
        this.score += 1;  
        this.labelScore.text = this.score; 
    },

    update: function() {
        //  Collide the player and the stars with the this.platforms
        this.game.physics.arcade.collide(this.frog, this.platforms);

        // If the frog is out of the world (too high or too low), call the 'restartGame' function
        if (this.frog.inWorld == false)
            this.restartGame();

        game.physics.arcade.overlap(this.frog, this.pipes, this.hitPipe, null, this); 
    },

    hitPipe: function() {  
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
        if (this.frog.alive == false)  
            return; 

        // Play jump sound
        this.jumpSound.play(); 
        // Add a vertical velocity to the frog
        this.frog.body.velocity.y = -350;
    },

    // Restart the game
    restartGame: function() {  
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },
};

// Add and start the 'main' state to start the game
game.state.add('main', mainState);  
game.state.start('main'); 