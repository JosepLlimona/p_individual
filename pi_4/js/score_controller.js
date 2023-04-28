var score = new Vue({
    el: '#score',
    data: {
        items: localStorage.partides ? JSON.parse(localStorage.partides).slice(0, 10) : []
    }

})