const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 2500,
    height: 1700,
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

let player1,player2, ball1,ball2, verdeBricks, roxoBricks, azulBricks, cursor1,cursor2;



function create(){
  
  //-----------------------------//
    player1 = this.physics.add.sprite(
        1250, 
        1600,
        'paddle',

    ).setScale(0.5);
    player1.setCollideWorldBounds(true);

    ball1 = this.physics.add.sprite(
        1250, 
        1500, 
        'ball' 
      ).setScale(0.5);
  //---------------------------//

    player2 = this.physics.add.sprite(
        1260,
        85,
        'paddle',

    ).setScale(0.5);

    ball2 = this.physics.add.sprite(
      1250, 
      180, 
      'ball' 
    ).setScale(0.5);

  //-----------------------------//

    verdeBricks = this.physics.add.group({
        key: 'brick1',
        repeat: 4,
        setXY: {
          x: 500,
          y: 1100,
          stepX: 350
        }
      }).children.iterate(function (brick) {
        brick.setScale(0.5); 
    });

    roxoBricks = this.physics.add.group({
        key: 'brick2',
        repeat: 4,
        setXY: {
          x: 500,
          y: 1000,
          stepX: 350
        }
      }).children.iterate(function (brick) {
        brick.setScale(0.5); 
    });

      azulBricks = this.physics.add.group({
        key: 'brick3',
        repeat: 4,
        setXY: {
          x: 500,
          y: 900,
          stepX: 350
        }
      }).children.iterate(function (brick) {
        brick.setScale(0.5); 
    });
      
    //_---------------------------------------//

    
 

  cursor1 = this.input.keyboard.createCursorKeys();
  cursor2 = this.input.keyboard.addKeys({
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D
  });
   
}
function update(){

    if (cursor1.left.isDown) {
      player1.setVelocityX(-500); // move para a esquerda
    } else if (cursor1.right.isDown) {
      player1.setVelocityX(500); // move para a direita
    } else {
      player1.setVelocityX(0); // para quando nenhuma tecla de movimento é pressionada
    }


    if (cursor2.left.isDown) {
      player2.setVelocityX(-500); // Move para a esquerda
    } else if (cursor2.right.isDown) {
      player2.setVelocityX(500); // Move para a direita
    } else {
      player2.setVelocityX(0); // Para quando nenhuma tecla é pressionada
    }
  

}

//-----------------Se a bola cair termina--------------//
function isGameOverPlayer1(world) {
  return ball1.body.y > world.bounds.height;
}

function isGameOverPlayer2(world) {
  return ball2.body.y > world.bounds.height;
}

//----------------------------------//

function isWon() {
  return verdeBricks.countActive() + roxoBricks.countActive() + azulBricksBricks.countActive() == 0;
}
