// GROUND LEVEL!!!

function Level1() {
	Phaser.State.call(this);
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State);
Level1.prototype = proto;

var background, player, cursors, spaceKey;
var platforms, ledge, ground;
var items, catfood;
var spaceship, shipparts, parts;
var teleportFrom, teleportTo;
var score;
var aliens, ship;
var cloud;
var music;
var cookies, speedBoosts;
var soundIcon;
var textBubble;
var launch;
var count;
var startLives;
var life, lives;
var lifeBoost, lifeBoosts;
var pauseMovement;
var tempBobDead;
var sunglasses, weapons, shooting;
var bullet, bullets, bulletTime;

var speed = 150;
var HEIGHT=600;
var WIDTH=5000;
var alienSpeed = 50;

Level1.prototype.create = function() {

    startLives = 3;
    parts = 6;
    count = 0;
    score =0;
    pauseMovement = false;
    shooting = false;

    // Calling functions to add everything to the game 
    this.createWorld();
    this.createBrokenShip(2050, 400);
    this.createPlayer();
    this.createAlien();
    this.createTalkBubble();
    this.createItems();
 	this.createCloudLedges();
	this.createPortals();
	this.createSpeedBoosts();
    this.createLifeBoost();
    this.createShootBoost();
    this.createBullet();
	this.createHUD();

};

Level1.prototype.createWorld = function(){

    // The background created
    background = this.add.tileSprite(0, 0, WIDTH, HEIGHT, 'sky');
    this.world.setBounds(0, 0, WIDTH, HEIGHT);
    this.physics.startSystem(Phaser.Physics.ARCADE);

    //  The platforms group contains the ground and the ledges we can jump on
    //  We will enable physics for any object that is created in this group
    platforms = this.add.group();
    platforms.enableBody = true;

    // Here we create the ground.
    var count= 0;
    for(var i =1; i<=WIDTH/1000;i++){
        ground = platforms.create(count, this.world.height - 49, 'ground');
        ground.body.immovable = true;
        count +=1000;
    }


    /***************************************************************************
     *  Call the createLedge(x, y, stones) here to add ledges to the level     *
     ***************************************************************************/
    this.createLedge(0, 400, 5);
    this.createLedge(475, 270, 4);
    this.createLedge(1100, 450, 3);
    this.createLedge(1350, 180, 1);
    this.createLedge(1850, 230, 3);

    this.createLedge(2350, 345, 4);
    this.createLedge(2650, 422, 2);
    this.createLedge(3325, 380, 3);
    this.createLedge(3500, 210, 3);
    this.createLedge(3830, 450, 5);
    this.createLedge(4080, 400, 2);
    this.createLedge(4380, 350, 1);
    this.createLedge(4610, 165, 3);
};

Level1.prototype.createLedge = function(x, y, stones){

	for(var i=1;i<=stones;i++){ 
        ledge = platforms.create(x,y,'stone');
        ledge.body.immovable = true;
        x+=50;
    } 
};

Level1.prototype.createBrokenShip = function(x, y){
   	brokenShip = this.add.group();
   	brokenShip.enableBody = true;

    ship = brokenShip.create(x, y, 'brokenShip');
   	ship.enableBody = true;
};

Level1.prototype.createPlayer = function(){
	// Adding the player in the game.
	player = this.add.sprite(32, 450, 'player');
    this.physics.arcade.enable(player);

    // Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;


    // Our 2 animations, walking left and right
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    // Setting the camera to follow the player around the map.
    this.camera.follow(player);
};

Level1.prototype.createAlien = function() {
    aliens = this.add.group();
    alien = this.add.sprite(3825, 396, 'alien');
    aliens.add(alien);
    this.physics.arcade.enable(alien);
    alien.collideWorldBounds = true;
    alien.animations.add('left', [0, 1], 10, true);
    alien.animations.add('right', [3, 4], 10, true);
    aliens.enableBody = true;
    this.patrol();

};

Level1.prototype.patrol = function(){
    alien.body.velocity.x = alienSpeed;
}

Level1.prototype.createTalkBubble = function(){
 	textBubble = this.add.sprite(player.x + 500, player.y - 60, 'bubble');
	textBubble.fixedToCamera = true;
	textBubble.visible = false;
	textBubble.animations.add('talk', [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3], 1, false);
	textBubble.animations.add('end', [4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7], 1, false);
};

