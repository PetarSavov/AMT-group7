// Initialize variables used in the game 
var game = new Phaser.Game(1000, 600, Phaser.AUTO, 'phoenix', { preload: preload, create: create, update: update, render: render });

var background, player, cursors;
var ground;
var ledge;
var platforms;
var items;
var shipparts;
var catfood;
var teleportFrom;
var teleportTo;
var HEIGHT=600;
var WIDTH=5000;
var score =0;
var spaceship, ship;
var cloud;
var music;
var speedBoosts;
var cookies;
var speed = 150;
var soundIcon;
var textBubble;
var count = 0;
var parts = 6;

// This function is used to load things beforehand so images are ready when they are needed.
function preload() {

    // Align the gameboard to the center of the screen
    game.scale.pageAlignHorizontally = true;

    // Spritesheets used in the game.
    game.load.spritesheet('player','assets/images/bobby.png', 37, 67);
   // game.load.spritesheet('bubble', 'assets/images/bubble-talk-sprite.png', 180, 110);
    game.load.spritesheet('bubble', 'assets/images/bubble-talkTEST.png', 135, 83);
    game.load.spritesheet('teleport', 'assets/images/teleport sprite.png', 124, 112);
    game.load.spritesheet('flying', 'assets/images/spaceship-sprite.png', 136, 201);
    
    // Images used in the game.
    game.load.image('sky','assets/images/sky.png');
    game.load.image('ground', 'assets/images/earth.png');
    game.load.image('stone', 'assets/images/stone.png');
    game.load.image('catfood', 'assets/images/catfood.png');
    game.load.image('spaceship-body','assets/images/spaceship-body.png');
    game.load.image('spaceship-body2','assets/images/spaceship-body2.png');
    game.load.image('spaceship-but','assets/images/spaceship-but.png');
    game.load.image('spaceship-top','assets/images/spaceship-top.png');
    game.load.image('spaceship-window','assets/images/spaceship-window.png');
    game.load.image('spaceship-wing','assets/images/spaceship-wing.png');
    game.load.image('cloud', 'assets/images/cloud.png');
    game.load.image('brokenShip', 'assets/images/spaceship-broken.png');
    game.load.image('spaceship', 'assets/images/spaceship-on-ground.png');
    game.load.image('cookie', 'assets/images/cookie.png');
    game.load.image('mute', 'assets/images/mute.png');
    game.load.image('volume', 'assets/images/volume.png');
  
    // Audio used in the game
  //  game.load.audio('audio', ['assets/audio/Tequila.mp3', 'assets/audio/Tequila.ogg']);
    game.load.audio('audio', 'assets/audio/Tequila.ogg');
}

function create() {    
    // Calling functions to add everything to the game 
    createWorld();
    createBrokenShip(2050, 400);
    createPlayer();
    createTalkBubble();
    createItems();
    createCloudLedges();
    createSpeedBoosts();
    createHUD();

    music = game.add.audio('audio');
    music.play();

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

        if(music.isPlaying == false){
        music.restart();
    }

        // Collide the player with the platforms
    game.physics.arcade.collide(player, platforms);

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        // Move to the left
        player.body.velocity.x = -speed;
        player.animations.play('left');
        var temp= WIDTH-500;
        if(player.x >=500)
        background.tilePosition.x +=2; // Make the background move.
        

    }
    else if (cursors.right.isDown)
    {
        // Move to the right
        player.body.velocity.x = speed;
        player.animations.play('right');
        if(player.x <= 4500 )
        background.tilePosition.x -=2;
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


    // Add collision detection in the game here. 
    game.physics.arcade.collide(items, shipparts, platforms, teleportFrom);
    game.physics.arcade.overlap(player, items, collectItem, null, this);
    game.physics.arcade.overlap(player, shipparts, collectShip, null, this);
    game.physics.arcade.overlap(player, speedBoosts, collectSpeedBoost, null, this);
    game.physics.arcade.overlap(player, brokenShip, talkBubble, null, this);
    game.physics.arcade.overlap(player, teleportFrom, teleportPlayer, null, this);

    if(ship.body.y == 10){
        var temp = game.add.text(2000, 250,'LEVEL COMPLETE');

    }
}

