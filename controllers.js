class ControllersScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ControllersScene' });
    }

    create() {
        // Fundo
        this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(this.scale.width / 1920, this.scale.height / 1080);

        // Texto de informações dos controladores para o primeiro jogador
        const text1 = this.add.text(this.physics.world.bounds.width / 4, 180,
            `Move First Player
            - Left arrow: move left
            - Right arrow: move right`, {
                fontSize: '32px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                align: 'center',
                wordWrap: { width: this.physics.world.bounds.width - 100 }
            }).setOrigin(0.5, 0);
    
            // Texto de informações dos controladores para o segundo jogador
            // Ajustando a posição x para ser mais à direita do que text1
            const text2 = this.add.text(this.physics.world.bounds.width * 3 / 4, text1.y, // x ajustado para 3/4 da largura
            `Move Second Player
            - A key: move left
            - D key: move right`, {
                fontSize: '32px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                align: 'center',
                wordWrap: { width: this.physics.world.bounds.width - 100 }
            }).setOrigin(0.5, 0); // Centraliza no novo x

         // Adicionando texto 'Good Luck!' com efeito
         const goodLuckText = this.add.text(this.physics.world.bounds.width / 2, this.physics.world.bounds.height - 200, 'Good Luck!', {
            fontSize: '48px',
            fill: '#ff0044',
            fontStyle: 'bold',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setAlpha(0).setScale(0.5);

        // Criando um efeito de tween para 'Good Luck!'
        this.tweens.add({
            targets: goodLuckText,
            alpha: { from: 0, to: 1 },
            scale: { from: 0.5, to: 1 },
            duration: 2000,
            ease: 'Expo.easeOut', // Este easing cria um efeito suave
            delay: 500
        });




        // Botão para voltar ao menu
        const backButton = this.add.text(this.physics.world.bounds.width / 2, this.physics.world.bounds.height - 100, 'Back to Menu', {
            fontSize: '40px',
            fill: '#FFF',
            fontStyle: 'bold',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        backButton.on('pointerover', () => {
            backButton.setStyle({ fill: '#f39c12' });
        });

        backButton.on('pointerout', () => {
            backButton.setStyle({ fill: '#FFF' });
        });

        backButton.on('pointerdown', () => {
            this.scene.start('MenuScene'); // Volta para a cena do menu
        });
    }
}
