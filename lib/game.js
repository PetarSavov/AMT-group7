// Initialize variables used in the game 
var game = new Phaser.Game(1000, 600, Phaser.CANVAS, 'phoenix', { preload: preload, create: create, update: update, render: render });
var background;
var player;
var cursors;
var ground;
var ledge;
var platforms;
var items;
var shipparts;
var catfood;
var HEIGHT=600;
var WIDTH=5000;
var score =0;
var spaceship;


// This function is used to load things beforehand so images are ready when they are needed.
function preload() {

    // Align the gameboard to the center of the screen
    game.scale.pageAlignHorizontally = true;

    // Load the graphics used in the game
    game.load.image('sky','assets/images/sky.png');
    game.load.spritesheet('player','assets/images/bobby.png', 37, 67);
    game.load.image('ground', 'assets/images/earth.png');
    game.load.image('stone', 'assets/images/stone.png');
    game.load.image('catfood', 'assets/images/catfood.png');
    game.load.image('spaceship-body','assets/images/spaceship-body.png');
    game.load.image('spaceship-body2','assets/images/spaceship-body2.png');
    game.load.image('spaceship-but','assets/images/spaceship-but.png');
    game.load.image('spaceship-top','assets/images/spaceship-top.png');
    game.load.image('spaceship-window','assets/images/spaceship-window.png');
    game.load.image('spaceship-wing','assets/images/spaceship-wing.png');
}

function create() {    
    // Calling functions to add everything to the game 
    createWorld();
    createPlayer();
    createItems();
    createScore();

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

        // Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        // Move to the left
        player.body.velocity.x = -150;
        player.animations.play('left');
        background.tilePosition.x +=2; // Make the background move.
    }
    else if (cursors.right.isDown)
    {
        // Move to the right
        player.body.velocity.x = 150;
        player.animations.play('right');
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

    game.physics.arcade.collide(items, shipparts, platforms);
    game.physics.arcade.overlap(player, items, collectItem, null, this);
    game.physics.arcade.overlap(player, shipparts, collectShip, null, this);

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

    createLedge(0, 400, 5);
    createLedge(475, 270,4);

    createSkyLedge();
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

function createSkyLedge(){
    // TODO: 
    //      Create a cloud with a hidden stone behind so you can jump onto the 
    //      cloud (could have a spaceship hidden behind the cloud)
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

function createItems(){
    items = game.add.group();
    items.enableBody = true;

    createCurvedGroup(600,450,10, 50);
    createCurvedGroup(600,200,9,50);
    createSpaceship();

}

function createSpaceship(){
    shipparts = game.add.group();
    shipparts.enableBody = true;
    spaceship = shipparts.create(100,530,'spaceship-wing');
    spaceship = shipparts.create(250,540,'spaceship-but');
    spaceship = shipparts.create(1500, 350, 'spaceship-window');
    spaceship = shipparts.create(2500, 450, 'spaceship-top');
    spaceship = shipparts.create(1234, 520, 'spaceship-body2');
    spaceship = shipparts.create(1750,466, 'spaceship-body');
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

function createScore(){

    // Set up soreText
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000'});
    scoreText.fixedToCamera =true;
}

function collectItem (player, item)
{
    // Removes the star from the screen
    item.kill();

    // Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;
}

function collectShip (player, item)
{
    // Removes the star from the screen
    item.kill();

    // Add and update the score
    score += 50;
    scoreText.text = 'Score: ' + score;
}

function render() {

  //  game.debug.cameraInfo(game.camera, 32, 32);
   // game.debug.spriteCoords(player, 32, 500);

}
