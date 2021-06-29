import anuncio_auto from "./anuncio_auto.js";
//let anuncios=JSON.parse(localStorage.getItem("lista")) || [];
let anuncios = [];
let checkCamposMostrar = [];
window.addEventListener("DOMContentLoaded", () => {
  //TraerTodoAjax();
  TraerTodoFetch();
  document.addEventListener("click", handlerClick);
  let Filtros = document.getElementById("filtros");
  Filtros.addEventListener("change", handlerOnChange);
  let ckecks = document.getElementById("divTablaCampos");
  ckecks.addEventListener("change", handlerCheck);
});

function handlerCheck(e) {
  let inputsCheck = document.querySelectorAll("div>div>input[type=checkbox]");
  //anuncios.filter((a) => a.transaccion == TipoFiltro);
  inputsCheck.forEach(element => {
      if(element.checked)
      {
          if(!checkCamposMostrar.find((a)=>a==element.value))
       {checkCamposMostrar.push(element.value);} 
      }
  });

  handlerLoadList();
 // checkCamposMostrar = inputsCheck.filter((C) => C.checked);
  //    let camposSeleccionados= document.querySelectorAll('input[type=ckeckbox]');
  //    console.log(camposSeleccionados);
}
function handlerSubmit(e) {
  e.preventDefault();
  let frm = document.forms[0];

  const nuevoAnuncio = new anuncio_auto(
    Date.now(),
    frm.titulo.value,
    frm.transaccion.value,
    frm.descripcion.value,
    frm.precio.value,
    frm.puertas.value,
    frm.kilometros.value,
    frm.potencia.value,
    true
  );

  if (anuncios.length > 0) {
    AgregarSpinner();
    AltaAjax(nuevoAnuncio);
  }
  LimpiarFormulario(frm);
}

function AgregarSpinner() {
  let spinner = document.createElement("img");
  spinner.setAttribute("src", "./assets/3D spinning wheel.gif");
  spinner.setAttribute("alt", "spinner imagen");
  document.getElementById("spinner-container").appendChild(spinner);
}
function EliminarSpinner() {
  document
    .getElementById("spinner-container")
    .removeChild(
      document.getElementById("spinner-container").firstElementChild
    );
}
function almacenarData(data) {
  localStorage.setItem("lista", JSON.stringify(data));
  handlerLoadList();
}

function leeData() {
  anuncios = JSON.parse(localStorage.getItem("lista"));
}

function LimpiarFormulario(frm) {
  frm.reset();
  // document.getElementById('TituloFormulario').textContent="Formulario de alta de anuncio";
  document.getElementById("Submit").removeAttribute("class", "oculto");
  document.getElementById("Submit").setAttribute("class", "button button1");
  // const submit = document.querySelector("#Submit");
  // submit.classList.toggle("mostrar");
  document.forms[0].id.value = "";
}

function altaAnuncio(p) {
  // anuncios.push(p);
  almacenarData(anuncios);
  //handlerLoadList();
}
function handlerLoadList(e) {
  let TablaCampos = CrearCamposMostrar(anuncios[0]);
  let divCampos = document.getElementById("divTablaCampos");
  divCampos.appendChild(TablaCampos);
  RenderizarLista(CrearTabla(anuncios), document.getElementById("divTabla"));
}
function handlerDeleteList(e) {
  RenderizarLista(null, document.getElementById("divTabla"));
}
function RenderizarLista(lista, contenedor) {
  while (contenedor.hasChildNodes()) {
    contenedor.removeChild(contenedor.firstChild);
  }
  if (lista) {
    contenedor.appendChild(lista);
  }
}

function CrearTabla(items) {
  const Tabla = document.createElement("table");

  Tabla.append(crearThead(items[0]));
  Tabla.appendChild(CrearTbody(items));
  return Tabla;
}
function CrearCamposMostrar(item) {
  let divCamposParaSeleccionar = document.createElement("div");

  for (const key in item) {
    if (key === "id") {
    } else if (key !== "activo") {
      const divContienecheck = document.createElement("div");
      const check = document.createElement("input");
      check.type = "checkbox";
      check.value = key;
      check.checked = true;
      const texto = document.createTextNode(key);
      divContienecheck.appendChild(check);
      divContienecheck.appendChild(texto);
      divContienecheck.setAttribute("class", "divTablaCampos");
      divCamposParaSeleccionar.setAttribute("class", "divTablaCampos");
      divCamposParaSeleccionar.appendChild(divContienecheck);
      checkCamposMostrar.push(check.value);
    }
  }
  console.log(checkCamposMostrar);
  return divCamposParaSeleccionar;
}
function crearThead(item) {
  const Thead = document.createElement("thead");
  const Tr = document.createElement("tr");

  for (const key in item) {
    for (let i = 0; i < checkCamposMostrar.length; i++) {
      console.log(checkCamposMostrar[i]);
      //console.log(campo.value);
      if (key === "id") {
        Tr.setAttribute("data-id", key);
      } else if (key !== "activo" && key == checkCamposMostrar[i]) {
        
        const th = document.createElement("th");

        const texto = document.createTextNode(key);

        th.appendChild(texto);
        Tr.appendChild(th);
      }
    }
  }
  Thead.appendChild(Tr);
  return Thead;
}



