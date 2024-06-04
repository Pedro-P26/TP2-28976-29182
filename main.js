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

let player1,player2, ball, verdeBricks, roxoBricks, azulBricks;



function create(){

    player = this.physics.add.sprite(
        1250, 
        1640,
        'paddle',

    );

    ball = this.physics.add.sprite(
        1250, 
        1500, 
        'ball' 
      );

    verdeBricks = this.physics.add.group({
        key: 'brick1',
        repeat: 4,
        setXY: {
          x: 240,
          y: 1100,
          stepX: 500
        }
      });
    roxoBricks = this.physics.add.group({
        key: 'brick2',
        repeat: 4,
        setXY: {
          x: 240,
          y: 900,
          stepX: 500
        }
      });

      azulBricks = this.physics.add.group({
        key: 'brick3',
        repeat: 4,
        setXY: {
          x: 240,
          y: 700,
          stepX: 500
        }
      });
      
      
   
}
function update(){

}
