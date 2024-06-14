const GameScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function GameScene() {
    Phaser.Scene.call(this, { key: 'GameScene' });
  },

  preload: preload,
  create: create,
  update: update,
});

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 1280,
  height: 720,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [MenuScene, GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('ball', 'assets/ball.png');
  this.load.image('paddle', 'assets/paddle.png');
  this.load.image('blueBrick', 'assets/blueBrick.png');
  this.load.image('greenBrick', 'assets/greenBrick.png');
  this.load.image('purpleBrick', 'assets/purpleBrick.png');
  this.load.image('redBrick', 'assets/redBrick.png');
  this.load.image('orangeBrick', 'assets/orangeBrick.png');
  this.load.image('cyanBrick', 'assets/cyanBrick.png');
  this.load.image('yellowBrick', 'assets/yellowBrick.png');
  this.load.image('darkgreenBrick', 'assets/darkgreenBrick.png');
  this.load.image('greyBrick', 'assets/greyBrick.png');
  this.load.image('brownBrick', 'assets/brownBrick.png');
  this.load.audio('song1', 'assets/audio/song1.mp3');
  this.load.audio('breaksong','assets/audio/breaksong.mp3');
}

let player1, player2, ball1, ball2, cursor1, cursor2;
let gameStarted = false;
let openingText, gameOverText, playerWonText;
let scorePlayer1 = 0;
let scoreTextPlayer1;
let scorePlayer2 = 0;
let scoreTextPlayer2;

function create() {
  let startSound = this.sound.add('song1');
  startSound.play();

  scoreTextPlayer1 = this.add.text(16, 690, 'Player 1 Score: 0', { fontSize: '24px', fill: '#FFF' });
  scoreTextPlayer2 = this.add.text(16, 10, 'Player 2 Score: 0', { fontSize: '24px', fill: '#FFF' });

  openingText = this.add.text(
    this.physics.world.bounds.width / 2,
    this.physics.world.bounds.height / 2,
    'Press SPACE to Start',
    {
      fontFamily: 'Monaco, Courier, monospace',
      fontSize: '40px',
      fill: '#fff',
    },
  );

  openingText.setOrigin(0.5);

  // Player 1
  player1 = this.physics.add.sprite(480, 680, 'paddle').setScale(0.2);
  ball1 = this.physics.add.sprite(480, 640, 'ball').setScale(0.2);

  // Player 2
  player2 = this.physics.add.sprite(800, 680, 'paddle').setScale(0.2);
  ball2 = this.physics.add.sprite(800, 640, 'ball').setScale(0.2);

  const bricksConfig = [
    'blueBrick', 'greenBrick', 'purpleBrick', 'redBrick', 'orangeBrick',
    'cyanBrick', 'yellowBrick', 'darkgreenBrick', 'greyBrick', 'brownBrick'
  ];

  const startX = 80;
  const startY = 50;
  const brickWidth = 100; // largura
  const brickHeight = 16; //altura
  const bricksPerRow = 11; // n de tijolos por fila
  const rows = bricksConfig.length;

  for (let row = 0; row < rows; row++) {
    const brickGroup = this.physics.add.group({
      key: bricksConfig[row],
      repeat: bricksPerRow - 1,
      setXY: { x: startX, y: startY + row * brickHeight * 2, stepX: brickWidth * 1.1 }
    });

    brickGroup.children.iterate(function (brick) {
      brick.setScale(0.28); // Reduzir a escala dos blocos para ajustar o tamanho no campo
      brick.refreshBody();
      brick.body.immovable = true;
    });

    //this.physics.add.collider(ball1, brickGroup, destroyBrick, null, this);
    //this.physics.add.collider(ball2, brickGroup, destroyBrick, null, this);
    this.physics.add.collider(ball1, brickGroup, (ball, brick) => destroyBrick(ball, brick), null, this);
    this.physics.add.collider(ball2, brickGroup, (ball, brick) => destroyBrick(ball, brick), null, this);

  }

  // Adicionar uma propriedade para contar os tijolos
  this.totalBricks = bricksConfig.length * bricksPerRow;

  //meter bordas brancas pra saber os limites do jogo
  const graphics = this.add.graphics();
  graphics.lineStyle(10, 0xffffff, 1);
  graphics.lineBetween(10, 10, 10, 710); // Borda esquerda
  graphics.lineBetween(1270, 10, 1270, 710); // Borda direita
  graphics.lineBetween(10, 10, 1270, 10); // Borda superior

  cursor1 = this.input.keyboard.createCursorKeys();
  cursor2 = this.input.keyboard.addKeys({
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D,
  });

  player1.setCollideWorldBounds(true);
  ball1.setCollideWorldBounds(true);
  ball1.setBounce(1, 1);
  ball1.body.onWorldBounds = true; //colisao com limites (bordas brancas)
  ball1.body.world.on('worldbounds', function(body) {
    if (body.gameObject === ball1) {
      maintainVelocity(ball1);
    }
  });

  player1.setImmovable(true);
  this.physics.add.collider(ball1, player1, hitPlayer, null, this);

  player2.setCollideWorldBounds(true);
  ball2.setCollideWorldBounds(true);
  ball2.setBounce(1, 1);
  ball2.body.onWorldBounds = true; // mesma coisa das colosoes mas pra outra bola
  ball2.body.world.on('worldbounds', function(body) {
    if (body.gameObject === ball2) {
      maintainVelocity(ball2);
    }
  });

  player2.setImmovable(true);
  this.physics.add.collider(ball2, player2, hitPlayer, null, this);

  //codigo pra bola cair no void em biaxo
  this.physics.world.setBoundsCollision(true, true, true, false);
}

