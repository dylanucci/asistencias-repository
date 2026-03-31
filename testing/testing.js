// Script de prueba/sandbox.
// Qué hace: crea un alumno de ejemplo y prueba guardado/redirección en entorno de test.
// Qué se puede cambiar: valores mock, ruta de destino o experimentos visuales temporales.
import { Alumno } from "../asistencia/models.js"

var saveButton = document.getElementById("myForm")

saveButton.addEventListener("submit", (ev)=>{

    ev.preventDefault()

    var alumno = new Alumno("some", "some", "some", "some", "some")

    var alumnoJson = JSON.stringify(alumno)

    localStorage.setItem("alumnoNuevo", alumnoJson)

    window.location.assign("../authentication/pagina.html")
    
})