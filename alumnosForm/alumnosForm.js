import {Alumno} from "../persistencia/models.js"

var alumnosListTitle = document.getElementById("alumnos_list_title")
var alumnosContainer = document.getElementById("alumnos_container")
var alumnoForm = document.getElementById("add_alumno_form")

const alumnosContainerItemStyle = {
    textAlign: "start",
    backgroundColor: "grey",
    width: "100%",
    border: "1px solid black",
    color: "white",
    cursor: "pointer",
    position: "relative"
};

const optionsMenuStyle = {
    display: "none",
    backgroundColor: "rgb(40, 40, 40)",
    width: "100%",
    padding: "10px",
    boxSizing: "border-box",
    borderBottom: "1px solid white",
    justifyContent: "center"
};

const btnEliminarStyle = {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "5px 15px",
    cursor: "pointer",
    fontWeight: "bold"
};
document.body.onload = ()=>{

    loadAlumnosList()

}

function loadAlumnosList(){

    var alumnosString = localStorage.getItem("alumnos")

    var alumnos = JSON.parse(alumnosString)

    var alumnosCurso = []

    var cursoCurrent = localStorage.getItem("cursoCurrent")

    alumnos.forEach(a =>  {
        if (a.curso_id == cursoCurrent){
            alumnosCurso.push(a)
        }
    });    

    alumnosCurso.forEach(a => {
        var alumnoItem = document.createElement("div")
        var alumnoMain = document.createElement("div") 
        var optionsMenu = document.createElement("div") 
        var deleteBtn = document.createElement("button")

        deleteBtn.id = a.alumno_id

        Object.assign(alumnoItem.style, { width: "100%" })
        Object.assign(alumnoMain.style, alumnosContainerItemStyle)
        Object.assign(optionsMenu.style, optionsMenuStyle)
        Object.assign(deleteBtn.style, btnEliminarStyle)

        alumnoMain.innerHTML = `<p style="margin-left: 8px;">Nombre: ${a.nombre} Apellido: ${a.apellido}</p>`
        deleteBtn.innerHTML = "ELIMINAR"

        alumnoMain.addEventListener("click", () => {
            const isVisible = optionsMenu.style.display === "flex"
            optionsMenu.style.display = isVisible ? "none" : "flex"
        })

        alumnoMain.addEventListener("mouseenter", (e) => {
            e.currentTarget.style.backgroundColor = "rgba(50, 50, 50, 0.8)"
        })

        alumnoMain.addEventListener("mouseleave", (e) => {
            e.currentTarget.style.backgroundColor = "grey"
        })

        deleteBtn.addEventListener("click", (ea)=>{
            var alumnoId = ea.target.id

            var alumnosString = localStorage.getItem("alumnos")
 
            var alumnos = JSON.parse(alumnosString)

            var index = alumnos.findIndex(a=> a.alumno_id == alumnoId)

            alumnos.splice(index, 1)

            var alumnosUpdatedString = JSON.stringify(alumnos)

            localStorage.setItem("alumnos", alumnosUpdatedString)
        })

        optionsMenu.append(deleteBtn)
        alumnoItem.append(alumnoMain)
        alumnoItem.append(optionsMenu)
        alumnosContainer.append(alumnoItem)
    });
}


//bro reinicia la pagina cada que agregues uno, asi es visible.

alumnoForm.addEventListener("submit", (ea)=>{

    ea.preventDefault()

    console.log(ea)

     var alumnosString = localStorage.getItem("alumnos")

    var alumnos = JSON.parse(alumnosString)

    var nameValue = ea.target.name_value.value

    var surnameValue = ea.target.surname_value.value

    var alumno = new Alumno(nameValue,null, localStorage.getItem("cursoCurrent"),null, surnameValue)

    alumnos.push(alumno)

    var alumnosUpdatedString  = JSON.stringify(alumnos)

    localStorage.setItem("alumnos", alumnosUpdatedString)

    
})