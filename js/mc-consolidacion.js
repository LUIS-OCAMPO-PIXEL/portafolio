const baseUrl =
    "https://fpaqtest.azurewebsites.net/api/Packages/GetHubPackageBlq?";
const baselocal =
    "https://fpaqtest.azurewebsites.net/api/Packages/GetHubPackageBlq?";
let dataOut = JSON.parse(sessionStorage.getItem("appData"));

Vue.filter("formatDate", function (value) {
    if (value) {
        return moment(String(value)).locale("es").format("LLL");
    }
});

/*Template -> formulario de creacion de orden de consolidación */
Vue.component("my-component-name", {
    template: `
            <form class="form-style1 fx-cols-2" id="createOrdenConsolidacionForm" onsubmit="createOrdenConsolidacion(); return false">
            <div class="form-column">
                <label>Descripcion *</label>
                <input class="col-sd-6" id="ordenDescipcion" type="text"
                    placeholder="Descripción" required>
            </div>
            <div class="form-column">
                <label>Observación (opcional)</label>
                <input class="col-lg-6" id="ordenObservacion" type="text"
                    placeholder="Observación">
            </div>
             <div class="form-column">
                <label>Valor declarado (USD) *</label>
                <input class="col-lg-6" id="valorDeclaradoOrden" type="text"
                    placeholder="EJM: 32.99" required>
            </div>
            <div class="form-column">
                <label>Factura *</label>
                <div class="input-group input-file" name="Fichier1"></div>
                <span class="btn btn-primary margin-bottom-none" style="width: 100%;"><input class="" type="file" id="urlFactura"
                    onchange="validarExtencion()" required></span>
           
                <p> * Utilice archivos en formato: .gif, .jpg, .png para adjuntar la
                    factura.<br>
                    * Utilice archivos con un tamaño NO superior a 1 MB.</p>
                </p>
            </div>
            <div class="form-column">
                <input class="btn btn-primary col-lg-12" type="submit" value="Consolidar">
            </div>
            </form>`,
});

