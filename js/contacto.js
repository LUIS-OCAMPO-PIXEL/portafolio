async function contactoCotizacion() {
    let valorNombre = document.getElementById('nombreCotizacion').value;
    let valorApellido = document.getElementById('apellidoCotizacion').value;
    let valorCorreo = document.getElementById('emailCotizacion').value;
    let valorNumeroTelefono = document.getElementById('telefonoCotizacion').value;
    let valorMensaje = document.getElementById('mensajeCotizacion').value;

    let nombre = `${valorNombre} ${valorApellido}`;
    let correo = valorCorreo;
    let mensaje = `${valorMensaje} NumeroContacto: ${valorNumeroTelefono}`;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "34a0157feba2f4d6813e7528ee9b1f3b212689c48bed0dae29a0e6dbc2543819");

    var raw = JSON.stringify({
        "request": {
            "priority": "normal",
            "requester": {
                "name": nombre
            },
            "subject": `Cotización desde pagina web BoxCargo ${correo}`,
            "comment": {
                "body": mensaje
            },
            "custom_fields": [{
                    "id": 360027661252,
                    "value": "0"
                },
                {
                    "id": 360028979132,
                    "value": "BOXCARGO"
                }
            ]
        }
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    await fetchRequest(requestOptions);
}

async function contacto() {
    let valorNombre = document.getElementById('nombreContacto').value;
    let valorCorreo = document.getElementById('emailContacto').value;
    let valorNumeroTelefono = document.getElementById('telefonoContacto').value;
    let valorMensaje = document.getElementById('mensajeContacto').value;

    let nombre = valorNombre;
    let correo = valorCorreo;
    let mensaje = `${valorMensaje} NumeroContacto: ${valorNumeroTelefono}`;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "34a0157feba2f4d6813e7528ee9b1f3b212689c48bed0dae29a0e6dbc2543819");

    var raw = JSON.stringify({
        "request": {
            "priority": "normal",
            "requester": {
                "name": nombre
            },
            "subject": `Contacto desde pagina web BoxCargo ${correo}`,
            "comment": {
                "body": mensaje
            },
            "custom_fields": [{
                    "id": 360027661252,
                    "value": "0"
                },
                {
                    "id": 360028979132,
                    "value": "BOXCARGO"
                }
            ]
        }
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    await fetchRequest(requestOptions);
}
async function fetchRequest(requestOptions) {

    try {
        const requestZendesk = "https://auropaq.zendesk.com/api/v2/requests.json";
        let response = await fetch(requestZendesk, requestOptions);
        let divDone = document.getElementById('contact-alert-success');
        divDone.removeAttribute("hidden");

    } catch (error) {
        console.log('error', error);
    }
}