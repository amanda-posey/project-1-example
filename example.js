console.log('Super dope game');

// TODO: Create an issue
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
// 800x600 sets the resolution of our game.
var game = new Phaser.Game(config);

function preload ()
// This is where the images and such needed for the game will preload.
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

var platforms;
var cursors;

function create ()
// Game objects live here.
// 400, 300 tells the image where to display on the canvas. This is the center.
{
    this.add.image(400, 300, 'sky');
    
    //This command makes physics not apply to the platforms, as they are static.
    platforms = this.physics.add.staticGroup();

    // The following adds a base "ground" element, and some ledges.
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 200, 'ground');

    // Now we add our player. His name is Dude. 
    player = this.physics.add.sprite(100, 450, 'dude'); //creates sprite called player 100x450 pixels from bottom

    player.setBounce(0.2);
    player.setCollideWorldBounds(true); //so Dude doesn't fall off the map

    //Sprite sheet has 9 frames - these tell the computer which to use during turns.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ {key:'dude', frame: 4} ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end:8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys(); //Phaser uses this to eliminate the need for event listeners.
    // The rest of the instructions for moving will be in the update function.

    this.physics.add.collider(player, platforms); //keeps Dude from falling through the ground. Super important.
}

function update ()
{ // in which I try to explain movement.

    if (cursors.left.isDown) // if the left cursor button is pressed
{
    player.setVelocityX(-160); // Dude moves at 160px/sec on the x axis, to the left.

    player.anims.play('left', true); // This sets which images from the sprite sheet get used, from the Create function
}
else if (cursors.right.isDown) // This statement is the exact opposite of the one for left.
{
    player.setVelocityX(160);

    player.anims.play('right', true);
}
else
{
    player.setVelocityX(0); // This stops Dude when the user releases the key.

    player.anims.play('turn');
}

if (cursors.up.isDown && player.body.touching.down) // If up cursor is pressed AND Dude is on the ground...
{
    player.setVelocityY(-330); // Dude moves 330px/sec upward on his y axis. AKA, he jumps.
}
}