/**
 * Menu state.
 */
function Menu() {
	Phaser.State.call(this);
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State);
Menu.prototype = proto;

Menu.prototype.preload = function() {
	this.load.pack("start", "assets/assets.json");
		this.load.pack("level1", "assets/assets.json");
};

Menu.prototype.create = function() {
	var background = this.add.image(0, 0, 'background');
	var sprite = this.add.sprite(this.world.centerX, this.world.centerY,
			"button-start-game");
	sprite.scale.setTo(0.5, 0.5);
	sprite.anchor.set(0.5, 0.5);
	this.input.onDown.add(this.startGame, this);
};

Menu.prototype.startGame = function() {
	this.game.state.start("Level1");
};