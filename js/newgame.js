//Create a new game that fills the screen
game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO);

//Add all states
game.state.add("Boot", Boot);
game.state.add("Preload", Preload);

game.state.add("Main", Main);


//Start the first state
game.state.start("Boot");