Level1.prototype.createItems = function(){
   	items = this.add.group();
   	items.enableBody = true;

    this.createCurvedGroup(60, 100, 1, 45);
    this.createCurvedGroup(350, 400, 6, 45);
    this.createCurvedGroup(600, 200, 9, 40);
    this.createCurvedGroup(1000, 450, 10, 50);    
    this.createCurvedGroup(1450, 50, 2, 50);
    this.createCurvedGroup(1977, 140, 8, 35);
    this.createCurvedGroup(2877, 400, 6, 50);
    this.createCurvedGroup(3175, 120, 6, 50);
    this.createCurvedGroup(4150, 350, 10, 50);
    this.createCurvedGroup(4800, 100, 3, 35);
    this.createSpaceship();
};

Level1.prototype.createCurvedGroup = function(x, y, length, spacing){

    var temp= length/2;
    var ySpacing = 35;

    if(length%2 ==0){
        for(var i =1; i<temp;i++){
            catfood = items.create(x,y,'catfood');
            x += spacing;
            y -= ySpacing;
        }
        for(var i = 1; i <3; i++){
            catfood = items.create(x,y, 'catfood');
            x += spacing;
        }
            y+= ySpacing;
        for(var i = 1; i<temp; i++){
            catfood = items.create(x,y,'catfood');
            x += spacing;
            y += ySpacing;       
        }
    }
    else{
        for(var i =1; i<temp;i++){
            catfood = items.create(x,y,'catfood');
            x += spacing;
            y -= ySpacing;
        }
        for(var i = 1; i <=3; i++){
            catfood = items.create(x,y, 'catfood');
            x += spacing;
        }
            y+= ySpacing;
        for(var i = 1; i<temp; i++){
            catfood = items.create(x,y,'catfood');
            x += spacing;
            y += ySpacing;       
        }
    }
};

Level1.prototype.createSpaceship = function(){

    shipparts = this.add.group();
    shipparts.enableBody = true;

    spaceship = shipparts.create(2410, 325,'spaceship-wing');
    spaceship = shipparts.create(2840, 190,'spaceship-but');
    spaceship = shipparts.create(4060, 525, 'spaceship-window');
    spaceship = shipparts.create(3742, 69, 'spaceship-top');
    spaceship = shipparts.create(4180, 12, 'spaceship-body2');
    spaceship = shipparts.create(4960, 525, 'spaceship-body');
};

Level1.prototype.createCloudLedges = function(){

    /***************************************************************************
     *  Call the createSkyLedge(x, y) here to add clouds you can jump up on    *
     ***************************************************************************/
    this.createSkyLedge(175, 175);
    this.createSkyLedge(1500, 350);
    this.createSkyLedge(2800, 180); /*** this has the hidden shippart! ***/
   	this.createSkyLedge(4139, 150);
    this.createSkyLedge(4630, 400);
};

Level1.prototype.createSkyLedge = function(x, y){
    this.createLedge(x+30, y+14, 1);
    this.add.sprite(x,y, 'cloud'); //Secret ledge, walk on clouds :)
};

Level1.prototype.createPortals = function(){
	this.createToPortal(1700,0);
    this.createFromPortal(4889, 300);
};

//create the portal from where the player will teleport
Level1.prototype.createFromPortal = function(x,y){
    teleportFrom = this.add.group();
    teleportFrom.enableBody=true;
    teleportA=teleportFrom.create(x,y,'teleport');
    teleportA.animations.add('swirl', [0, 1, 2, 3, 4, 5], 2, true);
    teleportA.animations.play('swirl');
};

//create the portal to where the player will be teleported
Level1.prototype.createToPortal = function(x,y){ 
    teleportTo= this.add.group();
    teleportB = teleportTo.create(x, y, 'teleport');
    teleportB.animations.add('swirl', [0, 1, 2, 3, 4, 5], 2, true);
    teleportB.animations.play('swirl');
};

Level1.prototype.createSpeedBoosts = function(){
	speedBoosts = this.add.group();
    speedBoosts.enableBody = true;

    this.addSpeedBoost(140, 500);
    this.addSpeedBoost(1645, 200);
    this.addSpeedBoost(3595, 500);
};

Level1.prototype.addSpeedBoost = function(x, y){
    cookie = speedBoosts.create(x, y, 'cookie');
};

Level1.prototype.createLifeBoost = function(){
    lifeBoosts = this.add.group();
    lifeBoosts.enableBody = true;

    this.addLifeBoost(1365, 155);
//    this.addLifeBoost(0,0);
};

