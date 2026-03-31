var bodyContainer = document.getElementById("body_container")

document.body.onload = ()=>{
    cargarDiseño()
    cargarAlumnos()
}

const miniFormStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    marginTop: "5px",
    color: "white"
};

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
        var desplegable = document.createElement("div")

        Object.assign(alumnoMain.style, alumnosContainerItemStyle)
        Object.assign(alumnoItem.style, { width: "100%" })
        
        desplegable.style.display = "none" 
        desplegable.style.backgroundColor = "#444"
        desplegable.style.padding = "10px"

        alumnoMain.innerHTML = `<p style="margin-left: 8px;">Nombre: ${a.nombre} Apellido: ${a.apellido}</p>`

        if (a.asiento_id == null) {
            var formContainer = document.createElement("form")
            Object.assign(formContainer.style, miniFormStyle)

            var labelF = document.createElement("label"); labelF.innerText = "Fila: "
            var inputF = document.createElement("input"); inputF.type = "number"; inputF.className = "f"; inputF.name = "fila_input"
            labelF.append(inputF)

            var labelC = document.createElement("label"); labelC.innerText = "Columna: "
            var inputC = document.createElement("input"); inputC.type = "number"; inputC.className = "c"; inputC.name = "columna_input"
            labelC.append(inputC)

            var labelN = document.createElement("label"); labelN.innerText = "Asiento: "
            var inputN = document.createElement("input"); inputN.type = "number"; inputN.className = "n"; inputN.name = "asiento_input"
            labelN.append(inputN)

            var btnAsignar = document.createElement("button")
            btnAsignar.className = "btn-asignar"
            btnAsignar.id = a.alumno_id
            btnAsignar.name = "asignar_button"
            btnAsignar.type = "submit"
            btnAsignar.innerText = "Asignar Asiento"

            formContainer.addEventListener("submit", (e) => {
                e.preventDefault()
                var fila = e.target.fila_input.value - 1
                var columna = e.target.columna_input.value - 1
                var asiento = e.target.asiento_input.value
                let asiento_id = `${fila};${columna}-${asiento}`
                
                if (isBusy(asiento_id) == false) {
                    setAsiento(e.target.asignar_button.id, asiento_id)
                    location.reload()
                } else {
                    console.log("Ocupado")
                }
            })

            formContainer.append(labelF, labelC, labelN, btnAsignar)
            desplegable.append(formContainer)
        } 
        else {
            var btnEliminar = document.createElement("button")
            btnEliminar.innerText = "Eliminar del diagrama"
            btnEliminar.style.backgroundColor = "#d9534f"
            btnEliminar.style.color = "white"
            btnEliminar.style.cursor = "pointer"
            btnEliminar.id = a.alumno_id


            btnEliminar.addEventListener("click", (e) => {

                let alumno_id = e.target.id

                setAsiento(alumno_id, null)

                location.reload()
            })
            
            desplegable.append(btnEliminar)
        }

        alumnoMain.addEventListener("click", () => {
            desplegable.style.display = desplegable.style.display === "none" ? "block" : "none"
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
function setAsiento(alumno_id, asiento_id){
    var alumnos = localStorage.getItem("alumnos")
    var alumnosObject = JSON.parse(alumnos)

    var index = alumnosObject.findIndex(a=>a.alumno_id == alumno_id)

    var alumnoToSet = alumnosObject[index]

    alumnoToSet.asiento_id = asiento_id

    var alumnosUpdated = JSON.stringify(alumnosObject)

    localStorage.setItem("alumnos", alumnosUpdated)
}