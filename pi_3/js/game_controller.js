const back = "../resources/back.png";
const items = ["../resources/cb.png", "../resources/co.png", "../resources/sb.png",
	"../resources/so.png", "../resources/tb.png", "../resources/to.png"];

var game = new Vue({
	el: "#game_id",
	data: {
		username: '',
		current_card: [],
		items: [],
		num_cards: 2,
		bad_clicks: 0,
		canPlay: false,
		penalty: 20,
		showTime: 1
	},
	created: function () {
		this.num_cards = JSON.parse(localStorage.getItem("config"))["cards"];

		switch (JSON.parse(localStorage.getItem("config"))["dificulty"]) {
			case "easy":
				this.penalty = 10;
				this.showTime = 2;
				break;
			case "normal":
				this.penalty = 20;
				this.showTime = 1;
				break;
			case "hard":
				this.penalty = 30;
				this.showTime = 0.3;
				break;
			default:
				console.log("Com has arribat aqui?");
				break;
		}

		this.username = sessionStorage.getItem("username", "unknown");
		this.items = items.slice(); // Copiem l'array
		this.items.sort(function () { return Math.random() - 0.5 }); // Array aleatòria
		this.items = this.items.slice(0, this.num_cards); // Agafem els primers numCards elements
		this.items = this.items.concat(this.items); // Dupliquem els elements
		this.items.sort(function () { return Math.random() - 0.5 }); // Array aleatòria
		for (var i = 0; i < this.items.length; i++) {
			this.current_card.push({ done: false, texture: this.items[i] });
		}
		setTimeout(() => {
			for (var i = 0; i < this.items.length; i++) {
				Vue.set(this.current_card, i, { done: false, texture: back });
			};
			this.canPlay = true;
		}, (this.showTime * 1000));
	},
	methods: {
		clickCard: function (i) {
			if (!this.current_card[i].done && this.current_card[i].texture === back)
				Vue.set(this.current_card, i, { done: false, texture: this.items[i] });
		}
	},
	watch: {
		current_card: function (value) {
			if (this.canPlay) {
				if (value.texture === back) return;
				var front = null;
				var i_front = -1;
				for (var i = 0; i < this.current_card.length; i++) {
					if (!this.current_card[i].done && this.current_card[i].texture !== back) {
						if (front) {
							if (front.texture === this.current_card[i].texture) {
								front.done = this.current_card[i].done = true;
								this.num_cards--;
							}
							else {
								Vue.set(this.current_card, i, { done: false, texture: back });
								Vue.set(this.current_card, i_front, { done: false, texture: back });
								this.bad_clicks++;
								break;
							}
						}
						else {
							front = this.current_card[i];
							i_front = i;
						}
					}
				}
			}
		}
	},
	computed: {
		score_text: function () {
			return 100 - this.bad_clicks * this.penalty;
		}
	}
});





