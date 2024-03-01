"use strict";

const paqBaseUrl = "https://fpaq.azurewebsites.net/api/packages/GetBlqPackagesByAccount/";

Vue.filter('formatDate', function (value) {
    if (value) {
        return moment(String(value)).locale('es').format('LLL')
    }
});

Vue.filter("formatNumber", function (value) {
    return (value).toFixed();
});

const vhis = new Vue({
    el: '#appPaqBlq',
    data: {
        results: []
    },
    mounted() {
        this.getPaqBlq();
    },
    methods: {
        getPaqBlq() {
            var dataout = JSON.parse(sessionStorage.getItem('appData'));
            let url = `${paqBaseUrl + dataout.N}`;
            axios.get(url, {
                    headers: {
                        "Authorization": "Bearer " + dataout.T
                    }
                })
                .then((response) => {
                    this.loading = false;
                    this.results = response.data;
                    console.log(response.data);
                }).catch((error) => {
                    console.log(error);
                });
        }
    }
});