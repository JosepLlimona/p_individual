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
        this.penalization = 1;
        this.saveButton;
        this.levelsCompleted = 0;
        this.arraycards = []
        this.correctcards = []
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
            this.id = marathon_data_retrive.id;
            this.level = marathon_data_retrive.level;
            this.timeShow = marathon_data_retrive.timeShow;
            this.num_cards = marathon_data_retrive.num_cards;
            this.score = marathon_data_retrive.score;
            this.penalization = marathon_data_retrive.penalization;
            this.levelsCompleted = marathon_data_retrive.levelsCompleted;
        }

        let saveData = sessionStorage.getItem("partida");
        let isLoaded = sessionStorage.getItem("load");
        let loaded = JSON.parse(isLoaded);

        if (saveData && loaded) {
            let save_data = JSON.parse(saveData);
            console.log(save_data)
            this.arraycards = save_data.arraycards;
            this.correctcards = save_data.correctcards;
            this.num_cards = save_data.num_cards;
            this.timeShow = save_data.timeShow;
            this.penalization = save_data.penalization;
            this.correct = save_data.correct;
            this.id = save_data.id;
            this.level = save_data.level;
            this.levelsCompleted = save_data.levlesCompleted;
        }

        let config = localStorage.getItem("config");
        if (config && this.levelsCompleted === 0) {
            let config_data = JSON.parse(config);
            this.level = config_data.level;
            this.calculateLevel();
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

        console.log(this.id);
        sessionStorage.clear();
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
                            console.log(this.firstClick.card_id + " " + card.card_id);
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
                                setTimeout(() => { alert("You win with " + this.score + " points."); this.changeLevel() }, 50);
                            }
                            this.firstClick = null;
                        }
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
        this.timeShow -= 200;
        if (this.timeShow === 0)
            this.timeShow = 0;
        this.penalization++;
        this.levelsCompleted++;
        if (this.level % 5 === 0 && this.num_cards < 6) {
            this.num_cards++;
            this.timeShow = 1000;
        }
        let marathon_data = {
            id: this.id,
            score: this.score,
            level: this.level,
            timeShow: this.timeShow,
            num_cards: this.num_cards,
            penalization: this.penalization,
            levelsCompleted: this.levelsCompleted
        };

        sessionStorage.setItem("MarathonData", JSON.stringify(marathon_data));
        window.location.reload();
    }

    finish() {
        if (this.score < 0) {
            this.score = 0;
        }

        let arrayPartides = [];
        if (localStorage.marathongames) {
            arrayPartides = JSON.parse(localStorage.marathongames);
            if (!Array.isArray(arrayPartides)) arrayPartides = [];
        }

        let trobat = false;
        let i = 0;
        while (i < arrayPartides.length && !trobat) {
            if (arrayPartides[i].id === this.id) {
                console.log("trobat");
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
            let marathon_data = {
                id: arrayPartides.length + 1,
                score: this.score,
                correct: this.correct,
                arraycards: this.arraycards,
                correctcards: this.correctcards,
                num_cards: this.num_cards,
                level: this.level,
                timeShow: this.timeShow,
                penalization: this.penalization,
                levlesCompleted: this.levelsCompleted
            }
            arrayPartides.push(marathon_data);
        }
        localStorage.marathongames = JSON.stringify(arrayPartides);

        window.location.href = "../";
    }

    calculateLevel(level) {
        if (this.level % 6 === 0) {
            this.num_cards = this.level / 5 + 1;
        }
        else if (this.level < 5) {
            this.num_cards = 2;
            this.timeShow -= 200 * (this.level - 1);
            this.penalization = this.level;
        }
        else {
            this.num_cards = this.level / 5 + 1;
            this.timeShow -= 200 * (this.level % 6) - 1;
            if (this.timeShow === 0)
                this.timeShow = 0;
            this.penalization = this.level;
        }
    }

    save() {
        this.enterButtonResetState();
        alert("Partida Guardada");
        this.finish();
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