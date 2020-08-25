//comando para establecer la conexion

var socket = io();

var label = $("#lblNuevoTicket"); // nos ubicamos en el id del html con ese nombre
socket.on("connect", function () {
  console.log("Conectado al servidor");
});

socket.on("disconnect", function () {
  console.log("Desconectado del servidor");
});

//para cargar el estado actual de los tickets y imprimrilos en el html
socket.on("estadoActual", function (resp) {
  console.log(resp);
  label.text(resp.actual); //modificamos el campo en el html
});

//jquery: todos los tickets al hacer click en el button van disparar una accion
$("button").on("click", function () {
  //emitimos el nuevo ticket, reciviremos el siguiente ticket para poder imprimirlo en el html
  socket.emit("SiguienteTicket", null, function (SiguienteTicket) {
    label.text(SiguienteTicket); //modificamos el campo en el html
  });
});