function CrearTbody(items) {
  const Tbody = document.createElement("tbody");

  items.forEach((element) => {
    const Tr = document.createElement("tr");
    for (const key in element) {
      for (let i = 0; i < checkCamposMostrar.length; i++) {
        if (key === "id") {
          Tr.setAttribute("data-id", element[key]);
        } else if (key !== "activo" && key == checkCamposMostrar[i]) {
          console.log(checkCamposMostrar[i]);
          //console.log(campo.value);
          const td = document.createElement("td");
          const contenido = document.createTextNode(element[key]);
          td.appendChild(contenido);
          Tr.appendChild(td);
        }
      }
    }
    Tbody.appendChild(Tr);
  });
  return Tbody;
}

function ModificarDatosAnuncio() {
  document.getElementById("Submit").setAttribute("class", "oculto");

  let frm = document.forms[0];

  const AnuncioEditado = new anuncio_auto(
    parseInt(frm.id.value),
    frm.titulo.value,
    frm.transaccion.value,
    frm.descripcion.value,
    frm.precio.value,
    frm.puertas.value,
    frm.kilometros.value,
    frm.potencia.value,
    true
  );

  if (confirm("confirma modificacion?")) {
    let index = anuncios.findIndex((el) => {
      return el.id == AnuncioEditado.id;
    });
    AgregarSpinner();
    ModificarAjax(AnuncioEditado);
  }

  LimpiarFormulario(frm);
}

function Cargarformulario(id) {
  const {
    titulo,
    transaccion,
    descripcion,
    precio,
    puertas,
    kilometros,
    potencia,
  } = anuncios.filter((a) => a.id === parseInt(id))[0];
  const frm = document.forms[0];
  frm.titulo.value = titulo;
  frm.descripcion.value = descripcion;
  frm.transaccion.value = transaccion;
  frm.precio.value = precio;
  frm.puertas.value = puertas;
  frm.kilometros.value = kilometros;
  frm.potencia.value = potencia;
  frm.id.value = id;
  document.getElementById("Submit").setAttribute("class", "oculto");
  // document.getElementById('TituloFormulario').textContent="Modificacion de datos de anuncio";
}

function handlerOnChange(e) {
  AplicarFiltro(document.querySelector("#Filtros").value);
}
function handlerClick(e) {
  if (e.target.matches("#btnModificar")) {
    if (document.forms[0].id.value != "") {
      ModificarDatosAnuncio(0);
      console.log("hiciste click en el boton Modificar");
    }
  }

  if (e.target.matches("#Submit")) {
    const frm = document.forms[0];
    let inputVacio = false;
    switch (true) {
      case frm.titulo.value.trim() == "":
      case frm.descripcion.value.trim() == "":
      case frm.transaccion.value.trim() == "":
      case frm.precio.value.trim() == "":
      case frm.puertas.value.trim() == "":
      case frm.kilometros.value.trim() == "":
      case frm.potencia.value.trim() == "":
        inputVacio = true;
        break;
    }
    let Aviso = document.getElementById("divAviso");
    if (inputVacio) {
      Aviso.setAttribute("class", "divAviso");
    } else {
      handlerSubmit(e);
      Aviso.setAttribute("class", "divAvisoOculto");
    }

    //console.log("hiciste click en el boton guardar");
  }
  if (e.target.matches("#btnEliminar")) {
    console.log("hiciste click en el boton Eliminar");
    let id = parseInt(document.forms[0].id.value);
    if (document.forms[0].id.value != "") {
      if (confirm("confirma Eliminacion?")) {
        AgregarSpinner();
        EliminarFetch(document.forms[0].id.value);
        //EliminarAjax(document.forms[0].id.value);
      }
      LimpiarFormulario(document.forms[0]);
    } else {
      LimpiarFormulario(document.forms[0]);
    }
  }
  if (e.target.matches("#btnCancelar")) {
    //console.log("hiciste click en el boton Cancelar");
    LimpiarFormulario(document.forms[0]);
  }
  if (e.target.matches("td")) {
    let id = e.target.parentNode.dataset.id;
    Cargarformulario(id);
    //ModificarDatosAnuncio(e);
    console.log(id);
  }
}

