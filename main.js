// Definição da cena do jogo
const GameScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function GameScene() {
    Phaser.Scene.call(this, { key: 'GameScene' });
  },

  preload: preload,
  create: create,
  update: update,
});

// Configuração do jogo
const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 1280,
  height: 720,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [MenuScene, GameScene, ControllersScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
};

const game = new Phaser.Game(config);

// Função de pré-carregamento dos recursos
function preload() {
  this.load.image('ball', 'assets/ball.png'); // Carrega a imagem da bola
  this.load.image('paddle', 'assets/paddle.png'); // Carrega a imagem do paddle
  this.load.image('blueBrick', 'assets/blueBrick.png'); // Carrega a imagem do tijolo azul
  this.load.image('greenBrick', 'assets/greenBrick.png'); // Carrega a imagem do tijolo verde
  this.load.image('purpleBrick', 'assets/purpleBrick.png'); // Carrega a imagem do tijolo roxo
  this.load.image('redBrick', 'assets/redBrick.png'); // Carrega a imagem do tijolo vermelho
  this.load.image('orangeBrick', 'assets/orangeBrick.png'); // Carrega a imagem do tijolo laranja
  this.load.image('cyanBrick', 'assets/cyanBrick.png'); // Carrega a imagem do tijolo ciano
  this.load.image('yellowBrick', 'assets/yellowBrick.png'); // Carrega a imagem do tijolo amarelo
  this.load.image('darkgreenBrick', 'assets/darkgreenBrick.png'); // Carrega a imagem do tijolo verde escuro
  this.load.image('greyBrick', 'assets/greyBrick.png'); // Carrega a imagem do tijolo cinza
  this.load.image('brownBrick', 'assets/brownBrick.png'); // Carrega a imagem do tijolo castanho
  this.load.image('heart', 'assets/simboloVida.png'); // Carrega a imagem do coração (vidas)
  this.load.image('power', 'assets/poder.png'); // Carrega a imagem do poder
  this.load.audio('song1', 'assets/audio/song1.mp3'); // Carrega a música 1
  this.load.audio('breaksong', 'assets/audio/breaksong.mp3'); // Carrega a música de quebra
}

// Variáveis do jogo
let player1, player2, ball1, ball2, cursor1, cursor2;
let gameStarted = false;
let openingText;
let scorePlayer1 = 0;
let scoreTextPlayer1;
let scorePlayer2 = 0;
let scoreTextPlayer2;
let timeElapsed = 0;
let timeText;
let timerEvent;
let heartsPlayer1 = [];
let heartsPlayer2 = [];
let powers;
let doublePointsPlayer1 = false;
let doublePointsPlayer2 = false;
let slowBallPlayer1 = false;
let slowBallPlayer2 = false;
let reverseControlsPlayer1 = false;
let reverseControlsPlayer2 = false;
let speedUpPlayer1 = false;
let speedUpPlayer2 = false;
let powerTextPlayer1;
let powerTextPlayer2;
let powerTimerPlayer1;
let powerTimerPlayer2;