function update() {
  if (!gameStarted && cursor1.space.isDown) {
    gameStarted = true;
    ball1.setVelocity(-200, -200);
    ball1.setX(player1.x);
    ball2.setVelocity(200, 200);
    ball2.setX(player2.x);
    openingText.setVisible(false);
  }

  if (cursor1.left.isDown) {
    player1.setVelocityX(-500);
  } else if (cursor1.right.isDown) {
    player1.setVelocityX(500);
  } else {
    player1.setVelocityX(0);
    if (!gameStarted) {
      ball1.setX(player1.x);
      if (cursor1.space.isDown) {
        gameStarted = true;
        ball1.setVelocity(-200, -200);
      }
    }
  }

  if (cursor2.left.isDown) {
    player2.setVelocityX(-500);
  } else if (cursor2.right.isDown) {
    player2.setVelocityX(500);
  } else {
    player2.setVelocityX(0);
    if (!gameStarted) {
      ball2.setX(player2.x);
      if (cursor1.space.isDown) {
        gameStarted = true;
        ball2.setVelocity(200, 200);
      }
    }
  }

  // Verificar se a bola 1 caiu fora do campo de player 1
  if (ball1.y > 720) {
    resetBall(ball1, player1);
  }

  // Verificar se a bola 2 caiu fora do campo de player 2
  if (ball2.y > 720) {
    resetBall(ball2, player2);
  }

  // Checar se o jogo começou e todos os tijolos foram destruídos
  if (gameStarted && this.totalBricks <= 0) {
    // Determine o vencedor com base na pontuação
    if (scorePlayer1 > scorePlayer2) {
      playerWonText = this.add.text(this.physics.world.bounds.width / 2, this.physics.world.bounds.height / 2, 'Player 1 Wins!', {
        fontFamily: 'Monaco, Courier, monospace',
        fontSize: '40px',
        fill: '#fff'
      }).setOrigin(0.5);
    } else if (scorePlayer2 > scorePlayer1) {
      playerWonText = this.add.text(this.physics.world.bounds.width / 2, this.physics.world.bounds.height / 2, 'Player 2 Wins!', {
        fontFamily: 'Monaco, Courier, monospace',
        fontSize: '40px',
        fill: '#fff'
      }).setOrigin(0.5);
    } else {
      playerWonText = this.add.text(this.physics.world.bounds.width / 2, this.physics.world.bounds.height / 2, 'It\'s a Tie!', {
        fontFamily: 'Monaco, Courier, monospace',
        fontSize: '40px',
        fill: '#fff'
      }).setOrigin(0.5);
    }
    gameStarted = false; // Parar o jogo
  }



}

function maintainVelocity(ball) {
  const speed = 300; // velocidades
  const angle = Math.atan2(ball.body.velocity.y, ball.body.velocity.x);
  ball.setVelocity(speed * Math.cos(angle), speed * Math.sin(angle));
}

function destroyBrick(ball, brick) {
  brick.disableBody(true, true);

  this.totalBricks -= 1; // Decrementa o contador de tijolos

  //som ao partir brick
  //this.sound.play('breaksong');

  // aumenta score apos partir bloco
  if (ball === ball1) {
    scorePlayer1 += 10;
    scoreTextPlayer1.setText('Player 1 Score: ' + scorePlayer1);
  } else if (ball === ball2) {
    scorePlayer2 += 10;
    scoreTextPlayer2.setText('Player 2 Score: ' + scorePlayer2);
  }

  // ao uma bola acertar um bloco, esta aumenta a velcoidade
  let currentVelocity = ball.body.velocity;
  ball.setVelocity(currentVelocity.x * 1.1, currentVelocity.y * 1.1);
}

//FUNCOES PARA FAZER AS MECANICAS DA BOLA (CHATGPT)
function hitPlayer(ball, player) {
  // Calcular a posição relativa da bola em relação ao paddle
  let relativeIntersectX = (ball.x - player.x) / player.displayWidth;

  // Definir a velocidade da bola com base na posição de colisão
  const maxBounceAngle = Math.PI / 3; // Ângulo máximo de 60 graus
  let bounceAngle = relativeIntersectX * maxBounceAngle;

  // Aplicar nova velocidade à bola
  const speed = 300;
  ball.setVelocity(speed * Math.sin(bounceAngle), -speed * Math.cos(bounceAngle));
}

function resetBall(ball, player) {
  ball.setVelocity(0);
  ball.setPosition(player.x, player.y - 40); // Colocar a bola acima do jogador
  gameStarted = false;
  openingText.setVisible(true);
}