function createWorld(){
    // The background created
    background = game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'sky');
    game.world.setBounds(0, 0, WIDTH, HEIGHT);
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  The platforms group contains the ground and the ledges we can jump on
    //  We will enable physics for any object that is created in this group
    platforms = game.add.group();
    platforms.enableBody = true;

    // Here we create the ground.
    var count= 0;
    for(var i =1; i<=WIDTH/1000;i++){
        ground = platforms.create(count, game.world.height - 49, 'ground');
        ground.body.immovable = true;
        count +=1000;
    }

    /***************************************************************************
     *  Call the createLedge(x, y, stones) here to add ledges to the level     *
     ***************************************************************************/
    createLedge(0, 400, 5);
    createLedge(475, 270, 4);
    createLedge(1100, 450, 3);
    createLedge(1350, 180, 1);
    createLedge(1850, 230, 3);

    createLedge(2350, 345, 4);
    createLedge(2650, 422, 2);
    createLedge(3325, 380, 3);
    createLedge(3500, 210, 3);
    createLedge(3830, 450, 5);
    createLedge(4080, 400, 2);
    createLedge(4380, 350, 1);
    createLedge(4610, 165, 3);


     /***************************************************************************
     * PORTAL HERE    *  the actual portal coordinates are: (4889,300)
     ***************************************************************************/
    createToPortal(1700,0);
    createFromPortal(4889, 300);
    
}

function createCloudLedges(){

    /***************************************************************************
     *  Call the createSkyLedge(x, y) here to add clouds you can jump up on    *
     ***************************************************************************/
    createSkyLedge(175, 175);
    createSkyLedge(1500, 350);
    createSkyLedge(2800, 180); /*** this has the hidden shippart! ***/
    createSkyLedge(4139, 150);
    createSkyLedge(4630, 400);
}

//Function to create a ledge consisting a given number of stones.
// PARAMETERS: 
//      x: Is the x-coordinate of the ledge.
//      y: Is the y-coordinate of the ledge.
//      stones: Are the number of stones the ledge is going to consist of. 
function createLedge(x, y, stones){

    for(var i=1;i<=stones;i++){ 
        ledge = platforms.create(x,y,'stone');
        ledge.body.immovable = true;
        x+=50;
    } 
}

function createSkyLedge(x, y){

    createLedge(x+30, y+14, 1);
    game.add.sprite(x,y, 'cloud'); //Secret ledge, walk on clouds :)
}

function createPlayer(){
    // Adding the player in the game.
    player = game.add.sprite(32, 450, 'player');
    game.physics.arcade.enable(player);

    // Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;


    // Our 2 animations, walking left and right
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    // Setting the camera to follow the player around the map.
    game.camera.follow(player);

}

//assign the portal's coords to the player and teleport him there
function teleportPlayer(player){
 //   if(parts==0){
        player.body.x = teleportTo.children[0].x;
        player.body.y = teleportTo.children[0].y;
   // }
}

//create the portal from where the player will teleport
function createFromPortal(x,y){
    teleportFrom = game.add.group();
    teleportFrom.enableBody=true;
    teleportA=teleportFrom.create(x,y,'teleport');
    teleportA.animations.add('swirl', [0, 1, 2, 3, 4, 5], 2, true);
    teleportA.animations.play('swirl');
//    teleportA.width = 60;
//    teleportA.height = 60; 
}

//create the portal to where the player will be teleported
function createToPortal(x,y){ 
    teleportTo=game.add.group();
    teleportB = teleportTo.create(x, y, 'teleport');
    teleportB.animations.add('swirl', [0, 1, 2, 3, 4, 5], 2, true);
    teleportB.animations.play('swirl');
//    teleportB.width=60;
//    teleportB.height=60;
}

function createBrokenShip(x, y){
    brokenShip = game.add.group();
    brokenShip.enableBody = true;

    ship = brokenShip.create(x, y, 'brokenShip');
}

function createItems(){
    items = game.add.group();
    items.enableBody = true;

    createCurvedGroup(60, 100, 1, 45);
    createCurvedGroup(350, 400, 6, 45);
    createCurvedGroup(600, 200, 9, 40);
    createCurvedGroup(1000, 450, 10, 50);    
    createCurvedGroup(1450, 50, 2, 50);
    createCurvedGroup(1977, 140, 8, 35);
    createCurvedGroup(2877, 400, 6, 50);
    createCurvedGroup(3175, 120, 6, 50);
    createCurvedGroup(4150, 350, 10, 50);
    createCurvedGroup(4800, 100, 3, 35);
    createSpaceship();

}