// Função de criação do jogo
function create() {
  resetGame(); // Reseta o jogo

  //let startSound = this.sound.add('song1'); // Adiciona a música inicial
  //startSound.play(); // Toca a música inicial

  // Adiciona o texto de pontuação dos jogadores
  scoreTextPlayer1 = this.add.text(16, 690, 'Player 1 Score: 0', { fontSize: '24px', fill: '#FFF' });
  scoreTextPlayer2 = this.add.text(1000, 690, 'Player 2 Score: 0', { fontSize: '24px', fill: '#FFF' });

  // Adiciona o texto do tempo
  timeText = this.add.text(16, 10, 'Time: 0s', { fontSize: '24px', fill: '#FFF' });

  // Adiciona o texto de abertura
  openingText = this.add.text(
    this.physics.world.bounds.width / 2,
    this.physics.world.bounds.height / 2 + 23,
    'Press SPACE to Start',
    {
      fontFamily: 'Monaco, Courier, monospace',
      fontSize: '40px',
      fill: '#fff',
    },
  );

  openingText.setOrigin(0.5);

  // Jogador 1
  player1 = this.physics.add.sprite(480, 680, 'paddle').setScale(0.2);
  ball1 = this.physics.add.sprite(480, 640, 'ball').setScale(0.2);
  ball1.setTint(0xff0000); // Muda a cor da bola 1 para vermelho
  player1.setTint(0xff0000); // Muda a cor do paddle 1 para vermelho

  // Jogador 2
  player2 = this.physics.add.sprite(800, 680, 'paddle').setScale(0.2);
  ball2 = this.physics.add.sprite(800, 640, 'ball').setScale(0.2);
  ball2.setTint(0x0000ff); // Muda a cor da bola 2 para azul
  player2.setTint(0x0000ff); // Muda a cor do paddle 2 para azul

  // Configuração dos tijolos
  const bricksConfig = [
    'blueBrick', 'greenBrick', 'purpleBrick', 'redBrick', 'orangeBrick',
    'cyanBrick', 'yellowBrick', 'darkgreenBrick', 'greyBrick', 'brownBrick'
  ];

  const startX = 80;
  const startY = 50;
  const brickWidth = 100;
  const brickHeight = 16;
  const bricksPerRow = 11;
  const rows = bricksConfig.length;

  for (let row = 0; row < rows; row++) {
    const brickGroup = this.physics.add.group({
      key: bricksConfig[row],
      repeat: bricksPerRow - 1,
      setXY: { x: startX, y: startY + row * brickHeight * 2, stepX: brickWidth * 1.1 }
    });

    brickGroup.children.iterate(function (brick) {
      brick.setScale(0.28); // Reduz a escala dos tijolos para caber no campo
      brick.refreshBody();
      brick.body.immovable = true; // Torna os tijolos imóveis
    });

    // Adiciona colisões entre as bolas e os tijolos
    this.physics.add.collider(ball1, brickGroup, destroyBrick, null, this);
    this.physics.add.collider(ball2, brickGroup, destroyBrick, null, this);
  }

  this.totalBricks = bricksConfig.length * bricksPerRow; // Conta o total de tijolos

  // Adiciona bordas brancas para os limites do jogo
  const graphics = this.add.graphics();
  graphics.lineStyle(10, 0xffffff, 1);
  graphics.lineBetween(10, 10, 10, 710); // Borda esquerda
  graphics.lineBetween(1270, 10, 1270, 710); // Borda direita
  graphics.lineBetween(10, 10, 1270, 10); // Borda superior

  // Controles dos jogadores
  cursor1 = this.input.keyboard.createCursorKeys();
  cursor2 = this.input.keyboard.addKeys({
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D,
  });

  player1.setCollideWorldBounds(true);
  ball1.setCollideWorldBounds(true);
  ball1.setBounce(1, 1);
  ball1.body.onWorldBounds = true;
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
  ball2.body.onWorldBounds = true;
  ball2.body.world.on('worldbounds', function(body) {
    if (body.gameObject === ball2) {
      maintainVelocity(ball2);
    }
  });

  player2.setImmovable(true);
  this.physics.add.collider(ball2, player2, hitPlayer, null, this);

  this.physics.world.setBoundsCollision(true, true, true, false);

  // Evento do temporizador
  timerEvent = this.time.addEvent({
    delay: 1000, // 1 segundo
    callback: updateTimer,
    callbackScope: this,
    loop: true
  });

  addHearts.call(this); // Adiciona os corações (vidas)

  // Grupo de poderes
  powers = this.physics.add.group();
  this.physics.add.collider(powers, player1, collectPower, null, this);
  this.physics.add.collider(powers, player2, collectPower, null, this);

  // Mensagens de poder ativado
  powerTextPlayer1 = this.add.text(50, 600, '', { fontSize: '24px', fill: '#FFF' });
  powerTextPlayer2 = this.add.text(1100, 600, '', { fontSize: '24px', fill: '#FFF' });
}

// Função de atualização do jogo
function update() {
  if (!gameStarted && cursor1.space.isDown) {
    gameStarted = true;
    ball1.setVelocity(-200, -200);
    ball1.setX(player1.x);
    ball2.setVelocity(200, 200);
    ball2.setX(player2.x);
    openingText.setVisible(false);
    timeElapsed = 0;
    timeText.setText('Time: 0s');
  }

  if (gameStarted) {
    if (reverseControlsPlayer1) {
      if (cursor1.left.isDown) {
        player1.setVelocityX(500);
      } else if (cursor1.right.isDown) {
        player1.setVelocityX(-500);
      } else {
        player1.setVelocityX(0);
      }
    } else {
      if (cursor1.left.isDown) {
        player1.setVelocityX(-500);
      } else if (cursor1.right.isDown) {
        player1.setVelocityX(500);
      } else {
        player1.setVelocityX(0);
      }
    }

    if (reverseControlsPlayer2) {
      if (cursor2.left.isDown) {
        player2.setVelocityX(500);
      } else if (cursor2.right.isDown) {
        player2.setVelocityX(-500);
      } else {
        player2.setVelocityX(0);
      }
    } else {
      if (cursor2.left.isDown) {
        player2.setVelocityX(-500);
      } else if (cursor2.right.isDown) {
        player2.setVelocityX(500);
      } else {
        player2.setVelocityX(0);
      }
    }
  }

  if (ball1.y > 720) {
    livesPlayer1--;
    updateLives();
    if (livesPlayer1 <= 0) {
      this.registry.set('winner', 'Player 2 Wins!');
      resetGame();
      this.scene.start('MenuScene');
    } else {
      resetBall(ball1, player1);
    }
  }

  if (ball2.y > 720) {
    livesPlayer2--;
    updateLives();
    if (livesPlayer2 <= 0) {
      this.registry.set('winner', 'Player 1 Wins!');
      resetGame();
      this.scene.start('MenuScene');
    } else {
      resetBall(ball2, player2);
    }
  }

  if (gameStarted && this.totalBricks <= 0) {
    resetGame();
    this.scene.start('MenuScene');
  }

  powers.children.iterate(function(power) {
    if (power.y > 720) {
      power.destroy();
    }
  });
}

