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