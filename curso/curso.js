var cursoTitle = document.getElementById("curso_title")

var cursoId = localStorage.getItem("cursoCurrent")

var addAlumnosButton = document.getElementById("add_alumnos_button")

document.body.onload = ()=>{

    cursoTitle.innerHTML = cursoId

}

addAlumnosButton.addEventListener("click", (e)=>{
    window.location.assign("../alumnosForm/alumnosForm.html")
})