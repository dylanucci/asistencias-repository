import { Diseño } from "../persistencia/models.js"

var btn = document.getElementById("design_generate")

btn.onclick = ()=>{

    var designString = localStorage.getItem("designValue")

    var designObject = JSON.parse(designString)

    console.log(designObject.columnas)

    document.body.insertAdjacentHTML("beforeend", designObject.diseño_element)

}
