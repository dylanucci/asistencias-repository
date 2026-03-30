var bodyContainer = document.getElementById("body_container")

document.body.onload = ()=>{
    cargarDiseño()
    cargarAlumnos()
}

function cargarDiseño(){

    var diseñoString = localStorage.getItem("diseños")
    var diseños = JSON.parse(diseñoString)
    var cursoId = localStorage.getItem("cursoCurrent")
    var index = diseños.findIndex(d=> d.curso_id == cursoId)
    var diseño = diseños[index]

    var tempElement = document.createElement("div")

    tempElement.innerHTML = diseño.diseño_element
    
    var diseñoNew = tempElement.firstElementChild;
    
    bodyContainer.append(diseñoNew)

    for(var i = 0; i<diseño.filas; i++){
        for(var j = 0; j<diseño.columnas; j++){

            var banco_id = `${i};${j}`        

            for (var k=1; k<3; k++){
                var asientoId = `${banco_id}-${k}`
                var response = isBusy(asientoId)

                if (response !== false){

                    var asiento = document.getElementById(asientoId)

                    asiento.innerHTML = `${response.nombre} ${response.apellido}`
                }

            }
        }
    }

}

var alumnosContainer = document.getElementById("alumnos_container")

const alumnosContainerItemStyle = {
    textAlign: "start",
    backgroundColor: "grey",
    width: "100%",
    border: "1px solid black",
    color: "white",
    cursor: "pointer",
    position: "relative"
};

function cargarAlumnos(){

    var alumnosString = localStorage.getItem("alumnos")
    var alumnos = JSON.parse(alumnosString)

    alumnos.forEach(a => {
        var alumnoItem = document.createElement("div")
        var alumnoMain = document.createElement("div") 

        Object.assign(alumnoMain.style, alumnosContainerItemStyle)
        Object.assign(alumnoItem.style, { width: "100%" })

        alumnoMain.innerHTML = `<p style="margin-left: 8px;">Nombre: ${a.nombre} Apellido: ${a.apellido}</p>`

        var desplegable = document.createElement("div")
        desplegable.style.display = "none" 
        desplegable.style.backgroundColor = "#444"
        desplegable.style.padding = "10px"
        
        desplegable.innerHTML = `<button id="btn-${a.id}">Acción</button>`

        alumnoMain.addEventListener("click", () => {
            if (desplegable.style.display === "none") {
                desplegable.style.display = "block"
            } else {
                desplegable.style.display = "none"
            }
        })

        alumnoMain.addEventListener("mouseenter", (e) => {
            e.currentTarget.style.backgroundColor = "rgba(50, 50, 50, 0.8)"
        })

        alumnoMain.addEventListener("mouseleave", (e) => {
            e.currentTarget.style.backgroundColor = "grey"
        })

        alumnoItem.append(alumnoMain)
        alumnoItem.append(desplegable)
        alumnosContainer.append(alumnoItem)
    });     
}

function isBusy(asiento_id){
    var alumnosString = localStorage.getItem("alumnos")
    var alumnosObject = JSON.parse(alumnosString)
    var index = alumnosObject.findIndex(a=> a.asiento_id == asiento_id)
    if (index == -1){
        return false;
    }
    else {
        var alumno = alumnosObject[index]
        return alumno;
    }
}