// Mantém a velocidade da bola
function maintainVelocity(ball) {
  const baseSpeed = (slowBallPlayer1 && ball === ball1) || (slowBallPlayer2 && ball === ball2) ? 150 : 300;
  const speed = (speedUpPlayer1 && ball === ball1) || (speedUpPlayer2 && ball === ball2) ? baseSpeed * 1.2 : baseSpeed;
  const angle = Math.atan2(ball.body.velocity.y, ball.body.velocity.x);
  ball.setVelocity(speed * Math.cos(angle), speed * Math.sin(angle));
}

// Destroi um tijolo
function destroyBrick(ball, brick) {
  brick.disableBody(true, true);

  this.totalBricks -= 1;

  if (ball === ball1) {
    if (doublePointsPlayer1) {
      scorePlayer1 += 20;
    } else {
      scorePlayer1 += 10;
    }
    scoreTextPlayer1.setText('Player 1 Score: ' + scorePlayer1);
  } else if (ball === ball2) {
    if (doublePointsPlayer2) {
      scorePlayer2 += 20;
    } else {
      scorePlayer2 += 10;
    }
    scoreTextPlayer2.setText('Player 2 Score: ' + scorePlayer2);
  }

  let currentVelocity = ball.body.velocity;
  ball.setVelocity(currentVelocity.x * 1.1, currentVelocity.y * 1.1);

  if (Phaser.Math.Between(0, 100) < 5) {
    dropPower(brick, ball);
  }
}

// Calcula a colisão entre a bola e o paddle
function hitPlayer(ball, player) {
  let relativeIntersectX = (ball.x - player.x) / player.displayWidth;
  const maxBounceAngle = Math.PI / 3;
  let bounceAngle = relativeIntersectX * maxBounceAngle;
  const baseSpeed = (slowBallPlayer1 && ball === ball1) || (slowBallPlayer2 && ball === ball2) ? 150 : 300;
  const speed = (speedUpPlayer1 && ball === ball1) || (speedUpPlayer2 && ball === ball2) ? baseSpeed * 1.2 : baseSpeed;
  ball.setVelocity(speed * Math.sin(bounceAngle), -speed * Math.cos(bounceAngle));
}

// Atualiza o temporizador
function updateTimer() {
  if (gameStarted) {
    timeElapsed += 1;
    timeText.setText('Time: ' + timeElapsed + 's');
  }
}

// Reseta o jogo
function resetGame() {
  scorePlayer1 = 0;
  scorePlayer2 = 0;
  timeElapsed = 0;
  livesPlayer1 = 3;
  livesPlayer2 = 3;
  this.totalBricks = 0;
  gameStarted = false;

  doublePointsPlayer1 = false;
  doublePointsPlayer2 = false;
  slowBallPlayer1 = false;
  slowBallPlayer2 = false;
  reverseControlsPlayer1 = false;
  reverseControlsPlayer2 = false;
  speedUpPlayer1 = false;
  speedUpPlayer2 = false;

  if (timerEvent) {
    timerEvent.remove(false);
  }
  updateLives();
}

// Reseta as bolas
function resetBalls() {
  resetSingleBall(ball1, player1);
  resetSingleBall(ball2, player2);
}

// Reseta uma bola
function resetBall(ball, player) {
  ball.setVelocity(0);
  ball.setPosition(player.x, player.y - 40);
  setTimeout(() => {
    ball.setVelocity(-200, -200);
  }, 1000);
}

// Adiciona corações (vidas)
function addHearts() {
  for (let i = 0; i < 3; i++) {
    let heart = this.add.image(50 + i * 60, 650, 'heart').setScale(0.35);
    heartsPlayer1.push(heart);

    heart = this.add.image(1100 + i * 60, 650, 'heart').setScale(0.35);
    heartsPlayer2.push(heart);
  }
}

// Atualiza as vidas dos jogadores
function updateLives() {
  heartsPlayer1.forEach((heart, index) => {
    if (index < livesPlayer1) {
      heart.setTint(0xffffff);
    } else {
      heart.setTint(0x000000);
    }
  });

  heartsPlayer2.forEach((heart, index) => {
    if (index < livesPlayer2) {
      heart.setTint(0xffffff);
    } else {
      heart.setTint(0x000000);
    }
  });
}

