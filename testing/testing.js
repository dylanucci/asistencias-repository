import { Alumno } from "../asistencia/models.js"

var saveButton = document.getElementById("myForm")

saveButton.addEventListener("submit", (ev)=>{

    ev.preventDefault()

    var alumno = new Alumno("some", "some", "some", "some", "some")

    var alumnoJson = JSON.stringify(alumno)

    localStorage.setItem("alumnoNuevo", alumnoJson)

    window.location.assign("../authentication/pagina.html")
    
})