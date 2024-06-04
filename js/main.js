const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 640,
    height: 640,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
      preload,
      create,
      update,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: false
      },
    }
  };
  
  // Create the game instance
const game = new Phaser.Game(config);

function preload(){
    this.load.image('ball','assets/ball.png')
    this.load.image('paddle','assets/paddle.png')
    this.load.image('brick1','assets/brick1.png')
    this.load.image('brick2','assets/brick2.png')
    this.load.image('brick3','assets/brick3.png')
    this.load.image('brick11','assets/brick1.png')
    this.load.image('brick22','assets/brick2.png')
    this.load.image('brick33','assets/brick3.png')
}

let player, ball, violetBricks, yellowBricks, redBricks;



function create(){

    player = this.physics.add.sprite(
        700, 
        600,
        'paddle',

    );

    ball = this.physics.add.sprite(
        700, 
        470, 
        'ball' 
      );
   
}
function update(){

}
