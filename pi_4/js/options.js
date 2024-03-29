var options = function () {
	var options_data = {
		cards: 2, dificulty: "hard", level: 1
	};
	var load = function () {
		var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"normal", "level:1"}';
		options_data = JSON.parse(json);
	};
	var save = function () {
		localStorage.setItem("config", JSON.stringify(options_data));
	};
	load();
	var vue_instance = new Vue({
		el: "#options_id",
		data: {
			num: 2,
			dificulty: "normal",
			level: 1
		},
		created: function () {
			this.num = options_data.cards;
			this.dificulty = options_data.dificulty;
			this.level = options_data.level;
		},
		watch: {
			num: function (value) {
				if (value < 2)
					this.num = 2;
				else if (value > 6)
					this.num = 6;
			},
			level: function (value) {
				if (value < 1)
					this.level = 1
			}
		},
		methods: {
			discard: function () {
				this.num = options_data.cards;
				this.dificulty = options_data.dificulty;
			},
			save: function () {
				options_data.cards = this.num;
				options_data.dificulty = this.dificulty;
				options_data.level = this.level;
				save();
				window.location.href = "../";
			},
			exit: function () {
				window.location.href = "../";
			}
		}
	});
	return {
		// Aquí dins hi ha la part pública de l'objecte
		getOptionsString: function () {
			return JSON.stringify(options_data);
		},
		getNumOfCards: function () {
			return options_data.cards;
		},
		getDificulty: function () {
			return options_data.dificulty;
		}
	};
}();