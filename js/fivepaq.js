var fivepaq = {

	Login: function (email, password, rememberMe, LoginOk, LoginFail) {

		sessionStorage.removeItem('appData')



		var dataIn = new Object();

		dataIn.T = '';

		dataIn.U = '';

		dataIn.C = '';

		dataIn.L = false;

		dataIn.E = email;

		dataIn.N = '';

		dataIn.Tel = '';

		dataIn.Con = ''; 



		var datos = {

			Email: email,

			Password: password,

			RememberMe: rememberMe

		};



		var ajaxObj = {

			type: 'POST',

			url: "https://fpaqtest.azurewebsites.net/api/auth",

			contentType: 'application/json; charset=utf-8',

			data: JSON.stringify(datos)

		};



		$.ajax(ajaxObj)

			.done(function (result) {



				console.log(result);

				if (result.token != '') {

					dataIn.T = result.token;

					dataIn.U = '';

					dataIn.C = '';

					dataIn.L = true;

					dataIn.E = email;

					dataIn.Tel = '';

					dataIn.Con = ''; 

					fivepaq.cargarDataUser(dataIn, LoginOk, LoginFail);

				}

			})

			.fail(function (jqXHR, textStatus) {

				console.log(jqXHR);

				console.log(textStatus);

				LoginFail();

			})

	},



	cargarDataUser: function (dataIn, LoginOk, LoginFail) {

		var infUrl = "https://fpaqtest.azurewebsites.net/api/auth/userinfo/" + dataIn.E;



		var ajaxObj = {

			type: 'GET',

			url: infUrl,

			contentType: 'application/json; charset=utf-8',

			headers: {

				'Authorization': 'Bearer ' + dataIn.T

			}

		};



		var request = $.ajax(ajaxObj);



		request.fail(function (jqXHR, textStatus) {



			console.log(jqXHR);

			dataIn.T = '';

			dataIn.L = false;

			sessionStorage.setItem('appData', JSON.stringify(dataIn));

			LoginFail();

		});



		request.done(function (result) {



			if (result.ClienteId > 0) {

				dataIn.U = result.Nombre;

				dataIn.C = result.ClienteId;

				dataIn.N = result.Cuenta;

				dataIn.Tel = result.Telefono;

				dataIn.L = true;

				dataIn.Con = result.ConvenioId; /* cambioll */

				sessionStorage.setItem('appData', JSON.stringify(dataIn));

				LoginOk();

			} else {



				dataIn.T = '';

				dataIn.L = false;

				sessionStorage.setItem('appData', JSON.stringify(dataIn));

				LoginFail();

			}

		});

	},



	dataOut: function () {

		var obj = JSON.parse(sessionStorage.getItem('appData'));

		return obj;

	},



	logOut: function () {

		sessionStorage.removeItem('appData');

		window.location.href = "https://fivepaq.com/";

	},



	cargarCarriers: function (CarriersOk, CarriersFail) {

		var infUrl = "https://fpaqtest.azurewebsites.net/api/carriers";

		var dataIn = fivepaq.dataOut();



		var ajaxObj = {

			type: 'GET',

			url: infUrl,

			contentType: 'application/json; charset=utf-8',

			headers: {

				'Authorization': 'Bearer ' + dataIn.T

			}

		};



		var request = $.ajax(ajaxObj);



		request.fail(function (jqXHR, textStatus) {

			CarriersFail();

		});



		request.done(function (result) {

			CarriersOk(result);

		});

	},



	cargarDireccionesCliente: function () {

		var dataIn = fivepaq.dataOut();

		var infUrl = "https://fpaqtest.azurewebsites.net/api/locations/" + dataIn.C;



		var ajaxObj = {

			type: 'GET',

			url: infUrl,

			contentType: 'application/json; charset=utf-8',

			headers: {

				'Authorization': 'Bearer ' + dataIn.T

			}

		};



		var request = $.ajax(ajaxObj);



		request.done(function (result) {

			DireccionesOk(result);

		});

		request.fail(function (jqXHR, textStatus) {

			/* console.log(jqXHR); */

			// DireccionesFail();

		});

	},

	CuentaAdd: function (ConvenioCta, Documento, Empresa, Nombre, Direccion, CiudadId, CodigoPostal, Telefono, Password, EMail, Asesor, Ticket) {

		Cuenta = new Object();
		

		Cuenta.Convenio = "NW";

		Cuenta.LlaveConvenio = "6b30df84-5688-4bdc-ba8c-cdccd77dd64a";

		Cuenta.ConvenioCta=ConvenioCta

		Cuenta.Documento = Documento

		Cuenta.Empresa = Empresa

		Cuenta.Nombre = Nombre

		Cuenta.Direccion = Direccion

		Cuenta.CiudadId = CiudadId

		Cuenta.CodigoPostal = CodigoPostal

		Cuenta.Telefono = Telefono

		Cuenta.Password = Password

		Cuenta.EMail = EMail

		Cuenta.Asesor = Asesor

		Cuenta.TicketId = Ticket



		$.ajax({

			url: "https://fpaqtest.azurewebsites.net/api/cuentas",

			type: 'POST',

			contentType: "application/json;charset=utf-8",

			data: JSON.stringify(Cuenta),

			success: function (noCuenta) {

				CuentaSuccess(noCuenta);

			},

			error: function (request, message, error) {

				handleException(request, message, error);

			}

		});
		

	},

	CargarCiudades: function () {



		var ajaxObj = {

			type: 'GET',

			url: "https://fpaqtest.azurewebsites.net/api/Ciudades/",

			contentType: 'application/json; charset=utf-8'

		};



		var request = $.ajax(ajaxObj);

		request.done(function (result) {

			localStorage.setItem("ciudades", JSON.stringify(result));

		});



		request.fail(function (jqXHR, textStatus) {

			console.log(jqXHR);

			console.log(textStatus);

		});

	},

	getCiudades: function (request, response) {

		if (request != null) {

			var data = JSON.parse(localStorage.getItem('ciudades'));



			var array = data.error ? [] : $.map(data, function (m) {

				if (m.Nombre.toUpperCase().includes(request.term.toUpperCase())) {

					return {

						label: m.Nombre,

						value: m.CiudadId,

						type: m.TipoCiudadId

					};

				}

			});

			response(array);

		}

	},



	getUrlVariables: function () {

		var vars = {};

		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {

			vars[key] = value;

		});

		return vars;

	},

	changePass: function (OldPassword, NewPassword) {

		Datos = new Object();

		var code = JSON.parse(sessionStorage.getItem('appData'));

		Datos.Email = code.E;

		Datos.OldPassword = OldPassword;

		Datos.NewPassword = NewPassword;



		var ajaxObj = {

			url: "https://fpaqtest.azurewebsites.net/api/Cuentas/ChangePassword",

			type: 'POST',

			contentType: "application/json;charset=utf-8",

			data: JSON.stringify(Datos)

		}

		$.ajax(ajaxObj)

			.done(function (result) {

				console.log("cambioPass");

				console.log(result);

				sessionStorage.removeItem("appData");

				Swal.fire({

					title: '¡Se  ha cambiado tu contraseña.!',

					text: "Por favor inicia sesión nuevamente",

					type: 'success',

					confirmButtonText: 'Ok',

					allowOutsideClick: false,

				}).then((result) => {

					location.href = "index.html"

				})

			})

			.fail(function (jqXHR, textStatus) {

				console.log("sadRequest");

				console.log(jqXHR);

				console.log(textStatus);

				Swal.fire({

					title: '¡Algo paso!',

					text: "Revisa tu contraseña actual",

					type: 'error',

					confirmButtonText: 'Ok',

				})

			})



	},

	forgotPass: function (Email) {

		Datos = new Object();

		Datos.Email = Email;

		var ajaxObj = {

			url: "https://fpaqtest.azurewebsites.net/api/cuentas/forgotpassword",

			type: 'POST',

			contentType: "application/json;charset=utf-8",

			data: JSON.stringify(Datos)

		}

		$.ajax(ajaxObj)

			.done(function (result) {

				console.log("Envio mail");

				Swal.fire({

					title: '¡Te Enviamos un Email!',

					text: "Te hemos enviado un correo electrónico con instrucciones para volver a establecer tu contraseña.",

					type: 'success',

					confirmButtonText: 'Ok',

					allowOutsideClick: false,

				}).then((result) => {

					if (result.value) {

						location.href = "../index.html";

					}

				})

			})

			.fail(function (jqXHR, textStatus) {

				console.log("sadRequest");

				console.log(jqXHR);

				console.log("sadRequest");

				console.log(textStatus);

				swal.fire({

					title: '¡Algo paso!',

					text: 'por favor comunique con nosotros al Email: soporte@fivepaq.com',

					type: 'error',

					confirmButtonText: 'Ok',

					allowOutsideClick: false,

				}).then((result) => {

					if (result.value) {

					}

				})

			})

	},

	saveNewPass: function (Password, Code, Email, ConfirmPassword) {

		Datos = new Object();

		Datos.Email = Email;

		Datos.Password = Password;

		Datos.ConfirmPassword = ConfirmPassword;

		Datos.Code = Code;

		var ajaxObj = {

			url: "https://fpaqtest.azurewebsites.net/api/cuentas/resetpassword",

			type: 'POST',

			contentType: "application/json;charset=utf-8",

			data: JSON.stringify(Datos)

		}

		$.ajax(ajaxObj)

			.done(function (result) {

				console.log("ResteoPass");

				console.log(result);

				swal.fire({

					title: '¡Se ha restablecido la contraseña!',

					text: "Inicia sesión nuevamente",

					type: 'success',

					confirmButtonText: 'Ok',

					allowOutsideClick: false,

				}).then((result) => {

					if (result.value) {

						location.href = "../index.html";

					}

				})

			})

			.fail(function (jqXHR, textStatus) {



				console.log("sadRequest");

				console.log(jqXHR);

				console.log(textStatus);

				swal.fire({

					title: '¡Algo paso!',

					text: "por favor comunique con nosotros al Email: soporte@fivepaq.com",

					type: 'error',

					confirmButtonText: 'Ok',

					allowOutsideClick: false,

				}).then((result) => {

					if (result.value) {

						location.href = "../index.html";

					}

				})

			})



	},

	prealertaImage: function (clientID,

		trackingNumber, idCarrier, idLocation, TariffCode, description) {

		var dataIn = fivepaq.dataOut();

		let formData = new FormData();

		formData.append('clientID', clientID);

		formData.append('trackingNumber', trackingNumber);

		let imagen = document.getElementById('ImageUrl').files[0];

		formData.append('ImageUrl', imagen);

		formData.append('idCarrier', idCarrier);

		formData.append('description', description);

		formData.append('idLocation', idLocation);

		formData.append('TariffCode', TariffCode);



		$.ajax({

			url: "https://fpaqtest.azurewebsites.net/api/PreAlerts/CreatePrealertWithImageAsync",

			type: 'POST',

			contentType: false,

			processData: false,

			data: formData,

			headers: {

				'Authorization': 'Bearer ' + dataIn.T

			},

			success: function (response) {

				AlertSuccessImage(response);

			},

			error: function (request, message, error) {

				console.log(message);

				console.log(error);

				swal.fire({

					title: '¡Algo paso!',

					text: "por favor comunique con nosotros al Email: soporte@fivepaq.com",

					type: 'error',

					confirmButtonText: 'Ok',

					allowOutsideClick: false,

				})

			}

		});

	},

	prealertaValue: function (clientID,

		trackingNumber, idCarrier, idLocation, TariffCode, description, value) {

		var dataIn = fivepaq.dataOut();

		Alerta = new Object();

		Alerta.clientID = clientID;

		Alerta.trackingNumber = trackingNumber;

		Alerta.value = value;

		Alerta.idCarrier = idCarrier;

		Alerta.description = description;

		Alerta.idLocation = idLocation;

		Alerta.TariffCode = TariffCode;

		$.ajax({

			url: "https://fpaqtest.azurewebsites.net/api/PreAlerts/CreatePrealertWithValueAsync",

			type: 'POST',

			contentType: "application/json;charset=utf-8",

			data: JSON.stringify(Alerta),

			contentType: 'application/json; charset=utf-8',

			headers: {

				'Authorization': 'Bearer ' + dataIn.T

			},

			success: function (response) {

				AlertSuccessValue(response);



			},

			error: function (request, message, error) {

				console.log(request);

				console.log(message);

				console.log(error);

				swal.fire({

					title: '¡Algo Sucedió!',

					text: request.responseText,

					type: 'error',

					confirmButtonText: 'Ok',

					allowOutsideClick: false,

				})

			}

		});

	},



};