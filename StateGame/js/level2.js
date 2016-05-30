//SPACE LEVEL!!!!

function level2() {
	Phaser.State.call(this);
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State);
level2.prototype = proto;

var SWIDTH=1000;
var SHEIGHT=600;


level2.prototype.create = function() {

    // Calling functions to add everything to the game 
    this.createWorld();
};

level2.prototype.createWorld = function(){
	var background = this.add.tileSprite(0, 0, SWIDTH, SHEIGHT, 'back');
    this.world.setBounds(0, 0, SWIDTH, SHEIGHT);
    this.physics.startSystem(Phaser.Physics.ARCADE);

	var style = { font: "65px Arial", fill: "#ffffff", align: "center" };

    var text = this.add.text(this.world.centerX, this.world.centerY, "Welcome to space!\nLevel 2", style);

    text.anchor.set(0.5);


};

level2.prototype.update = function(){
	
}