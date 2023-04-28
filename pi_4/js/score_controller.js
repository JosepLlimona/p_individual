var score = new Vue({
    el: '#score',
    data: {
        items: localStorage.partides ? JSON.parse(localStorage.partides).sort(this.compare).slice(0, 10) : []
    },
    methods: {
        exit: function () {
            window.location.href = "../"
        },
    }

})

function compare(a, b) {
    if (a.level > b.level)
        return -1;
    if (a.level < b.level)
        return 1;
    if (a.level === b.level && a.score > b.score)
        return -1;
    if (a.level === b.level && a.score < b.score)
        return 1;
    return 0
}