function createSpeedBoosts(){
    speedBoosts = game.add.group();
    speedBoosts.enableBody = true;

    addSpeedBoost(140, 500);
    addSpeedBoost(1645, 200);
    addSpeedBoost(3595, 500);

}

function createSpaceship(){

    shipparts = game.add.group();
    shipparts.enableBody = true;

    spaceship = shipparts.create(2410, 325,'spaceship-wing');
    spaceship = shipparts.create(2840, 190,'spaceship-but');
    spaceship = shipparts.create(4060, 525, 'spaceship-window');
    spaceship = shipparts.create(3742, 69, 'spaceship-top');
    spaceship = shipparts.create(4180, 12, 'spaceship-body2');
    spaceship = shipparts.create(4960, 525, 'spaceship-body');
}

function addSpeedBoost(x, y){
    cookie = speedBoosts.create(x, y, 'cookie');
}

function createCurvedGroup(x, y, length, spacing){

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
}

function createTalkBubble(){
    textBubble = game.add.sprite(player.x + 500, player.y - 60, 'bubble');
    textBubble.fixedToCamera = true;
    textBubble.visible = false;
    textBubble.animations.add('talk', [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3], 1, false);
    textBubble.animations.add('end', [4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7], 1, false);

}

function createHUD(){

    // Set up scoreText
    scoreText = game.add.text(16, 16, 'Score: ' + score, { fontSize: '24px', fill: '#000'});
    scoreText.fixedToCamera =true;

    soundIcon = game.add.sprite(960, 16, 'volume');
    soundIcon.inputEnabled = true;
    soundIcon.fixedToCamera = true;

    soundIcon.events.onInputDown.add(listener, this);

    partsText = game.add.text(16, 50, 'Remaining parts: ' + parts, {fontSize: '14px'});
    partsText.fixedToCamera = true;
    partsText.visible = false;    
}

function listener () {

    if(music.mute == false){
        music.mute = true;
        soundIcon.loadTexture('mute', 0);    
    } 
    else{
        music.mute = false;
        soundIcon.loadTexture('volume', 0);
    }

    
}

function talkBubble (player, item){
    if(count == 0 && parts !=0){
      textBubble.visible = true;
           partsText.visible = true;     
     textBubble.animations.play('talk');
    game.time.events.add(Phaser.Timer.SECOND * 12, removeBubble, this);
    }
    else if(parts==0 && count !=0){
        textBubble.visible = true;
        partsText.visible = true;
        textBubble.animations.play('end');
        game.time.events.add(Phaser.Timer.SECOND * 12, removeBubble, this);
        ship.loadTexture('spaceship')
    }
    
    count++;
}

function removeBubble(){
    textBubble.visible = false;
    if(parts==0 && count !=0){
  //      game.time.events.add(Phaser.Timer.SECOND * 1, ship.loadTexture('spaceship'), this);
        player.kill();
        ship.loadTexture('flying');

        game.physics.arcade.enable(ship);
        ship.animations.add('liftof',[0, 1, 2], 5, true);
        ship.animations.play('liftof');

        ship.body.velocity.y = -150;
        ship.body.collideWorldBounds = false;

    }

        
}



function collectItem (player, item)
{
    // Removes the star from the screen
    item.kill();

    // Add and update the score
    addToScore(10);
}

function collectShip (player, item)
{
    // Removes the star from the screen
    item.kill();

    // Add and update the score
    addToScore(50);
    parts -= 1;
    partsText.text = 'Remaining parts: ' + parts;

}

function collectSpeedBoost(player, item){
    item.kill();

    //TODO: Add timed speed increase to player!!!

    game.time.events.add(Phaser.Timer.SECOND * 3, normalSpeed, this);
    speed *= 3;
    addToScore(500); 
}

function normalSpeed(){
    speed = 150;
}

function addToScore (amount){
    score += amount;
    scoreText.text = 'Score: ' + score;
}

function render() {

    // game.debug.cameraInfo(game.camera, 32, 32);
  //  game.debug.spriteCoords(player, 32, 500);
  //  game.debug.soundInfo(music, 20, 250);

}
