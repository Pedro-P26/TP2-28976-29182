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
        debug:true,
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
let gameStarted = false;
let openingText, gameOverText, playerWonText;




function create(){



  
  openingText = this.add.text(
    this.physics.world.bounds.width / 2,
    this.physics.world.bounds.height / 2,
    'Press SPACE to Start',
    {
      fontFamily: 'Monaco, Courier, monospace',
      fontSize: '90px',
      fill: '#fff'
    },
  );
  
  openingText.setOrigin(0.85);
  
  //-----------------------------//
    player1 = this.physics.add.sprite(
        1250, 
        1600,
        'paddle',

    ).setScale(0.5);
    //player1.setCollideWorldBounds(true);

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
        immovable: true,
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
        immovable: true,
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
        immovable: true,
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

  //Testar com player1 falta player2//
  player1.setCollideWorldBounds(true);
  ball1.setCollideWorldBounds(true);
  ball1.setBounce(1, 1);
  this.physics.world.checkCollision.down = false;


  //Partir bricks//
  // Adiciona colisão entre a bola e os tijolos
  this.physics.add.collider(ball1, verdeBricks, brickCollision, null, this);
  this.physics.add.collider(ball1, roxoBricks, brickCollision, null, this);
  this.physics.add.collider(ball1, azulBricks, brickCollision, null, this);
 

  player1.setImmovable(true);
  this.physics.add.collider(ball1, player1, hitPlayer, null, this);

}
function update(){

    if (!gameStarted && cursor1.space.isDown) {
      gameStarted = true;
      ball1.setVelocityY(-300);
      ball1.setX(player1.x);
      openingText.setVisible(false);  // Oculta o texto inicial
    }

    
    if (cursor1.left.isDown) {
      player1.setVelocityX(-500); // move para a esquerda
    } else if (cursor1.right.isDown) {
      player1.setVelocityX(500); // move para a direita
    } else {
      player1.setVelocityX(0); // para quando nenhuma tecla de movimento é pressionada~

      if (!gameStarted) {
        ball1.setX(player1.x);
      
        if (cursor1.space.isDown) {
          gameStarted = true;
          ball1.setVelocityY(-200);
        }
      }

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

function brickCollision(ball, brick) {
  brick.disableBody(true, true); // Desativa e esconde o tijolo
}

function hitPlayer(ball1, player1) {
  // Increase the velocity of the ball after it bounces
  ball1.setVelocityY(ball1.body.velocity.y - 5);

  let newXVelocity = Math.abs(ball1.body.velocity.x) + 10;
  // If the ball is to the left of the player, ensure the X Velocity is negative
  if (ball1.x < player1.x) {
    ball1.setVelocityX(-newXVelocity);
  } else {
    ball1.setVelocityX(newXVelocity);
  }
}
