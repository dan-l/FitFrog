var FitFrog = FitFrog || {};

FitFrog.Game = function(){};

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var client = new WindowsAzure.MobileServiceClient('https://fitfrog.azure-mobile.net/', 'ChoWidsZrtNyUKhAzxAOMpOMieKnoH63');
var highScoreTable = client.getTable('highscore');

var velocity = 0;

FitFrog.Game.prototype = {
    mostRecentObject: null,
    fight: {
        "monster": ["water", "bottle"]
    },
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

        // Monster animation
        game.load.spritesheet('monster', 'assets/dragon_animation.png', 70, 70, 5);

        // Box animation
        game.load.spritesheet('box', 'assets/box_animation.png', 70, 70);

        // Audio
        game.load.audio('jump', 'assets/jump_sound.wav');
        game.load.audio('coinCollect', 'assets/coin_sound.wav');
        game.load.audio('breakBox', 'assets/break_box_sound.wav');

        // Pause button
        this.game.load.image('pause_btn', 'assets/pause_button.png');

        this.running = false;
    },

    create: function() {
        var game = this.game;
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.platforms = this.game.add.group();
        this.monsters = this.game.add.group();
        this.boxes = this.game.add.group();


        // Pause button 
        var w = window.innerWidth - 75;
        var h = 20;
        var pause_button = game.add.button(w,h,'pause_btn', this.pauseButtonOnClick, this, 2, 1, 0);

        // Adding a coin to a coins group

        this.coins = this.game.add.group();

        //  We will enable physics for any object that is created in this group
        this.platforms.enableBody = true;

        // Here we create the ground.
        var ground = this.platforms.create(0, game.world.height - 64, 'ground');

        // Display the frog on the screen
        this.frog = this.game.add.sprite(100, game.world.height - 150, 'frog');
        this.frog.animations.add('walk');

        this.frog.animations.frame = 2;
        // this.frog.animations.play('walk',8,true);

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
        
        this.addOneCoin();

        var username = window.localStorage.getItem("username");
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "", { font: "30px Arial", fill: "#ffffff" }); 
        var that = this;
        highScoreTable.where({ 
           user_name: username
        }).read().done(function(existingItems){
            if (existingItems.length !== 0) {
                that.score = existingItems[0].points;
                that.labelScore.text = that.score;
            }
        });

        // Sounds
        this.jumpSound = game.add.audio('jump');
        this.coinSound = game.add.audio('coinCollect');
        this.boxSound = game.add.audio('breakBox');
    },

    addItem: function() {
        if (SCREEN_WIDTH - 50 > this.lastObject.x && this.lastObject.x > SCREEN_WIDTH - 80)
            return;
        var prob = Math.random();
        // console.log(prob);
        if (prob > 0.9) {
            this.addMonster();
        } else if (prob > 0.7) {
            this.addBox();
        } else {
            this.addOneCoin();
        }
    },

    addMonster: function() {
        var game = this.game;
        var monster = this.monsters.create(SCREEN_WIDTH - 60, SCREEN_HEIGHT - 120, 'monster');
        game.physics.arcade.enable(monster);
        if (this.running) {
            monster.animations.add('idle');
            monster.animations.play('idle', 5, true);    
            monster.body.velocity.x = 1 - velocity; 
        } else {
            monster.body.velocity.x = 0; 
        }

        monster.body.allowGravity = false;        
        monster.checkWorldBounds = true;
        monster.outOfBoundsKill = true;

        this.lastObject = monster;
    },

    addBox: function() {
        var box = this.boxes.create(SCREEN_WIDTH - 60, SCREEN_HEIGHT - 150, 'box');
        this.game.physics.arcade.enable(box);
        box.body.allowGravity = false;
        
        box.checkWorldBounds = true;
        box.outOfBoundsKill = true;

        if (this.running) {
            box.body.velocity.x = 1 - velocity; 
        } else {
            box.body.velocity.x = 0;
        }

        this.lastObject = box;
    },

    addOneCoin: function() {
        var game = this.game;
        var coin = this.coins.create(SCREEN_WIDTH - 60, SCREEN_HEIGHT - 120, 'coin');
        coin.animations.add('idle');
        coin.animations.play('idle', 6, true);
        game.physics.arcade.enable(coin);
        coin.body.allowGravity = false;

        if (this.running) {
            coin.body.velocity.x = 1 - velocity; 
        } else {
            coin.body.velocity.x = 0; 
        }

        // Kill the coin when it's no longer visible
        coin.checkWorldBounds = true;
        coin.outOfBoundsKill = true;

        this.lastObject = coin;
    },

    update: function() {
        var game = this.game;
        //  Collide the player and the stars with the this.platforms
        game.physics.arcade.collide(this.frog, this.platforms);

        //  As we don't need to exchange any velocities or motion we can the 'overlap' check instead of 'collide'
        game.physics.arcade.overlap(this.frog, this.coins, this.hitCoin, null, this);
        game.physics.arcade.overlap(this.frog, this.monsters, this.hitMonster, null, this);
        game.physics.arcade.overlap(this.frog, this.boxes, this.hitBox, null, this);

        // If the frog is out of the world (too high or too low), call the 'restartGame' function
        if (this.frog.inWorld == false)
            this.restartGame();
        if (speed > 2.3 && this.running == false) {
            velocity = (200/3.7)*(speed - 2.3);
            this.startRunning(velocity);
        } else if (speed < 2.3 && this.running == true) {
            this.stopRunning();
        }
    },

    startRunning: function() {
        this.running = true;
        var game = this.game;
        this.frog.animations.frame = 2;
        this.frog.animations.play('walk', 8, true);
        this.coins.forEachAlive(function(c){
            c.body.velocity.x = 1 - velocity;
        }, this);

        this.monsters.forEachAlive(function(m) {
            m.body.velocity.x = 1 - velocity;
            m.animations.play('idle', 5, true);
        }, this);

        this.boxes.forEachAlive(function(b) {
            b.body.velocity.x = 1 - velocity;
        }, this);
        
        this.timer = game.time.events.loop(1000, this.addItem, this); 
    },

    stopRunning: function() {
        this.running = false;
        var game = this.game;
        this.frog.animations.stop('walk', true);        
        this.frog.animations.frame = 2;

        this.coins.forEachAlive(function(c){
            c.body.velocity.x = 0;
        }, this);

        this.monsters.forEachAlive(function(m) {
            m.animations.stop('idle', true);
            m.animations.frame = 0;
            m.body.velocity.x = 0;
        }, this);

        this.boxes.forEachAlive(function(b) {
            b.body.velocity.x = 0;
        }, this);

        game.time.events.remove(this.timer);
    },

    hitCoin: function(a, b) {
        var game = this.game;
        console.log("hit coin");
        
        // If the frog has already hit a pipe, we have nothing to do
        
        // Play coin sound
        this.coinSound.play();
        
        b.kill();
        this.score+=1;
        this.labelScore.text = this.score;
    },

    hitMonster: function(a, b) {
        console.log("HIT MONSTER");
        var game = this.game;

        // Stop timer.
        game.time.events.remove(this.timer);

        alert("FIGHTING!");
        this.fightMonster(b, this.postFightMonster);
    },

    fightMonster: function(b, cb) {
        this.game.paused = true;
        var monster = b.key;
        var weapons = this.fight[monster];
        navigator.camera.getPicture.call(this, function cameraCallback(imageData) {
            Clarifai.run(imageData,
                function(tags) {
                    cb.call(this, b, tags, tags.filter(function(tag) {
                        return weapons.indexOf(tag) > -1;
                    }).length > 0);
                }.bind(this));
        }.bind(this), function error(err) {
            console.log(err);
        }, {
            destinationType: Camera.DestinationType.DATA_URL
        });
    },

    postFightMonster: function(b, tags, victory) {
        if (victory) {
            alert('You win ', tags)
            this.game.paused = false;
            b.kill();
            // Restart timer.
            this.timer = this.game.time.events.loop(1000, this.addItem, this);
            // Go through all the pipes, and stop their movement
            // this.pipes.forEachAlive(function(p){
            //     p.body.velocity.x = 0;
            // }, this);

        } else {
            alert('You lose ', tags);
            this.fightMonster(b, this.postFightMonster)
        }
    },

    hitBox: function(me, box) {
        box.animations.add('boom');
        box.animations.play('boom', 20, false, true);
        box.animations.killOnComplete = true;
        box.animations.currentAnim.onStart.add(function(){this.boxSound.play();}, this);
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

    // Pause button
    pauseButtonOnClick: function() {  
        var username = window.localStorage.getItem("username");
        var score = this.score;
        highScoreTable.where({ 
           user_name: username
        }).read().then(function(existingItems){
            if (existingItems.length === 0) {
                highScoreTable.insert({user_name: username, points: score});
            } else {
                highScoreTable.update({id: existingItems[0].id, points: score});
            }
        });
        this.state.start('Intro');  
    },

    // Restart the game
    restartGame: function() {
        var game = this.game;
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },
};