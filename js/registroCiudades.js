let urlCiudades = 'https://fpaq.azurewebsites.net/api/ciudades';
window.onload = callService;

function callService(){
    let data = JSON.parse(localStorage.getItem("ciudades"));
    if(data == null){
        getCiudades();
    }else{
        cargaDept();
    }
}

async function getCiudades(){
    try {
        let req = await fetch(urlCiudades);
        if(req.status === 200){
            let data = await req.json();
            localStorage.setItem("ciudades", JSON.stringify(data));
            //obtenerPaises(data);
            cargaDept();
        }

    } catch (error) {
        console.log("Se ha producido un error");
    }
}

// function obtenerPaises(data) {
//     let paises = [];
//     data.forEach(element => {
//         if (paises.indexOf(element.Pais) == -1) {
//             paises.push(element.Pais);
//         }
//     });
//     paises.forEach(element => {
//         let select = document.getElementById('pais');
//         let option = document.createElement('option');
//         option.value = element;
//         option.text = element;
//         select.add(option);
//     });
// }

function cargaDept() {
    let tempArray = []
    let departamentos = [];
    let data = JSON.parse(localStorage.getItem("ciudades"));
    let pais = document.getElementById('pais').value;
    data.forEach(element => {
        if (element.Pais == pais) {
            tempArray.push(element.Estado);
        }
    });
    tempArray.forEach(element => {
        if (departamentos.indexOf(element) == -1) {
            departamentos.push(element);
        }
    });
    let select = document.getElementById('estado');
    select.options.length = 1;
    departamentos.forEach(element => {
        let option = document.createElement("option");
        option.text = element;
        option.value = element;
        select.add(option);
    });

}

function  cargaCiudades(){
    let ciudades = [];
    let data = JSON.parse(localStorage.getItem("ciudades"));
    let estado = document.getElementById('estado').value;
    data.forEach(element => {
        if(element.Estado == estado){
            ciudades.push(element.Ciudad);
        }
    });
    let select = document.getElementById('ciudad');
    select.options.length = 1;
    ciudades.forEach(ciudad => {
        let option = document.createElement("option");
        option.value = ciudad;
        option.text = ciudad;
        select.add(option);
    });
}

function getIdLocation(){
    let data = JSON.parse(localStorage.getItem("ciudades"));
    let ciudad = document.getElementById('ciudad').value;
    let estado = document.getElementById('estado').value;
    let pais = document.getElementById('pais').value; 
    data.forEach(element => {
        if(ciudad == element.Ciudad && estado == element.Estado && pais == element.Pais){
            document.getElementById('ciudadIdRegistro').value = element.CiudadId;
            document.getElementById('zipCode').value = element.ZipCode;
        }
    });
}