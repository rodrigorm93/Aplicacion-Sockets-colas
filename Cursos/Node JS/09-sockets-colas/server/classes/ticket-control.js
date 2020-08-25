const fs = require("fs");

//para manejar los tickets pendientes tendremos la clase ticket

class Ticket {
  //nnumero: el numero de ticket que atendere y  que escritorio lo va atender
  constructor(numero, escritorio) {
    this.numero = numero;
    this.escritorio = escritorio;
  }
}

//creamos una clase ES6
class TicketControl {
  constructor() {
    this.ultimo = 0; //e mi ultimo ticket
    this.hoy = new Date().getDate(); //para saber que dia es hoy

    this.tickets = []; //tendremos los tickets pendientes

    this.ultimos4 = [];

    //guadaremos la informacion en un json para saber en donde esta el ultimo ticket

    let data = require("../data/data.json");

    //cada vez que empieza un nuevo idea reiniciamos los tickets
    if (data.hoy === this.hoy) {
      //si estamos en el mismo dia entonces la informacion del ultimo sera igual lo que este en la data
      this.ultimo = data.ultimo;
      this.tickets = data.tickets;
      this.ultimos4 = data.ultimos4;

      //si los dias son iguales significa que estamos en el mismo dia sino es otro dia y einiciamos todo
    } else {
      this.reiniciarConteo();
    }

    console.log(data);
  }

  //funcion para cambiar el ticket

  siguiente() {
    //debe incremetan el 1 el ultimo ticket
    this.ultimo += 1;

    //cremaos un  nuevo ticket le pasamos el numero y null en el escritorio,
    //porque no sabemos cual escritorio es el que loa tendera

    let ticket = new Ticket(this.ultimo, null);

    //lo s agregamos al arreglo de tickets

    this.tickets.push(ticket);

    //debemos guardar el nuevo ultimo
    this.grabarArchivo();

    return `Ticket ${this.ultimo}`;
  }

  //funcion para ver el estado actual de los tickets y mostraslo en el html
  getUltimoTicket() {
    return `Ticket ${this.ultimo}`;
  }

  //nos entrega los ultimos 4 registros que tenemos ingresados ahi
  getUltimos4() {
    return this.ultimos4;
  }

  //vamos aponer el numerod e escritorio al cual le asignaremos el ticket
  atenderTicket(escritorio) {
    //validaciones: sino hay ticket pendiente
    if (this.tickets.length === 0) {
      return "No hay tickets";
    }

    //obtner el numero del primer ticket pendiente
    let numeroTicket = this.tickets[0].numero;
    //luego lo borramos el rpimer elemento
    this.tickets.shift();

    let atenderTicket = new Ticket(numeroTicket, escritorio); //asiganamos el ticket+
    //ese ticket lo colocaremos al inicio del arreglo
    this.ultimos4.unshift(atenderTicket);

    // si supera los 4 debemos ir boorando lo que ya van saliendo

    if (this.ultimos4.length > 4) {
      //borramos el ultimo del areglo par ir moviendonos
      this.ultimos4.splice(-1, 1);
    }

    console.log("Ultimos 4");
    console.log(this.ultimos4);

    this.grabarArchivo(); //grabamos enb la base de datos

    //retoernaos el ticket que debo atender

    return atenderTicket;
  }
  //si estamos en diferente dia al dia que esta gurdado en el json llamaremos la funcion
  //reiniciar para reinicar los tickets

  reiniciarConteo() {
    this.ultimo = 0;
    this.tickets = []; //tambien reiniciamos la cola de tickets
    this.ultimos4 = [];
    console.log("Se ha inicializado el sistema");
    this.grabarArchivo();
  }

  //grabar en el archivo json

  grabarArchivo() {
    //oobtenemos la ifnromacion a guardar en el json
    let jsonData = {
      ultimo: this.ultimo,
      hoy: this.hoy,
      tickets: this.tickets, //grabamos los tickets pendientes
      ultimos4: this.ultimos4,
    };

    let jsonDataString = JSON.stringify(jsonData);
    fs.writeFileSync("./server/data/data.json", jsonDataString);
  }
}

module.exports = {
  TicketControl,
};
