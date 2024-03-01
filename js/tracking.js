async function trackingHub() {
  try {
    let guia = parseInt(document.getElementById("numeroGuia").value);
    let urlTracking = `https://fpaq.azurewebsites.net/api/Packages/GetPackageTracking/${guia}`;

    let requestOptions = {
      method: "GET",
    };

    let request = await fetch(urlTracking, requestOptions);
    if (request.status === 200) {
      let response = await request.json();
      return response.Tracking;
    }
  } catch (ex) {
    console.log(ex);
  }
}

async function obtenerTraza(e) {
  e.preventDefault();
  let tracking = await trackingHub();
  console.log(tracking);
  let trackingDiv = document.getElementById("divTracking");
  trackingDiv.innerHTML = "";
  document.getElementById("filaTracking").hidden = false;

  tracking.forEach((item) => {
    trackingDiv.innerHTML += `
                <tr>
                  <td>${item.StateCode}</td>
                  <td>${item.DescriptionState}</td>
                  <td>${horarioUTC_5(item.DateState)}</td>
                </tr>
        `;
  });
}

function horarioUTC_5(fecha) {
  let difHoraria_5 = 1000 * 60 * 60 * 5;
  let d = new Date(fecha);
  let hora_UTC_5 = d - difHoraria_5;
  let hUTC = new Date(hora_UTC_5);
  let day = hUTC.getDate() + "/";
  let month = hUTC.getMonth() + 1 + "/";
  let year = hUTC.getFullYear() + " ";
  let hour = hUTC.getHours() + ":";
  let minutes = hUTC.getMinutes() + "";
  minutes = minutes > 9 ? minutes : "0" + minutes;
  let fechaUTCBog = month + day + year + hour + minutes;
  return fechaUTCBog;
}
