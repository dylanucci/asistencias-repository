var cursoTitle = document.getElementById("curso_title")

var cursoId = localStorage.getItem("cursoCurrent")

var addAlumnosButton = document.getElementById("add_alumnos_button")

var addDiseñoButton = document.getElementById("add_diseño_button")

var viewDiseñoButton = document.getElementById("view_diseño_button")

var asistenciaButton = document.getElementById("asistencia_button")

document.body.onload = ()=>{

    cursoTitle.innerHTML = cursoId

}

addDiseñoButton.addEventListener("click", ()=>{
    window.location.assign("../generarDiseño/generarDiseño.html")
})

addAlumnosButton.addEventListener("click", (e)=>{
    window.location.assign("../alumnosForm/alumnosForm.html")
})

viewDiseñoButton.addEventListener("click", (e)=>{
    window.location.assign("../diseños/diseño.html")
})

asistenciaButton.onclick = ()=>{
    window.location.assign("../asistencia/asistencia.html")
}