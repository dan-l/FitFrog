var FitFrog = FitFrog || {};
FitFrog.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');

FitFrog.game.state.add('Intro', FitFrog.Intro);  
FitFrog.game.state.add('Game', FitFrog.Game);  
FitFrog.game.state.start('Intro'); 