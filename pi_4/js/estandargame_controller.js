var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game_area',
    scene: [GameScene]
};

var game = new Phaser.Game(config);