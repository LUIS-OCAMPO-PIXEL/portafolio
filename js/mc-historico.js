"use strict";

const paqBaseUrl = "https://fpaq.azurewebsites.net/api/packages/";
const paqBaseUrlDetail =
  "https://fpaq.azurewebsites.net/api/Packages/GetPackageDetail";

Vue.filter("formatDate", function (value) {
  if (value) {
    return moment(value).subtract(5, "h").format("DD/MM/YYYY hh:mm a");
  }
});

Vue.filter("formatNumber", function (value) {
  return value.toFixed();
});

const vhis = new Vue({
  el: "#appHis",
  data: {
    results: [],
    tracking: {},
  },
  mounted() {
    this.getPaqs();
  },
  methods: {
    pdf(packageId,DateDelivery){
      packageId
      var array=DateDelivery.split('-');
      var respuesta=array[0];
      // fecha='';
      // let datos=DateDelivery.split('-');
      // let fecha=datos[0];
      // console.log("esta "+fecha)   
  
      
  
        var url = 'https://aduanas.auropaq.com/api/auth';
  var data = {
    Email: 'programador@auropaq.com',
    Password: 'Ll@v3Segur@2022',
    RememberMe: false
  };
  var token = '';
  async function solicitarToken() {
    try {
      const response = await fetch(url, {
        method: 'POST',
        cache: "no-cache",
        headers: {
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin": ["*"]
        },
        body: JSON.stringify(data)
      });
    
      if (!response.ok) {
        throw new Error('Error al obtener el token');
      }
    
      const tokenData = await response.json();
      const newToken = tokenData.token;
    
      console.log('Token recibido:', newToken);
      return newToken;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }
  async function realizarSolicitud() {
   
    try {
              const token = await solicitarToken();
            
              if (!token) {
                console.error('No se pudo obtener el token');
                return;
              }
            
              const fetchOptions = {
                method: 'GET',
                
                headers: {
                  'Authorization': 'Bearer ' + token,
                  "Access-Control-Allow-Origin": ["*"]
                }
              };
              
              
              // const form = document.getElementById('miFormulario');
  
              // // Manejar el evento de envío del formulario
              // form.addEventListener('submit',async (event) => {
              // event.preventDefault(); // Prevenir el envío por defecto del formulario
  
              // Obtener los valores de los campos del formulario
  
             
            let string=packageId
            //   let array = DateDelivery.split('-');
            //   let maestra =array[0];
            //  console.log("esta es maetra"+maestra)
  
  
              // Codificar los datos para incluirlos en la URL de destino
               var nombreCodificado = encodeURIComponent(string);
              // var correoCodificado = encodeURIComponent(maestra);
              
              // Construir la URL de destino con los datos del formulario '+string+'
              const urlDestino = 'https://aduanas.auropaq.com/api/ReportFactory/GetReportDocumentt/'+nombreCodificado+'/2';
              console.log('this is url '+urlDestino)
              // Realizar la solicitud GET con los datos del formulario en la URL de destino'+respuesta+'
            
            
                var response = await fetch(urlDestino, fetchOptions);
              
  
                if (!response.ok) {
                  throw new Error('Error al obtener el documento del informe'+response+'hola');
                }
                
              
                const responseData = await response.json();
  
                const pdfViewer = document.getElementById('pdf-Viewer');
                const cabecera = "data:application/pdf;base64,";
                pdfViewer.src = cabecera + responseData.Value;
                //var imprimir= pdfViewer;
             
                console.log("soy pdf"+response);
                
              
              
      } catch (error) {
                console.error('Error:', error);
  }
  
  }
  // function printpage(){
  //   var im =document.getElementById('pdf-Viewer').innerHTML; 
  //   document.getElementById('im').innerHTML=im;
  //      var imprimir= window.print('im')}
       
  
  //Realizar la solicitud inicialmente
  realizarSolicitud();
  
  // Programar la solicitud cada 24 horas
  setInterval(solicitarToken, 24 * 60 * 60 * 1000); // 24 horas en milisegundos}
  
       
      },
    mouseover: function () {
      this.results.DeclaredValue = "Good!";
    },
    mouseleave: function () {
      this.results.DeclaredValue = "Hover Me!";
    },
    getPaqs() {
      var dataout = JSON.parse(sessionStorage.getItem("appData"));
      let url = `${paqBaseUrl + dataout.C}/1000`;
      axios
        .get(url, {
          headers: {
            Authorization: "Bearer " + dataout.T,
          },
        })
        .then((response) => {
          this.loading = false;
          this.results = response.data;
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    openModal(packageId) {
      var dataout = JSON.parse(sessionStorage.getItem("appData"));
      let url = paqBaseUrlDetail + "/" + packageId + "/" + dataout.N;
      axios
        .get(url, {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + dataout.T,
          },
        })
        .then((response) => {
          let objResponse = response.data;
          let tracking = objResponse.Tracking;
          tracking.sort(
            (a, b) => new Date(b.DateState) - new Date(a.DateState)
          );
          this.tracking = objResponse;
        })
        .catch((error) => {
          console.log(error);
        });
      window.location = "#modal1";
    },
  },
});