Level1.prototype.addLifeBoost = function(x, y){
    lifeBoost = lifeBoosts.create(x, y, 'life');
};

Level1.prototype.createShootBoost = function(){
    weapons = this.add.group();
    weapons.enableBody = true;

    sunglasses = weapons.create(2685, 20, 'sunglasses');
};

Level1.prototype.createBullet = function(){
    bullets = this.add.group();
    bullets.enableBody = true;

    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(10, 'bullet');
    bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetBullet, this);
    bullets.setAll('checkWorldBounds', true);

};

Level1.prototype.createHUD = function(){

    // Set up scoreText
    scoreText = this.add.text(16, 16, 'Score: ' + score, { fontSize: '24px', fill: '#000'});
    scoreText.fixedToCamera =true;

    // Set up the life HUD
    this.createLifeHUD(startLives);


    // Adds the mute/unmute button to the right upper corner of the screen
    soundIcon = this.add.sprite(960, 16, 'volume');
    soundIcon.inputEnabled = true;
    soundIcon.fixedToCamera = true;

    soundIcon.events.onInputDown.add(this.listener, this);

    partsText = this.add.text(16, 50, 'Remaining parts: ' + parts, {fontSize: '14px'});
    partsText.fixedToCamera = true;
    partsText.visible = false; 
    music = this.add.audio('audio');
    music.play();

    cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
};

Level1.prototype.createLifeHUD = function(startLives){
    var tempY = 500-(32*5)/2;
    lives = this.add.group();


    for(var i = 0; i < startLives; i++){
        life = lives.create(tempY, 16, 'life');
        life.fixedToCamera = true;
        tempY+=32;
    }
    for(var i = 0; i < 5 - startLives; i++){
        life = lives.create(tempY, 16, 'noLife');
        life.fixedToCamera = true;
        tempY+=32;
    }
};

Level1.prototype.listener = function() {

    if(music.mute == false){
        music.mute = true;
        soundIcon.loadTexture('mute', 0);    
    } 
    else{
        music.mute = false;
        soundIcon.loadTexture('volume', 0);
    }
};


Level1.prototype.update = function() {

    if(music.isPlaying == false){
        music.restart();
    }

        // Collide the player with the platforms
    this.physics.arcade.collide(player, platforms);

    player.body.velocity.x = 0;

    if(pauseMovement == false){

        if (cursors.left.isDown){
            // Move to the left
            player.body.velocity.x = -speed;
            player.animations.play('left');
            var temp= WIDTH-500;
            if(player.x >=500)
            background.tilePosition.x +=2; // Make the background move.
        }

        else if (cursors.right.isDown){
            // Move to the right
            player.body.velocity.x = speed;
            player.animations.play('right');
            if(player.x <= 4500 )
            background.tilePosition.x -=2;
        }
        
        else{
            // Stand still
            player.animations.stop();
            player.frame = 4;
        }

        // Allow the player to jump if they are touching the ground
        if (cursors.up.isDown && player.body.touching.down){
            player.body.velocity.y = -350;
        }
    }

    if (alien.body.velocity.x>0 && alien.x>4080-66 || alien.body.velocity.x<0 && alien.x<3825){
        alien.body.velocity.x*=-1;
        
        if(alien.body.velocity.x>0)
            alien.animations.play('right');
        else
            alien.animations.play('left');
    }

    if(shooting == true && this.spaceKey.isDown){
        this.fireBullet();
    }

    // Add collision detection in the game here. 
    this.physics.arcade.collide(items, shipparts, platforms, teleportFrom, aliens, lifeBoosts, weapons);
    this.physics.arcade.overlap(player, items, this.collectItem, null, this);
    this.physics.arcade.overlap(player, shipparts, this.collectShip, null, this);
    this.physics.arcade.overlap(player, speedBoosts, this.collectSpeedBoost, null, this);
    this.physics.arcade.overlap(player, brokenShip, this.talkBubble, null, this);
    this.physics.arcade.overlap(player, teleportFrom, this.teleportPlayer, null, this);
    this.physics.arcade.overlap(player, aliens, this.looseLife, null, this);
    this.physics.arcade.overlap(player, lifeBoosts, this.gainLife, null, this);
    this.physics.arcade.overlap(player, weapons, this.shootingEnabled, null, this);
};

Level1.prototype.addToScore = function(amount){
	score += amount;
    scoreText.text = 'Score: ' + score;
};

Level1.prototype.collectItem = function(player, item){

    // Removes the star from the screen
    item.kill();

    // Add and update the score
    this.addToScore(10);
};

