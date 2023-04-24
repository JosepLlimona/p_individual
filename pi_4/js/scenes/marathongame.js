class GameScene extends Phaser.Scene {


    constructor() {
        super('GameScene');
        this.cards = null;
        this.firstClick = null;
        this.score = 100;
        this.correct = 0;
        this.items = ['cb', 'co', 'sb', 'so', 'tb', 'to'];
        this.num_cards = 2;
        this.level = 1;
        this.timeShow = 1000;
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

        let marathonJson = sessionStorage.getItem("MarathonData");
        if (marathonJson !== null) {
            let marathon_data_retrive = JSON.parse(marathonJson);
            this.level = marathon_data_retrive.level;
            this.timeShow = marathon_data_retrive.timeShow;
            this.num_cards = marathon_data_retrive.num_cards;
            this.score = marathon_data_retrive.score;
        }

        this.items = this.items.slice(); // Copiem l'array
        this.items.sort(function () { return Math.random() - 0.5 }); // Array aleatòria
        this.items = this.items.slice(0, this.num_cards); // Agafem els primers numCards elements
        this.items = this.items.concat(this.items); // Dupliquem els elements
        this.items.sort(function () { return Math.random() - 0.5 });
        let arraycards = [];
        for (var k = 0; k < this.items.length; k++) {
            arraycards.push(this.items[k]);
        }

        this.cameras.main.setBackgroundColor(0xBFFCFF);

        var x = 250;
        var y = 100;
        this.cards = this.physics.add.staticGroup();
        for (var j = 0; j < arraycards.length; j++) {
            this.add.image(x, y, arraycards[j]);
            x = x + 100;
            if (x >= 600) {
                x = 250;
                y = y + 150;
            }
        }

        x = 250;
        y = 100;
        setTimeout(() => {
            for (var j = 0; j < arraycards.length; j++) {
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
                                setTimeout(() => {
                                    alert("Game Over");
                                    this.finish();
                                }, 100);
                            }
                        }
                        else {
                            this.correct++;
                            if (this.correct >= this.num_cards) {
                                setTimeout(() => {
                                    alert("Level " + this.level + " completed with " + this.score + " points.");
                                    this.changeLevel();
                                }, 50);

                            }
                        }
                        this.firstClick = null;
                    }
                    else {
                        this.firstClick = card;
                    }
                }, card);
            });

        }, this.timeShow);
    }

    update() {

    }

    changeLevel() {
        this.level++;
        this.timeShow -= 150;
        if (this.level % 5 === 0) {
            this.num_cards++;
            this.timeShow = 1000;
        }
        let marathon_data = {
            score: this.score,
            level: this.level,
            timeShow: this.timeShow,
            num_cards: this.num_cards
        };

        sessionStorage.setItem("MarathonData", JSON.stringify(marathon_data));
        window.location.reload();
    }

    finish() {

        let marathon_data = {
            score: this.score,
            level: this.level,
        }
        localStorage.setItem("MarathonData", JSON.stringify(marathon_data));
        window.location.href = "../";
    }

}