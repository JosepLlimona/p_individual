class GameScene extends Phaser.Scene {


    constructor() {
        super('GameScene');
        this.cards = null;
        this.firstClick = null;
        this.score = 100;
        this.correct = 0;
        this.items = ['cb', 'co', 'sb', 'so', 'tb', 'to'];
    }

    preload() {
        this.load.image('back', '../resources/back.png');
        this.load.image('cb', '../resources/cb.png');
        this.load.image('co', '../resources/co.png');
        this.load.image('sb', '../resources/sb.png');
        this.load.image('so', '../resources/so.png');
        this.load.image('tb', '../resources/tb.png');
        this.load.image('to', '../resources/to.png');

    }

    create() {
        let arraycards = ['co', 'sb', 'co', 'sb'];
        this.cameras.main.setBackgroundColor(0xBFFCFF);

        var x = 250;
        var y = 100;
        this.cards = this.physics.add.staticGroup();
        for (var j = 0; j < 4; j++) {
            this.add.image(x, y, arraycards[j]);
            this.cards.create(x, y, 'back');
            x = x + 100;
            if (x >= 600) {
                x = 250;
                y = y + 150;
            }
        }

        let i = 0;
        this.cards.children.iterate((card) => {
            card.card_id = arraycards[i];
            i++;
            card.setInteractive();
            card.on('pointerup', () => {
                card.disableBody(true, true);
                if (this.firstClick) {
                    if (this.firstClick.card_id !== card.card_id) {
                        this.score -= 20;
                        this.firstClick.enableBody(false, 0, 0, true, true);
                        card.enableBody(false, 0, 0, true, true);
                        if (this.score <= 0) {
                            alert("Game Over");
                            window.location.href = "../";
                        }
                    }
                    else {
                        this.correct++;
                        if (this.correct >= 2) {
                            alert("You win with " + this.score + " points.");
                            window.location.href = "../";
                        }
                    }
                    this.firstClick = null;
                }
                else {
                    this.firstClick = card;
                }
            }, card);
        });
    }

    update() {

    }

}