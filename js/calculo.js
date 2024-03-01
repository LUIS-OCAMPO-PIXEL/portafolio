// const openModal = document.querySelector('.hero__cta');
// const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.modal__close');

// openModal.addEventListener('click', (e)=>{
//     e.preventDefault();
//     modal.classList.add('modal--show');
// });

closeModal.addEventListener('click', (e)=>{
    e.preventDefault();
    var modal = document.querySelector('.modal');
    modal.classList.remove('modal--show');
    document.getElementById('calculatorForm').reset();
});

sessionStorage.setItem('appData', '30')

/* VALIDACION DE CONVENIO */
function validarConvenio() {
    var convenio = sessionStorage.getItem('appData');
    //var convenio = "30";
    if (convenio == null && convenio == "") {
        swal("¡ha ocurrido un error! ", "Selecciona un Plan", "error");
        $('#idConvenio').focus();
        return false;
    }
    return true;
}
/* VALIDACION DATOS CALCULADORA */
function validarCalculadora() {
    if ($('#valorDeclarado').val() <= 0) {
        $('#valorDeclarado').focus();
        return false;
    } else
        if ($('#valorDeclarado').val() > 2000) {
            swal("¡ha ocurrido un error! ", "Maximo Declarado USD 2000, para el envio", "error");
            $('#valorDeclarado').focus();
            return false;
        }
        else if ($('#pesoTotal').val() <= 0) {
            $('#pesoTotal').focus();
            return false;
        } else if ($('#pesoTotal').val() > 110) {
            swal("¡ha ocurrido un error! ", "Maximo peso 110", "error");
            $('#pesoTotal').focus();
            return false;
        }
    return true;
}

/* OBTENER TIPO DE CIUDAD CC/CP */
function getTipoCiudad() {
    let data = JSON.parse(localStorage.getItem("ciudades"));
    let ciudad = document.getElementById('ciudad').value;
    let estado = document.getElementById('estado').value;
    let pais = 'Colombia';
    let result;
    data.forEach(element => {
        if (ciudad == element.Ciudad && estado == element.Estado && pais == element.Pais) {
            result = element.TipoCiudadId;
        }
    });
    return result;
}

/* VALIDACION DE LAS DIMENSIONES  */
function validarDimensiones() {
    if (document.getElementById('ancho').value == '') {
        document.getElementById('ancho').value = '0';
    }
    if (document.getElementById('largo').value == '') {
        document.getElementById('largo').value = '0';
    }
    if (document.getElementById('alto').value == '') {
        document.getElementById('alto').value = '0';
    }
}

/* GENERAR URL */
function getUrlCalculadora() {
    let data = sessionStorage.getItem('appData');
    validarDimensiones();
    let urlCiudades = "https://fpaq.azurewebsites.net/api/calculators/";
    let tipoCiudad = getTipoCiudad();
    urlCiudades += tipoCiudad + "/";
    urlCiudades += data + "/";
    urlCiudades += $("#idPaisOrigen").val() + "/";
    urlCiudades += $("#tUnidad").val() + "/";
    urlCiudades += $("#tDimension").val() + "/";
    urlCiudades += $("#pesoTotal").val() + "/";
    var remplazo = $("#valorDeclarado").val();
    var cambio = remplazo.replace(",", ".");
    urlCiudades += cambio + "/";
    urlCiudades += $("#largo").val() + "/";
    urlCiudades += $("#ancho").val() + "/";
    urlCiudades += $("#alto").val() + "/";

    return urlCiudades;
}

function mostrarVolumetricas(checked) {
    if (checked == true) {
        divC = document.getElementById("MuestroVol");
        divC.style.display = "";
    } else {
        divC = document.getElementById("MuestroVol");
        divC.style.display = "none";
    }
}

function limpiarCalculadora() {
    $("#ciudad").val('');
    $("#estado").val('');
    $("#pais").val('');
    $("#ciudadTipo").val('');
    $("#ciudadId").val('');
    $("#ciudadNombre").val('');
    $("#descripcion").val('');
    $("#pesoTotal").val('');
    $("#valorDeclarado").val('');
    $("#largo").val('');
    $("#ancho").val('');
    $("#alto ").val('');
}
function limpiarClick() {
    $("#lbflete").text("");
    $("#lbseguro").text("");
    $("#lbarancel").text("");
    $("#lbiva").text("");
    $("#lbTOTAL").text("");
}

function CalculadoraResult(request) {
    $("#vlFlete").text("USD$ " + String(request.ValorFlete));
    $("#vlSeguro").text("USD$ " + String(request.ValorSeguro));
    $("#vlArancel").text("USD$ " + String(request.ValorArancel));
    $("#vlIva").text("USD$ " + String(request.ValorIva));
    $("#vlValor").text("$ " + String(request.ValorTotal));
}

/* FUNCION PRINCIPAL */
async function calcularClick() {
    event.preventDefault();

    if (!validarConvenio()) {
        return;
    } else {
        if (!validarCalculadora()) {
            return;
        }
    }
    let url_ws_ciudades = getUrlCalculadora();
    try {
        let req = await fetch(url_ws_ciudades);
        if (req.status === 200) {
            let data = await req.json();
            document.querySelector('.modal').classList.add('modal--show');
            console.log(data);
            limpiarCalculadora();
            CalculadoraResult(data);
        }

    } catch (error) {
        console.log(error);
    }
}

