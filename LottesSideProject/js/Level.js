/**
 * Level state.
 */
function Level() {
	Phaser.State.call(this);
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State);
Level.prototype = proto;

Level.prototype.create = function() {
	this.physics.startSystem(Phaser.Physics.ARCADE);

	this.addWorld();
	this.addItems();
	this.addPlayer();
	this.addClouds();

	cursors = this.input.keyboard.createCursorKeys();

	// Set up soreText
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000'});


};

Level.prototype.update = function(){

		// Collide the player and the stars with the platforms
	this.physics.arcade.collide(player, platforms);

	// Reset the players velocity (movement)
	player.body.velocity.x = 0;

	if (cursors.left.isDown)
	{
		// Move to the left
		player.body.velocity.x = -150;
		player.animations.play('left');
	}
	else if (cursors.right.isDown)
	{
		// Move to the right
		player.body.velocity.x = 150;
		player.animations.play('right');
	}
	else
	{
		// Stand still
		player.animations.stop();
		player.frame = 4;
	}

	// Allow the player to jump if they are touching the ground
	if (cursors.up.isDown && player.body.touching.down)
	{
		player.body.velocity.y = -350;
	}

	this.physics.arcade.collide(items, platforms);
	this.physics.arcade.overlap(player, items, null, this);

}

Level.prototype.addWorld = function(){

	//The background in the game
	this.add.sprite(0, 0, 'sky');

	//This group contains the things that the player can walk on
	platforms = this.add.group();
	platforms.enableBody = true; 	//Physics added to the elements in the platform group

	var earth = platforms.create(0, this.world.height - 49, 'earth');
	earth.body.immovable = true;

	this.addLedge(400, 400, 'stone');
	this.addLedge(450, 400, 'stone');
	this.addLedge(500, 400, 'stone');
	this.addLedge(550, 400, 'stone');
	
};

Level.prototype.addItems = function(){
	items = this.add.group();

	this.createItem(70, 235, 1);
	this.createItem(950, 500, 2);
	this.createItem(700, 50, 3);

	var shippart = items.create(500, 325, 'spaceship-window');


};

Level.prototype.addPlayer = function(){
	player = this.add.sprite(32, this.world.height - 150, 'bobby');
	this.physics.arcade.enable(player);

	player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

};

Level.prototype.addLedge = function(x, y, image){
	var stone = platforms.create(x, y, image);
	stone.body.immovable = true;

}

Level.prototype.addClouds = function(){
	this.addLedge(225, 265, 'stone');
	this.add.sprite(200, 250, 'cloud'); //Secret ledge, walk on clouds :)
}
/*
	Item types: 1 = catfood (currency), 2 = boost, 3 = cookie
*/
Level.prototype.createItem = function(x, y, type){

	if(type == 1){
		var catfood = items.create(x, y, 'catfood')
	}
	else if(type == 2){
		var boost = items.create(x, y, 'firstaid')
	}
	else if(type == 3){
		var cookie = items.create(x, y, 'cookie');
	}
}

Level.prototype.collectItems = function(player, item){

	// Removes the item from the screen


}



Level.prototype.hitMonkey = function() {
	// stop all monkey's movements
	this.tweens.removeAll();

	// rotate monkey
	var twn = this.add.tween(this.monkey);
	twn.to({
		angle : this.monkey.angle + 360
	}, 1000, "Linear", true);

	// scale monkey
	twn = this.add.tween(this.monkey.scale);
	twn.to({
		x : 0.1,
		y : 0.1
	}, 1000, "Linear", true);

	// when tween completes, quit the game
	twn.onComplete.addOnce(this.quitGame, this);
};

Level.prototype.quitGame = function() {
	this.game.state.start("Menu");
};