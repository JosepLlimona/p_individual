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
        this.arraycards = [];
        this.correctcards = [];
        this.dificulty = "medium";
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
        let saveData = sessionStorage.getItem("partida");
        let isLoaded = sessionStorage.getItem("load");
        let loaded = JSON.parse(isLoaded);
        sessionStorage.clear();
        if (config) {
            let config_data = JSON.parse(config);
            this.num_cards = config_data.cards;
            this.dificulty = config_data.dificulty;
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

        if (saveData && loaded) {
            let save_data = JSON.parse(saveData);
            console.log(save_data)
            this.arraycards = save_data.arraycard;
            this.correctcards = save_data.correctcards;
            this.num_cards = save_data.num_cards;
            this.showTime = save_data.showTime;
            this.penalization = save_data.penalization;
            this.correct = save_data.correct;
            this.id = save_data.id
        }

        if (!this.arraycards.length > 0) {
            this.items = this.items.slice(); // Copiem l'array
            this.items.sort(function () { return Math.random() - 0.5 }); // Array aleatòria
            this.items = this.items.slice(0, this.num_cards); // Agafem els primers numCards elements
            this.items = this.items.concat(this.items); // Dupliquem els elements
            this.items.sort(function () { return Math.random() - 0.5 });
            for (var k = 0; k < this.items.length; k++) {
                this.arraycards.push(this.items[k]);
            }
        }

        console.log(this.arraycards)
        console

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
        for (var j = 0; j < this.arraycards.length; j++) {
            this.add.image(x, y, this.arraycards[j]);
            x = x + 100;
            if (x >= 600) {
                x = 250;
                y = y + 150;
            }
        }

        x = 250;
        y = 100;
        setTimeout(() => {
            for (var j = 0; j < this.arraycards.length; j++) {

                let showned = false;
                let k = 0;
                while (k < this.correctcards.length && !showned) {
                    if (this.arraycards[j] === this.correctcards[k]) {
                        showned = true;
                    }
                    k++;
                }

                if (!showned) {
                    this.cards.create(x, y, 'back');
                }
                x = x + 100;
                if (x >= 600) {
                    x = 250;
                    y = y + 150;
                }
            }

            let i = 0;
            this.cards.children.iterate((card) => {
                let m = 0;
                while (m < this.correctcards.length) {
                    if (this.arraycards[i] === this.correctcards[m]) {
                        i++;
                    } else {
                        m++;
                    }
                }
                card.card_id = this.arraycards[i];
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
                            this.correctcards.push(this.firstClick.card_id);
                            if (this.correct >= this.num_cards) {
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


        let arrayPartides = [];
        if (localStorage.estandardgames) {
            arrayPartides = JSON.parse(localStorage.estandardgames);
            if (!Array.isArray(arrayPartides)) arrayPartides = [];
        }

        let trobat = false;
        let i = 0;
        while (i < arrayPartides[i].length && !trobat) {
            if (arrayPartides.id === this.id) {
                arrayPartides[i].id = this.id;
                arrayPartides[i].score = this.score;
                arrayPartides[i].correct = this.correct;
                arrayPartides[i].arraycards = this.arraycards;
                arrayPartides[i].correctcards = this.correctcards;
                arrayPartides[i].num_cards = this.num_cards;
                arrayPartides[i].level = this.level;
                arrayPartides[i].timeShow = this.timeShow;
                arrayPartides[i].penalization = this.penalization;
                arrayPartides[i].levlesCompleted = this.levelsCompleted;
                trobat = true;
            }
            else {
                i++;
            }
        }

        if (!trobat) {
            let save = {
                id: arrayPartides.length + 1,
                arraycard: this.arraycards,
                correctcards: this.correctcards,
                num_cards: this.num_cards,
                showTime: this.showTime,
                penalization: this.penalization,
                correct: this.correct,
                dificulty: this.dificulty

            }
            arrayPartides.push(save);
        }
        localStorage.estandardgames = JSON.stringify(arrayPartides);

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