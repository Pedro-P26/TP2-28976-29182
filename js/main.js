const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 700,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },

scene:{
    preload: preload,
    create: create,
    update: update
}



};

const game = new Phaser.Game(config);

function preload(){
    this.load.image('bola','assets/bola.png')
    this.load.image('paddle','assets/paddle.png')
    this.load.image('enemi','assets/legacy_eggman_render_by_nibroc_rock-daoukr9.webp')
}

function create(){
    player.setSkil.add(100,100)
    player = this.physics.add.sprite(400,500,'spaceship')
    player.setCollideworldBounds(true);

}
function update(){

}
