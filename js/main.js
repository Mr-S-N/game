var Main = function(game){

};
var button;
var logo;
var sprite;
var timer;
var music;
var total = 60;
var playm;
var audio ;
var tutorial;
var instruction;
var ok;



Main.prototype = {

	create: function() {

		var me = this;

	playm = me.game.add.audio('playm');
	music = me.game.add.audio('them', 0.5, true);
		me.game.stage.backgroundColor = "34495f";
		me.game.add.tileSprite(0,0,600,1000,'background');
	    logo = me.add.sprite(0,40,'logo');
	tutorial =	me.game.add.button(50 , 500, 'tutorial', me.tutorial, this, 2, 1, 0);
		tutorial.scale.setTo(0.5,0.5);
		button = me.game.add.button(200 , 300, 'play', me.actionOnClick, this, 2, 1, 0);
audio = me.game.add.button(0 , 700, 'mute', me.volume, this, 2, 1, 0);
		sprite = me.add.sprite(100,600,'score');
		sprite.visible =! sprite.visible;
		timer = game.time.create(false);

		timer.loop(1000, me.updateCounter, this);
		music.play();


		
	},
	startGame: function(){
		var me = this;

		me.tileTypes = [
			'blue',
			'green',
			'red',
			'yellow',
			'pink',
			'azure'
		];


		me.score = 0;


		me.activeTile1 = null;
		me.activeTile2 = null;


		me.canMove = false;

		me.tileWidth = me.game.cache.getImage('blue').width;
		me.tileHeight = me.game.cache.getImage('blue').height;


		me.tiles = me.game.add.group();

		me.tileGrid = [
			[null, null, null, null, null, null],
			[null, null, null, null, null, null],
			[null, null, null, null, null, null],
			[null, null, null, null, null, null],
			[null, null, null, null, null, null],
			[null, null, null, null, null, null]
		];


		var seed = Date.now();
		me.random = new Phaser.RandomDataGenerator([seed]);


		me.initTiles();

		me.createScore();

	},

	update: function() {

		var me = this;

		if(me.activeTile1 && !me.activeTile2){


			var hoverX = me.game.input.x;
			var hoverY = me.game.input.y;


			var hoverPosX = Math.floor(hoverX/me.tileWidth);
			var hoverPosY = Math.floor(hoverY/me.tileHeight);


			var difX = (hoverPosX - me.startPosX);
			var difY = (hoverPosY - me.startPosY);


			if(!(hoverPosY > me.tileGrid[0].length - 1 || hoverPosY < 0) && !(hoverPosX > me.tileGrid.length - 1 || hoverPosX < 0)){

				if((Math.abs(difY) == 1 && difX == 0) || (Math.abs(difX) == 1 && difY ==0)){

					me.canMove = false;

					me.activeTile2 = me.tileGrid[hoverPosX][hoverPosY];


					me.swapTiles();


					me.game.time.events.add(500, function(){
						me.checkMatch();
					});
				}

			}

		}

	},


	gameOver: function(){
		var me = this;
		this.game.state.start('GameOver');
		timer.stop();
		me.game.add.tileSprite(0,0,600,1000,'background');
		me.add.sprite(-350,0,'gameover');

	},

	initTiles: function(){

		var me = this;

		for(var i = 0; i < me.tileGrid.length; i++){

			for(var j = 0; j < me.tileGrid.length; j++){

				var tile = me.addTile(i, j);

				me.tileGrid[i][j] = tile;

			}
		}

		me.game.time.events.add(600, function(){
			me.checkMatch();
		});

	},

	addTile: function(x, y){

		var me = this;


		var tileToAdd = me.tileTypes[me.random.integerInRange(0, me.tileTypes.length - 1)];	


		var tile = me.tiles.create((x * me.tileWidth) + me.tileWidth / 2, 0, tileToAdd);


		me.game.add.tween(tile).to({y:y*me.tileHeight+(me.tileHeight/2)}, 500, Phaser.Easing.Linear.In, true)


		tile.anchor.setTo(0.5, 0.5);


		tile.inputEnabled = true;


		tile.tileType = tileToAdd;


		tile.events.onInputDown.add(me.tileDown, me);

		return tile;

	},

	tileDown: function(tile, pointer){

		var me = this;


		if(me.canMove){
			me.activeTile1 = tile;

			me.startPosX = (tile.x - me.tileWidth/2) / me.tileWidth;
			me.startPosY = (tile.y - me.tileHeight/2) / me.tileHeight;
		}

	},

	tileUp: function(){

		//Reset the active tiles
		var me = this;
		me.activeTile1 = null;
		me.activeTile2 = null;

	},

	swapTiles: function(){

		var me = this;


		if(me.activeTile1 && me.activeTile2){

			var tile1Pos = {x:(me.activeTile1.x - me.tileWidth / 2) / me.tileWidth, y:(me.activeTile1.y - me.tileHeight / 2) / me.tileHeight};
			var tile2Pos = {x:(me.activeTile2.x - me.tileWidth / 2) / me.tileWidth, y:(me.activeTile2.y - me.tileHeight / 2) / me.tileHeight};

			//Swap them in our "theoretical" grid
			me.tileGrid[tile1Pos.x][tile1Pos.y] = me.activeTile2;
			me.tileGrid[tile2Pos.x][tile2Pos.y] = me.activeTile1;

			//Actually move them on the screen
			me.game.add.tween(me.activeTile1).to({x:tile2Pos.x * me.tileWidth + (me.tileWidth/2), y:tile2Pos.y * me.tileHeight + (me.tileHeight/2)}, 200, Phaser.Easing.Linear.In, true);
			me.game.add.tween(me.activeTile2).to({x:tile1Pos.x * me.tileWidth + (me.tileWidth/2), y:tile1Pos.y * me.tileHeight + (me.tileHeight/2)}, 200, Phaser.Easing.Linear.In, true);

			me.activeTile1 = me.tileGrid[tile1Pos.x][tile1Pos.y];
			me.activeTile2 = me.tileGrid[tile2Pos.x][tile2Pos.y];

		}

	},

	checkMatch: function(){

		var me = this;


		var matches = me.getMatches(me.tileGrid);


		if(matches.length > 0){


			me.removeTileGroup(matches);


			me.resetTile();


			me.fillTile();


			me.game.time.events.add(500, function(){
				me.tileUp();
			});


			me.game.time.events.add(600, function(){
				me.checkMatch();
			});

		}
		else {


			me.swapTiles();
			me.game.time.events.add(500, function(){
				me.tileUp();
				me.canMove = true;
			});
		}

	},

	getMatches: function(tileGrid){

		var matches = [];
		var groups = [];


		for (var i = 0; i < tileGrid.length; i++)
		{
			var tempArr = tileGrid[i];
			groups = [];
			for (var j = 0; j < tempArr.length; j++)
			{
				if(j < tempArr.length - 2)
					if (tileGrid[i][j] && tileGrid[i][j + 1] && tileGrid[i][j + 2])
					{
						if (tileGrid[i][j].tileType == tileGrid[i][j+1].tileType && tileGrid[i][j+1].tileType == tileGrid[i][j+2].tileType)
						{
							if (groups.length > 0)
							{
								if (groups.indexOf(tileGrid[i][j]) == -1)
								{
									matches.push(groups);
									groups = [];
								}
							}

							if (groups.indexOf(tileGrid[i][j]) == -1)
							{
								groups.push(tileGrid[i][j]);
							}
							if (groups.indexOf(tileGrid[i][j+1]) == -1)
							{
								groups.push(tileGrid[i][j+1]);
							}
							if (groups.indexOf(tileGrid[i][j+2]) == -1)
							{
								groups.push(tileGrid[i][j+2]);
							}
						}
					}
			}
			if(groups.length > 0) matches.push(groups);
		}


		for (j = 0; j < tileGrid.length; j++)
		{
			var tempArr = tileGrid[j];
			groups = [];
			for (i = 0; i < tempArr.length; i++)
			{
				if(i < tempArr.length - 2)
					if (tileGrid[i][j] && tileGrid[i+1][j] && tileGrid[i+2][j])
					{
						if (tileGrid[i][j].tileType == tileGrid[i+1][j].tileType && tileGrid[i+1][j].tileType == tileGrid[i+2][j].tileType)
						{
							if (groups.length > 0)
							{
								if (groups.indexOf(tileGrid[i][j]) == -1)
								{
									matches.push(groups);
									groups = [];
								}
							}

							if (groups.indexOf(tileGrid[i][j]) == -1)
							{
								groups.push(tileGrid[i][j]);
							}
							if (groups.indexOf(tileGrid[i+1][j]) == -1)
							{
								groups.push(tileGrid[i+1][j]);
							}
							if (groups.indexOf(tileGrid[i+2][j]) == -1)
							{
								groups.push(tileGrid[i+2][j]);
							}
						}
					}
			}
			if(groups.length > 0) matches.push(groups);
		}

		return matches;

	},

	removeTileGroup: function(matches){
		
		var me = this;


		for(var i = 0; i < matches.length; i++){
			var tempArr = matches[i];

			for(var j = 0; j < tempArr.length; j++){

				var tile = tempArr[j];
				//Find where this tile lives in the theoretical grid
				var tilePos = me.getTilePos(me.tileGrid, tile);

				//Remove the tile from the screen
				me.tiles.remove(tile);

				//Increase the users score
				me.incrementScore();

				//Remove the tile from the theoretical grid
				if(tilePos.x != -1 && tilePos.y != -1){
					me.tileGrid[tilePos.x][tilePos.y] = null;
				}
				
			}
		}
	},

	getTilePos: function(tileGrid, tile)
	{
		var pos = {x:-1, y:-1};

		//Find the position of a specific tile in the grid
		for(var i = 0; i < tileGrid.length ; i++)
		{
			for(var j = 0; j < tileGrid[i].length; j++)
			{
				//There is a match at this position so return the grid coords
				if(tile == tileGrid[i][j])
				{
					pos.x = i;
					pos.y = j;
					break;
				}
			}
		}

		return pos;
	},

	resetTile: function(){

		var me = this;


		for (var i = 0; i < me.tileGrid.length; i++)
		{


			for (var j = me.tileGrid[i].length - 1; j > 0; j--)
			{


				if(me.tileGrid[i][j] == null && me.tileGrid[i][j-1] != null)
				{

					var tempTile = me.tileGrid[i][j-1];
					me.tileGrid[i][j] = tempTile;
					me.tileGrid[i][j-1] = null;

					me.game.add.tween(tempTile).to({y:(me.tileHeight*j)+(me.tileHeight/2)}, 200, Phaser.Easing.Linear.In, true);

					j = me.tileGrid[i].length;
				}
			}
		}

	},

	fillTile: function(){

		var me = this;


		for(var i = 0; i < me.tileGrid.length; i++){

			for(var j = 0; j < me.tileGrid.length; j++){

				if (me.tileGrid[i][j] == null)
				{
					//Found a blank spot so lets add animate a tile there
					var tile = me.addTile(i, j);


					me.tileGrid[i][j] = tile;
				}

			}
		}

	},

	createScore: function(){

	
		var me = this;
		var scoreFont = "80px Arial";
		me.scoreLabel = me.game.add.text(400, 650, "0", {font: scoreFont, fill: "#fff"});

		me.scoreLabel.anchor.setTo(0.5, 0);
		me.scoreLabel.align = 'center';



	},
	creatTime: function(){


		var me = this;
		var timeFont = "80px Arial";
		me.timeLabel = me.game.add.text(250, 780, "time:60", {font: timeFont, fill: "#fff"});

		me.timeLabel.align = 'center';



	},

	incrementScore: function(){

		var me = this;

		me.score += 10;   
		me.scoreLabel.text = me.score;
		total+=5;



	},
	actionOnClick: function(){
   playm.play();
		var me = this;
		logo.visible =! logo.visible;
		button.visible =! button.visible;
		tutorial.visible =! tutorial.visible;
		sprite.visible =! sprite.visible;
		me.startGame();
		timer.start();
		me.creatTime();







	},
	updateCounter: function(){
		var me = this;
		total--;
		if(total===0 ){
			 me.gameOver();

		}

		me.timeLabel.text = 'time:' + total;

	},
	volume: function(){
		var me = this;
		game.sound.mute = !game.sound.mute ;


	},
	tutorial: function(){
		playm.play();
		var me = this;
		logo.visible =! logo.visible;
	    button.visible =! button.visible;
		tutorial.visible =! tutorial.visible;
		instruction =   me.game.add.text(0, 0, '1)swap donuts so there are 3 same donuts \n   vertically or horizontally ' +
			'\n 2) every destruction of donuts is +5 sec ' +
			'\n 3) if the time is over you lost', {fill : 'black',font : '30px italic'});
	ok = 	me.game.add.button(200 , 300, 'ok', ()=>{
		playm.play();
			instruction.visible =! instruction.visible;
			logo.visible =! logo.visible;
			button.visible =! button.visible;
			tutorial.visible =! tutorial.visible;
			ok.visible = !ok.visible;


		}, this, 2, 1, 0);




	},



};
