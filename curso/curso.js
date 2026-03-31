var cursoTitle = document.getElementById("curso_title")
var cursoSubtitle = document.getElementById("curso_subtitle")
var cursoId = localStorage.getItem("cursoCurrent")
var addAlumnosButton = document.getElementById("add_alumnos_button")
var addDiseñoButton = document.getElementById("add_diseño_button")
var viewDiseñoButton = document.getElementById("view_diseño_button")
var asistenciaButton = document.getElementById("asistencia_button")
var backToHomeButton = document.getElementById("back_to_home_button")

document.body.onload = function () {
    if (!cursoId) {
        cursoTitle.textContent = "Ningún curso seleccionado"
        cursoSubtitle.textContent = "Volvé al panel principal y elegí un curso para continuar."
        return
    }

    cursoTitle.textContent = `Curso ${cursoId}`
    cursoSubtitle.textContent = "Elegí una acción para continuar con la administración del curso."
}

addDiseñoButton.addEventListener("click", function () {
    window.location.assign("../generarDiseño/generarDiseño.html")
})

addAlumnosButton.addEventListener("click", function () {
    window.location.assign("../alumnosForm/alumnosForm.html")
})

viewDiseñoButton.addEventListener("click", function () {
    window.location.assign("../diseños/diseño.html")
})

asistenciaButton.addEventListener("click", function () {
    window.location.assign("../asistencia/asistencia.html")
})

backToHomeButton.addEventListener("click", function () {
    window.location.assign("../principal/principal.html")
})