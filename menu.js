class MenuScene extends Phaser.Scene {
    constructor() {
      super({ key: 'MenuScene' });
    }
  
    preload() {
      this.load.image('background', 'path/to/background/image.jpg'); // Substitua pelo caminho real da imagem de fundo
    }
  
    create() {
      // Adicionando um fundo
      this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(this.scale.width / 1920, this.scale.height / 1080);
  
      // Título do Jogo
      const title = this.add.text(this.physics.world.bounds.width / 2, this.physics.world.bounds.height / 2 - 200, 'Breakout Game', {
        fontSize: '70px',
        fill: '#ff0044',
        fontStyle: 'bold',
        fontFamily: 'Arial'
      }).setOrigin(0.5);
  
      // Criando o botão de iniciar o jogo
      const startButton = this.add.text(this.physics.world.bounds.width / 2, this.physics.world.bounds.height / 2, 'Start Game', {
        fontSize: '40px',
        fill: '#FFF',
        fontStyle: 'bold',
        fontFamily: 'Arial'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  
      // Efeito de hover
      startButton.on('pointerover', () => {
        startButton.setStyle({ fill: '#f39c12' }); // Mudança de cor ao passar o mouse
      });
  
      startButton.on('pointerout', () => {
        startButton.setStyle({ fill: '#FFF' }); // Cor original quando o mouse sai
      });
  
      // Evento de clique
      startButton.on('pointerdown', () => {
        this.scene.start('GameScene'); // Inicia a cena do jogo
      });
  
      // Animação de pulsar
      this.tweens.add({
        targets: startButton,
        scale: { from: 1, to: 1.1 },
        duration: 800,
        yoyo: true,
        repeat: -1 // Repete infinitamente
      });
  
      // Criando o botão de controladores
      const controllersButton = this.add.text(this.physics.world.bounds.width / 2, this.physics.world.bounds.height / 2 + 100, 'Controllers', {
        fontSize: '40px',
        fill: '#FFF',
        fontStyle: 'bold',
        fontFamily: 'Arial'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  
      // Efeito de hover para o botão de controladores
      controllersButton.on('pointerover', () => {
        controllersButton.setStyle({ fill: '#f39c12' });
      });
  
      controllersButton.on('pointerout', () => {
        controllersButton.setStyle({ fill: '#FFF' });
      });
  
      // Evento de clique para mostrar os controladores
      controllersButton.on('pointerdown', () => {
        this.scene.start('ControllersScene');
      });
  
      // Animação de pulsar para o botão de controladores
      this.tweens.add({
        targets: controllersButton,
        scale: { from: 1, to: 1.1 },
        duration: 800,
        yoyo: true,
        repeat: -1
      });
  
      // Exibir a mensagem de vencedor
      const winnerMessage = this.registry.get('winner');
      if (winnerMessage) {
        const winnerText = this.add.text(this.physics.world.bounds.width / 2, this.physics.world.bounds.height / 2 - 300, winnerMessage, {
          fontSize: '40px',
          fill: '#FFF',
          fontStyle: 'bold',
          fontFamily: 'Arial'
        }).setOrigin(0.5);
  
        this.time.delayedCall(5000, () => {
          winnerText.setVisible(false);
        }, [], this);
      }
    }
  }