new Vue({
    el: "#app",
    data: {
        activeItem: "home",
        allSelectedUs: false,
        allSelectedCh: false,
        allSelectedEs: false,
        declaredValueSum: [],
        resultsUs: [],
        resultsCh: [],
        resultsEs: [],
        packagesIdUs: [],
        packagesIdCh: [],
        packagesIdEs: [],
    },
    mounted() {
        this.getPaqUsa();
        this.getPaqCh();
        this.getPaqEs();
    },
    methods: {
        isActive(menuItem) {
            return this.activeItem === menuItem;
        },

        /*Logica asociada al evento active tab nav, consolidacion por pais, reinicializacion
        de variables para dejar en 
         */
        setActive(menuItem) {
            this.declaredValueSum = [];
            $(".ckeckInput").attr("checked", false);
            this.packagesIdCh = [];
            this.packagesIdEs = [];
            this.packagesIdUs = [];
            this.activeItem = menuItem;
        },

        /*Logica asociada con input check por paquete, adicion de valor a arreglo por Pais.*/
        selectEvent: function (paq, event) {
            if (event.target.checked) {
                this.declaredValueSum.push(paq.ValorDeclarado);
                this.sumaArreglo();
            } else {
                let index = this.declaredValueSum.indexOf(paq.ValorDeclarado);
                this.declaredValueSum.splice(index, 1);
                this.sumaArreglo();
            }
        },

        /*Logica asociada a la suma de valores declarados, segun los items seleccionados. */
        sumaArreglo: function () {
            let sum = this.declaredValueSum.reduce((a, b) => a + b, 0);
            document.getElementById("valorDeclaradoOrden").value = sum.toFixed(2);
        },

        /*Logica asociada a la sumatoria y seleccion de ckech header masivo para tab Estado Unidos*/
        selectAllUs: function () {
            this.allSelectedUs = !this.allSelectedUs;
            this.packagesIdUs = [];
            this.declaredValueSum = [];

            if (this.allSelectedUs) {
                for (let package in this.resultsUs) {
                    this.packagesIdUs.push(this.resultsUs[package].PaqueteId);
                    this.declaredValueSum.push(this.resultsUs[package].ValorDeclarado);
                }
                this.sumaArreglo();
            } else {
                this.declaredValueSum = [];
                this.sumaArreglo();
            }
        },

        /*Logica asociada a la sumatoria y seleccion de ckech header masivo para tab China*/
        selectAllCh: function () {
            let idCh = "valorDeclaradoOrdenCh";
            this.allSelectedCh = !this.allSelectedCh;
            this.packagesIdCh = [];
            this.declaredValueSum = [];

            if (this.allSelectedCh) {
                for (let package in this.resultsCh) {
                    this.packagesIdCh.push(this.resultsCh[package].PaqueteId);
                    this.declaredValueSum.push(this.resultsCh[package].ValorDeclarado);
                }
                this.sumaArreglo(idCh);
            } else {
                this.declaredValueSum = [];
                this.sumaArreglo(idCh);
            }
        },

        /*Logica asociada a la sumatoria y seleccion de ckech header masivo para tab España*/
        selectAllEs: function () {
            let idEs = "valorDeclaradoOrdenEs";
            this.allSelectedEs = !this.allSelectedEs;
            this.packagesIdEs = [];
            this.declaredValueSum = [];

            if (this.allSelectedEs) {
                for (let package in this.resultsEs) {
                    this.packagesIdEs.push(this.resultsEs[package].PaqueteId);
                    this.declaredValueSum.push(this.resultsEs[package].ValorDeclarado);
                }
                this.sumaArreglo(idEs);
            } else {
                this.declaredValueSum = [];
                this.sumaArreglo(idEs);
            }
        },

        /*Logica asociada a consumo de microservicio para obtener paquetes para consolidacion Estado Unidos*/
        getPaqUsa() {
            let url = `${baselocal}hubId=1&motivoBloqueoId=6&cuenta=${dataOut.N}`;
            axios
                .get(url, {
                    headers: {
                        Authorization: "Bearer " + dataOut.T,
                    },
                })
                .then((response) => {
                    this.loading = false;
                    this.resultsUs = response.data;
                    console.log(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        /*Logica asociada a consumo de microservicio para obtener paquetes para consolidacion China*/
        getPaqCh() {
            let url = `${baseUrl}hubId=3&motivoBloqueoId=6&cuenta=${dataOut.N}`;
            axios
                .get(url, {
                    headers: {
                        Authorization: "Bearer " + dataOut.T,
                    },
                })
                .then((response) => {
                    this.loading = false;
                    this.resultsCh = response.data;
                    console.log(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        /*Logica asociada a consumo de microservicio para obtener paquetes para consolidacion España*/
        getPaqEs() {
            let url = `${baseUrl}hubId=2&motivoBloqueoId=6&cuenta=${dataOut.N}`;
            axios
                .get(url, {
                    headers: {
                        Authorization: "Bearer " + dataOut.T,
                    },
                })
                .then((response) => {
                    this.loading = false;
                    this.resultsEs = response.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    },
});

function getFile() {
    document.getElementById("urlFactura").click();
}

function validarExtencion() {
    let fileInput = document.getElementById("urlFactura").value;
    let fileName = document.getElementById("urlFactura").files[0].name;
    let extPermitidas = /(.jpg|.png|.jpeg|.gif|.pdf)$/i;
    if (!extPermitidas.exec(fileInput)) {
        Swal.fire({
            title: "Extension invalida!",
            text: "Valida que el archivo sea extension .jpg, .png, .gif, .pdf",
            icon: "error",
            confirmButtonText: "Ok",
            type: "error",
        });
    }
    document.getElementById("fileName").setAttribute("value", fileName);
}

function createOrdenConsolidacion() {
    let ordenDescripcion = $("#ordenDescipcion").val();
    let orderObservacion = $("#ordenObservacion").val();
    let valorDeclarado = $("#valorDeclaradoOrden").val();
    let guiasHijas = $("#listaPaqueteId").val();

    let validacionGuias = validacionGuiasHijas(guiasHijas);

    if (validacionGuias) {
        let file = document.getElementById("urlFactura").files[0];
        let arrayType = file.type.split("/");
        let extension = arrayType[1];
        let newFile = new File([file], `consolidacion.${extension}`, {
            type: file.type,
        });

        let formData = new FormData();
        formData.append("GuiasHijas", guiasHijas);
        formData.append("ValorDeclarado", valorDeclarado);
        formData.append("Descripcion", ordenDescripcion);
        formData.append("FileFactura", newFile);
        formData.append("Observacion", orderObservacion);

        $.ajax({
            url: "https://fpaqtest.azurewebsites.net/api/OrdenConsolidacion/CreateOrdenConsolidacion",
            //url: "https://localhost:44347/api/OrdenConsolidacion/CreateOrdenConsolidacion",
            type: "POST",
            contentType: false,
            processData: false,
            data: formData,
            headers: {
                Authorization: "Bearer " + dataOut.T,
            },
            success: function (response) {
                Swal.fire(
                    "¡Se genero la orden de consolidación! \n Con el Numero: " +
                    response.OrdenConsolidacionId,
                    "¡Nosotros nos encargamos!",
                    "success"
                ).then(() => {
                    location.reload();
                });
            },
            error: function (request, message, error) {
                console.log(request);
                Swal.fire(
                    "¡Se genero un error.! \n" + request.responseJSON,
                    "¡Nosotros nos encargamos!",
                    "Error"
                );
            },
        });
    }
}

function validacionGuiasHijas(guiasHijas) {
    if (!guiasHijas) {
        Swal.fire("No se han seleccionado guías.", "Error");
        return false;
    }

    var listaPaquetes = guiasHijas.split(",");
    if (listaPaquetes.length == 1) {
        Swal.fire(
            "Por favor, seleccione al menos dos paquetes para consolidación.",
            "Error"
        );
        return false;
    }
    return true;
}
