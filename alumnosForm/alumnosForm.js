var alumnosListResumen = document.getElementById("alumnos_list_resumen")

document.body.onload = ()=>{
    var alumnosString = localStorage.getItem("alumnos")

    var alumnos = JSON.parse(alumnosString)

    if (alumnos.length == 0){
        alumnosListResumen.innerHTML = "No hay alumnos registrados"
        return;
    }

    var listResume = document.createElement("div")

    var resumeValue = `Cantidad: ${alumnos.length}`

}