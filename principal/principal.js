var cursosTitle = document.getElementById("cursos_title")

var cursosContainer = document.getElementById("cursos_container")

var flexCursosContainer = document.getElementById("flex_cursos_container")

var addCursoButton = document.getElementById("add_curso_button")

const cursoItemStyle = {
    backgroundColor: "rgb(0, 109, 252)",
    color: "white",
    textAlign: "center",
    width: "100%",
    height: "50px",
    marginBottom: "7px"
};

addCursoButton.addEventListener("click", ()=>{
    window.location.assign("../agregarCurso/cursoForm.html")
})


document.body.onload = ()=>{

    preChargeData()

    var cursosString = localStorage.getItem("cursos")

    if (cursosString == ""){
        cursosTitle.innerHTML = "No hay cursos registrados"
        return
    }

    var cursos = JSON.parse(cursosString)


    cursos.forEach(c => {

        var cursoItem = document.createElement("button")

        Object.assign(cursoItem.style, cursoItemStyle)
        
        cursoItem.id = c.id

        cursoItem.innerHTML = c.id

        cursoItem.addEventListener("click", (e)=>{
            localStorage.setItem("cursoCurrent", e.target.id)
            window.location.assign("../curso/curso.html")
        })

        cursosContainer.append(cursoItem)
    });

}

function preChargeData(){

    localStorage.setItem("cursoCurrent", "")

    var cursosData = localStorage.getItem("cursos")
    var alumnosData = localStorage.getItem("alumnos")
    var diseñosData = localStorage.getItem("diseños")
    var asientosData = localStorage.getItem("asientos")
    var bancosData = localStorage.getItem("bancos")

    if (cursosData == null || cursosData == ""){
        localStorage.setItem("cursos", "[]")
    }
    if (alumnosData == null || alumnosData == ""){
        localStorage.setItem("alumnos", "[]")
    }
    if (diseñosData == null || diseñosData == ""){
        localStorage.setItem("diseños", "[]")
    }
    if (asientosData == null || asientosData == ""){
        localStorage.setItem("asientos", "[]")
    }
    if (bancosData == null || bancosData == ""){
        localStorage.setItem("bancos", "[]")
    }
}