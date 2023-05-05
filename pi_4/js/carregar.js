var carregar = new Vue({
    el: '#carregar',
    data: {
        estandardGames: localStorage.estandardgames ? JSON.parse(localStorage.estandardgames) : [],
        marathonGames: localStorage.marathongames ? JSON.parse(localStorage.marathongames) : []
    },
    methods: {
        loadEstandard: function (id) {
            let partida = this.estandardGames[id];
            sessionStorage.setItem("partida", JSON.stringify(partida));
            sessionStorage.setItem("load", true);
            window.location.href = "../html/estandargame.html";
        },
        loadEstandard: function (id) {
            let partida = this.marathonGames[id];
            sessionStorage.setItem("partida", JSON.stringify(partida));
            sessionStorage.setItem("load", true);
            window.location.href = "../html/marathongame.html";
        },
        exit: function () {
            window.location.href = "../";
        }
    }
})