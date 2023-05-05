class GameScene extends Phaser.Scene {


    constructor() {
        super('GameScene');
        this.cards = null;
        this.firstClick = null;
        this.score = 100;
        this.correct = 0;
        this.items = ['cb', 'co', 'sb', 'so', 'tb', 'to'];
        this.num_cards = 2;
        this.showTime = 1000;
        this.penalization = 20;
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

        let config = localStorage.getItem("config");
        console.log(config);
        if (config) {
            let config_data = JSON.parse(config);
            this.num_cards = config_data.cards;
            if (config_data.dificulty === "easy") {
                this.showTime = 1500;
                this.penalization = 10;
            }
            else if (config_data === "normal") {
                this.showTime = 1000;
                this.penalization = 20;
            }
            else if (config_data === "hard") {
                this.showTime = 500;
                this.penalization = 30;
            }
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

        this.saveButton = this.add.text(600, 570, "Guardar Partida", { fill: '#000', fontSize: '20px' });
        this.saveButton.setBackgroundColor("#ffffff");
        this.saveButton.setInteractive();
        this.saveButton.on('pointerover', () => { this.enterButtonHoverState() });
        this.saveButton.on('pointerout', () => { this.enterButtonResetState() });
        this.saveButton.on('pointerup', () => { this.enterButtonActiveState() });
        this.saveButton.on('pointerdown', () => { this.save() });

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
                            this.score -= this.penalization;
                            setTimeout(() => {
                                this.firstClick.enableBody(false, 0, 0, true, true);
                                card.enableBody(false, 0, 0, true, true);
                                this.firstClick = null;
                            }, 100);
                            if (this.score <= 0) {
                                setTimeout(function () { alert("Game Over"); window.location.href = "../"; }, 50);
                            }
                        }
                        else {
                            this.correct++;
                            if (this.correct >= 2) {
                                setTimeout(() => { alert("You win with " + this.score + " points."); window.location.href = "../"; }, 50);
                            }
                            this.firstClick = null;
                        }
                    }
                    else {
                        this.firstClick = card;
                    }
                }, card);
            });

        }, this.showTime);

    }

    update() {

    }

    save() {
        this.enterButtonResetState();
        alert("Partida Guardada");
        window.location.href = "../";
    }

    enterButtonHoverState() {
        this.saveButton.setStyle({ fill: '#696969', fontSize: '20px' });
    }
    enterButtonResetState() {
        this.saveButton.setStyle({ fill: '#000', fontSize: '20px' });
    }
    enterButtonActiveState() {
        this.saveButton.setStyle({ fill: '#696969', fontSize: '16px' });
    }

}