//GET
//let anuncios = [];
function TraerTodoAjax() {
  AgregarSpinner();

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 299) {
        anuncios = JSON.parse(xhr.responseText);
        console.log(anuncios);
      } else {
        const statusText = xhr.statusText || "Ocurrio un error";

        console.error(`Error: ${xhr.status} : ${statusText}`);
      }

      EliminarSpinner();
      //seteo promerio de todos
      let Promedio = document.querySelector("#promedio");
      let sum = anuncios.reduce(function (total, currentValue) {
        return total + parseInt(currentValue.precio, 10);
      }, 0);
      Promedio.value = sum / anuncios.length;
      ///
      if (anuncios.length > 0) {
        handlerLoadList(anuncios);
      }
    }
  };
  xhr.open("GET", "http://localhost:3500/anuncios");
  xhr.send();
}
function TraerTodoFetch() {
  AgregarSpinner();
  fetch("http://localhost:3500/anuncios")
    .then((res) => {
      return res.ok ? res.json() : Promise.reject(res);
    })
    .then((data) => {
      anuncios = data;
      let Promedio = document.querySelector("#promedio");
      let sum = anuncios.reduce(function (total, currentValue) {
        return total + parseInt(currentValue.precio, 10);
      }, 0);
      Promedio.value = sum / anuncios.length;
      if (anuncios.length > 0) {
        handlerLoadList(anuncios);
      }
      console.log(anuncios);
    })
    .catch((err) => {
      console.error(`Error: ${err.status} : ${err.statusText}`);
    })
    .finally(() => {
      EliminarSpinner();
    });
}
function TraerTodoAxios() {}

//POST ---Recarga la pagina Live server
function AltaAjax(nuevoAnuncio) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 299) {
        anuncios = JSON.parse(xhr.responseText);
        anuncios.push(nuevoAnuncio);
        if (anuncios.length > 0) {
          handlerLoadList(anuncios);
        }
        console.log(anuncios);
      } else {
        const statusText = xhr.statusText || "Ocurrio un error";
        console.error(`Error: ${xhr.status} : ${statusText}`);
      }
    }
  };
  xhr.open("POST", "http://localhost:3500/anuncios", true);
  //seteamos las cabeceras
  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
  xhr.send(JSON.stringify(nuevoAnuncio));
}

//PUT - me recarga la pagina
function ModificarAjax(AnuncioEditado) {
  let id = AnuncioEditado.id;
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 299) {
        anuncios = JSON.parse(xhr.responseText);
        console.log(anuncios);
        anuncios.splice(index, 1, AnuncioEditado);

        handlerLoadList(anuncios);
      } else {
        const statusText = xhr.statusText || "Ocurrio un error";
        console.error(`Error: ${xhr.status} : ${statusText}`);
      }
      EliminarSpinner();
    }
  };

  xhr.open("PUT", `http://localhost:3500/anuncios/${id}`);
  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
  xhr.send(JSON.stringify(AnuncioEditado));
}

//DELETE
function EliminarAjax(id) {
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 299) {
        anuncios = JSON.parse(xhr.responseText);
        console.log(anuncios);
        handlerLoadList();
      } else {
        const statusText = xhr.statusText || "Ocurrio un error";
        console.error(`Error: ${xhr.status} : ${statusText}`);
      }

      EliminarSpinner();
    }
  };

  xhr.open("DELETE", `http://localhost:3500/anuncios/${id}`);
  xhr.send();
}

function EliminarFetch(id) {
  fetch(`http://localhost:3500/anuncios/${id}`, { method: "DELETE" })
    .then((res) => {
      return res.ok ? res.json() : Promise.reject(res);
    })
    .then((data) => {
      anuncios = data;
      handlerLoadList();
      console.log(anuncios);
    })
    .catch((err) => {
      console.error(`Error: ${err.status} : ${err.statusText}`);
    })
    .finally(() => {
      EliminarSpinner();
    });
}

function AplicarFiltro(TipoFiltro) {
  let FiltroAplicado = [];
  let Promedio = document.querySelector("#promedio");
  AgregarSpinner();
  if (TipoFiltro != "Todos") {
    FiltroAplicado = anuncios.filter((a) => a.transaccion == TipoFiltro);
  } else {
    FiltroAplicado = anuncios;
  }
  let sum = FiltroAplicado.reduce(function (total, currentValue) {
    return total + parseInt(currentValue.precio, 10);
  }, 0);

  console.log(sum);
  EliminarSpinner();

  Promedio.value = sum / FiltroAplicado.length;
  RenderizarLista(
    CrearTabla(FiltroAplicado),
    document.getElementById("divTabla")
  );
}
