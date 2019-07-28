var Preload = function(game){};

Preload.prototype = {

    preload: function(){
        this.game.load.image('blue', 'assets/gemBlue.png');
        this.game.load.image('green', 'assets/gemGreen.png');
        this.game.load.image('red', 'assets/gemRed.png');
        this.game.load.image('yellow', 'assets/gemYellow.png');
        this.game.load.image('pink', 'assets/gemPink.png');
        this.game.load.image('azure', 'assets/gemAzure.png');
        this.game.load.image('background', 'assets/background.jpg');
        this.game.load.image('score', 'assets/score.png');
        this.game.load.image('logo', 'assets/logo.png');
        this.game.load.image('play', 'assets/play.png');
        this.game.load.image('ok', 'assets/ok.png');
        this.game.load.image('tutorial', 'assets/tutorial.png');
        this.game.load.image('gameover', 'assets/gameover.png');
        this.game.load.image('again', 'assets/again.png');
        this.game.load.image('mute', 'assets/mute.png');
        this.game.load.audio('them', 'assets/audio/background.mp3');
        this.game.load.audio('playm', 'assets/audio/play.mp3');

    },
    
    create: function(){
        this.game.state.start("Main");
    }
 
}
