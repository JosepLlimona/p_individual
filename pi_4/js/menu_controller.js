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
        }
    }
})