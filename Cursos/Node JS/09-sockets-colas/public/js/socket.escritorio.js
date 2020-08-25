var socket = io();

//vamos a obtener el parametro del url donde se le asigan el escritorio

var searchParams = new URLSearchParams(window.location.search);
if (!searchParams.has("escritorio")) {
  //si no mandamos el escritorio como parametro nos enviaremos al index
  window.location = "index.html";
  throw new Error("El escritorio es necesario");
}

//si vien informaicon del escritorio

var escritorio = searchParams.get("escritorio");

var label = $("small");

console.log(escritorio);

$("h1").text("Escritorio " + escritorio);

$("button").on("click", function () {
  socket.emit("atenderTicket", { escritorio: escritorio }, function (resp) {
    console.log(resp);

    if (resp === "No hay tickets") {
      label.text(resp);
      alert(resp);
      return;
    }
    label.text("Ticket " + resp.numero);
  });
});
