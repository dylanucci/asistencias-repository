import {Curso} from "../persistencia/models.js"

var cursoForm = document.getElementById("curso_form")

cursoForm.addEventListener("submit", (ea)=>{


    ea.preventDefault()

    var año = ea.target.año.value
    var division = ea.target.division.value

    var cursos = []

    var cursoCreated = new Curso(año,division)

    console.log(año)
    console.log(division)
    console.log(cursoCreated.id)

    var cursosString = localStorage.getItem("cursos")

    cursos = JSON.parse(cursosString)

    cursos.push(cursoCreated)

    localStorage.setItem("cursos", JSON.stringify(cursos))
})