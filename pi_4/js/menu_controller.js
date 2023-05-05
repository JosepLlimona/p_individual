sessionStorage.clear();

var menu = new Vue({
    el: '#menu',
    data: {
        choosingMode: false
    },
    methods: {
        play: function () {
            this.choosingMode = true;
        },
        playEstandar: function () {
            window.location.href = "html/estandargame.html";
        },
        playMarathon: function () {
            window.location.href = "html/marathongame.html";
        },
        puntuacio: function () {
            window.location.href = "html/puntuacio.html";
        },
        options: function () {
            window.location.href = "html/options.html";
        },
        carregar: function () {
            window.location.href = "html/carregar.html";
        },
        exit: function () {
            window.location.href = "../";
        }
    }
})