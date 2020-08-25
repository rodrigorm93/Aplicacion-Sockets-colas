const { io } = require("../server");

const { TicketControl } = require("../classes/ticket-control");

//disparamos el contructor de la clase
const ticketControl = new TicketControl();

io.on("connection", (client) => {
  //recivmos la peticion del cliente para el sigueinte tocket y utilizamos una funcion de la clase
  //TicketControl
  //para imprimir en el html debemos recibir un callback desde socket-nevo-ticket.js
  client.on("SiguienteTicket", (data, callback) => {
    let siguiente = ticketControl.siguiente();

    console.log(siguiente);
    callback(siguiente);
  });

  //emitir un evento para llamr el estado actual etornando el ultimo ticket

  client.emit("estadoActual", {
    actual: ticketControl.getUltimoTicket(),
    ultimos4: ticketControl.getUltimos4(),
  });

  //vamos a escuhar el siguiente evento

  client.on("atenderTicket", (data, callback) => {
    if (!data.escritorio) {
      //obligamos a mandar el escritorio.
      return callback({
        err: true,
        mensaje: "El escritorio es necesario",
      });
    }

    //aqui ya sabemos que ticket le toca a ese escrritorio
    let atenderTicket = ticketControl.atenderTicket(data.escritorio);

    callback(atenderTicket);

    //para actualizar la pantalla publica cuando asignemos un nuevo ticket
    client.broadcast.emit("ultimos4", {
      ultimos4: ticketControl.getUltimos4(),
    });

    //actualizar /notificar cambios en los utlimo 4
    //para actualizar la pantalla
  });
});