Level1.prototype.collectShip = function(player, item){

    // Removes the item from the screen
    item.kill();

    // Add and update the score
    this.addToScore(50);
    parts -= 1;
    partsText.text = 'Remaining parts: ' + parts;
};

Level1.prototype.collectSpeedBoost = function(player, item){
	item.kill();

    this.time.events.add(Phaser.Timer.SECOND * 4, this.normalSpeed, this);
    speed *= 3;
    this.addToScore(500); 
};

Level1.prototype.normalSpeed = function(){
	speed = 150;
};

Level1.prototype.shootingEnabled = function(player, item){
    player.loadTexture('bobby-shoot');
    shooting = true;
    item.kill();
    this.addToScore(125);


}


Level1.prototype.fireBullet = function() {

    if (this.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(player.x + 6, player.y - 8);
            bullet.body.velocity.x = 300;
            bulletTime = this.time.now + 250;
        }
    }

}

//  Called if the bullet goes out of the screen
Level1.prototype.resetBullet = function(bullet) {

    bullet.kill();

}

Level1.prototype.talkBubble = function(player, item){
    if(count == 0 && parts !=0){
    	textBubble.visible = true;
    	partsText.visible = true;     
     	textBubble.animations.play('talk');
    	textBubble.animations.currentAnim.onComplete.add(this.removeBubble, this);
        count++;
    }
    else if(parts==0 && count !=0){
        textBubble.visible = true;
        partsText.visible = true;
        textBubble.animations.play('end');
        this.time.events.add(Phaser.Timer.SECOND * 9, this.newSpaceship, this);
    }
};

Level1.prototype.removeBubble = function(){
	    textBubble.visible = false;
};

Level1.prototype.newSpaceship = function(){
	ship.loadTexture('spaceship');
    this.time.events.add(Phaser.Timer.SECOND*3, this.spaceshipLiftOff, this);
};

Level1.prototype.spaceshipLiftOff = function(){
	    this.removeBubble();

        player.kill();
        ship.loadTexture('flying');

        this.physics.arcade.enable(ship);
        ship.animations.add('liftof',[0, 1, 2], 5, true);
        ship.animations.play('liftof');
        launch = this.add.audio('launch');
        launch.play();

        ship.body.velocity.y = -50;
        ship.body.collideWorldBounds = false;

        this.time.events.add(Phaser.Timer.SECOND * 9, this.nextLevel, this);      
};

Level1.prototype.teleportPlayer = function(player){
	player.body.x = 1750;
    player.body.y = 0;
};

Level1.prototype.looseLife = function(){
        var tempY = 500-(32*5)/2;
        var temp = 550-18;

        lives.destroy();
        player.body.x -= 300;
        player.body.y = 550-67;
        pauseMovement = true;

        player.kill();

        tempBobDead = this.add.sprite(player.body.x, temp, 'bobby-dead');
              
    lives = this.add.group();
     
     if(startLives > 0)
            startLives--;

    for(var i = 0; i < startLives; i++){
        life = lives.create(tempY, 16, 'life');
        life.fixedToCamera = true;
        tempY+=32;
    }
    for(var i = 0; i < 5 - startLives; i++){
        life = lives.create(tempY, 16, 'noLife');
        life.fixedToCamera = true;
        tempY+=32;
    }

            if (startLives == 0)
            this.time.events.add(Phaser.Timer.SECOND * 3, this.restartLevel, this);
        else
            this.time.events.add(Phaser.Timer.SECOND * 3, this.restartMovement, this);
};

Level1.prototype.gainLife = function(player, item){
    item.kill();

        var tempY = 500-(32*5)/2;

        lives.destroy();

    lives = this.add.group();
     
     if(startLives < 5)
            startLives++;

    for(var i = 0; i < startLives; i++){
        life = lives.create(tempY, 16, 'life');
        life.fixedToCamera = true;
        tempY+=32;
    }
    for(var i = 0; i < 5 - startLives; i++){
        life = lives.create(tempY, 16, 'noLife');
        life.fixedToCamera = true;
        tempY+=32;
    }
};

Level1.prototype.restartMovement = function(){
    tempBobDead.destroy();
    player.reset(player.body.x, 550-67);
    pauseMovement = false;

};

Level1.prototype.restartLevel = function() {
    this.game.state.start("Level1");
};

Level1.prototype.nextLevel = function() {
    music.stop();
    this.game.state.start("level2");
}