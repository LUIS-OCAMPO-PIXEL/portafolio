const endPoint = "https://fpaq.azurewebsites.net/api/PreAlerts/GetCurrentPrealertsByClient/";

Vue.filter('formatDate', function (value) {
    if (value) {
        return moment(String(value)).locale('es').format('LLL')
    }
});
const vp = new Vue({
    el: '#appPaq',
    data: {
        results: []
    },
    mounted() {
        this.getPaqs();
    },
    methods: {
        getPaqs() {
            var dataout = JSON.parse(sessionStorage.getItem('appData'));
            let url = endPoint + dataout.C + "/10000" + "?ClienteId=" + dataout.C;
            axios.get(url, {
                    headers: {
                        "Authorization": "Bearer " + dataout.T
                    }
                })
                .then((response) => {
                    this.loading = false;
                    this.results = response.data;
                }).catch((error) => {
                    console.log(error);
                });
        }
    }
});