// Deixa cair um poder
function dropPower(brick, ball) {
  let power = powers.create(brick.x, brick.y, 'power').setScale(0.5);
  power.setVelocity(0, 100);
  // Define a cor do poder com base na cor da bola
  if (ball === ball1) {
    power.setTint(0xff0000); // Poder do jogador 1 é vermelho
  } else if (ball === ball2) {
    power.setTint(0x0000ff); // Poder do jogador 2 é azul
  }
}

// Recolhe um poder
function collectPower(player, power) {
  power.destroy();

  const powerType = Phaser.Math.Between(0, 3);
  if (powerType === 0) {
    if (player === player1) {
      doublePointsPlayer1 = true;
      showPowerMessage.call(this, player1, 'Double Points', 10);
      this.time.delayedCall(10000, () => {
        doublePointsPlayer1 = false;
        powerTextPlayer1.setText('');
        powerTimerPlayer1.remove();
      }, [], this);
    } else if (player === player2) {
      doublePointsPlayer2 = true;
      showPowerMessage.call(this, player2, 'Double Points', 10);
      this.time.delayedCall(10000, () => {
        doublePointsPlayer2 = false;
        powerTextPlayer2.setText('');
        powerTimerPlayer2.remove();
      }, [], this);
    }
  } else if (powerType === 1) {
    if (player === player1) {
      slowBallPlayer1 = true;
      showPowerMessage.call(this, player1, 'Slow Ball', 10);
      this.time.delayedCall(10000, () => {
        slowBallPlayer1 = false;
        powerTextPlayer1.setText('');
        powerTimerPlayer1.remove();
      }, [], this);
    } else if (player === player2) {
      slowBallPlayer2 = true;
      showPowerMessage.call(this, player2, 'Slow Ball', 10);
      this.time.delayedCall(10000, () => {
        slowBallPlayer2 = false;
        powerTextPlayer2.setText('');
        powerTimerPlayer2.remove();
      }, [], this);
    }
  } else if (powerType === 2) {
    if (player === player1) {
      reverseControlsPlayer1 = true;
      showPowerMessage.call(this, player1, 'Reverse Controls', 10);
      this.time.delayedCall(10000, () => {
        reverseControlsPlayer1 = false;
        powerTextPlayer1.setText('');
        powerTimerPlayer1.remove();
      }, [], this);
    } else if (player === player2) {
      reverseControlsPlayer2 = true;
      showPowerMessage.call(this, player2, 'Reverse Controls', 10);
      this.time.delayedCall(10000, () => {
        reverseControlsPlayer2 = false;
        powerTextPlayer2.setText('');
        powerTimerPlayer2.remove();
      }, [], this);
    }
  } else if (powerType === 3) {
    if (player === player1) {
      speedUpPlayer1 = true;
      player1.setScale(0.24); // Aumenta o tamanho do paddle
      showPowerMessage.call(this, player1, 'Speed Up', 10);
      this.time.delayedCall(10000, () => {
        speedUpPlayer1 = false;
        player1.setScale(0.2); // Reseta o tamanho do paddle
        powerTextPlayer1.setText('');
        powerTimerPlayer1.remove();
      }, [], this);
    } else if (player === player2) {
      speedUpPlayer2 = true;
      player2.setScale(0.24); // Aumenta o tamanho do paddle
      showPowerMessage.call(this, player2, 'Speed Up', 10);
      this.time.delayedCall(10000, () => {
        speedUpPlayer2 = false;
        player2.setScale(0.2); // Reseta o tamanho do paddle
        powerTextPlayer2.setText('');
        powerTimerPlayer2.remove();
      }, [], this);
    }
  }
}

// Mostra uma mensagem de poder ativado
function showPowerMessage(player, message, duration) {
  if (player === player1) {
    powerTextPlayer1.setText(message + ' Activated!');
    powerTimerPlayer1 = this.time.addEvent({
      delay: 1000,
      callback: () => {
        duration--;
        if (duration > 0) {
          powerTextPlayer1.setText(message + ': ' + duration + 's');
        } else {
          powerTextPlayer1.setText('');
        }
      },
      callbackScope: this,
      loop: true
    });
  } else if (player === player2) {
    powerTextPlayer2.setText(message + ' Activated!');
    powerTimerPlayer2 = this.time.addEvent({
      delay: 1000,
      callback: () => {
        duration--;
        if (duration > 0) {
          powerTextPlayer2.setText(message + ': ' + duration + 's');
        } else {
          powerTextPlayer2.setText('');
        }
      },
      callbackScope: this,
      loop: true
    });
  }
}