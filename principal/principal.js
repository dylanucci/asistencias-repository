// Script de la pantalla principal.
// Qué hace: carga los cursos guardados, arma las tarjetas y permite abrir o eliminar cada uno.
// Qué se puede cambiar: títulos visibles, etiquetas de botones y mensajes del estado vacío.
var cursosTitle = document.getElementById("cursos_title")
var cursosContainer = document.getElementById("cursos_container")
var addCursoButton = document.getElementById("add_curso_button")

function getStorageArray(key) {
    try {
        var value = localStorage.getItem(key)
        if (!value) {
            return []
        }

        var parsed = JSON.parse(value)
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

function mostrarEstadoVacio() {
    // Texto visible del estado vacío de la pantalla principal.
    cursosTitle.textContent = "Cursos disponibles"
    cursosContainer.innerHTML = `
        <div class="empty-state">
            Todavía no hay cursos cargados. Usá el botón inferior para crear el primero.
        </div>
    `
}

function eliminarCurso(cursoId) {
    var confirmacion = window.confirm(`¿Querés eliminar el curso ${cursoId} y todos sus datos asociados?`)
    if (!confirmacion) {
        return
    }

    var cursos = getStorageArray("cursos").filter(function (curso) {
        return curso.id !== cursoId
    })

    var alumnos = getStorageArray("alumnos").filter(function (alumno) {
        return alumno.curso_id !== cursoId
    })

    var diseños = getStorageArray("diseños").filter(function (diseño) {
        return diseño.curso_id !== cursoId
    })

    var asientos = getStorageArray("asientos").filter(function (asiento) {
        return !String(asiento.diseño_id || "").startsWith(`${cursoId}-`)
    })

    var bancos = getStorageArray("bancos").filter(function (banco) {
        return !String(banco.diseño_id || "").startsWith(`${cursoId}-`)
    })

    var asistencias = getStorageArray("asistencias").filter(function (asistencia) {
        return asistencia.curso_id !== cursoId
    })

    localStorage.setItem("cursos", JSON.stringify(cursos))
    localStorage.setItem("alumnos", JSON.stringify(alumnos))
    localStorage.setItem("diseños", JSON.stringify(diseños))
    localStorage.setItem("asientos", JSON.stringify(asientos))
    localStorage.setItem("bancos", JSON.stringify(bancos))
    localStorage.setItem("asistencias", JSON.stringify(asistencias))

    if (localStorage.getItem("cursoCurrent") === cursoId) {
        localStorage.removeItem("cursoCurrent")
    }

    renderCursos()
}

function renderCursos() {
    var cursos = getStorageArray("cursos")
    cursosContainer.innerHTML = ""

    if (!Array.isArray(cursos) || cursos.length === 0) {
        mostrarEstadoVacio()
        return
    }

    cursosTitle.textContent = cursos.length === 1
        ? "1 curso disponible"
        : `${cursos.length} cursos disponibles`

    cursos.forEach(function (c) {
        var cursoCard = document.createElement("div")
        cursoCard.className = "cursos_container_item"

        var cursoInfo = document.createElement("button")
        cursoInfo.type = "button"
        cursoInfo.className = "curso_open_button"
        cursoInfo.id = c.id
        // Etiquetas visibles de cada tarjeta de curso: el texto "Abrir" se cambia acá.
        cursoInfo.innerHTML = `<span>${c.id}</span><span class="curso_item_hint">Abrir</span>`

        cursoInfo.addEventListener("click", function (e) {
            localStorage.setItem("cursoCurrent", e.currentTarget.id)
            window.location.assign("../curso/curso.html")
        })

        var deleteButton = document.createElement("button")
        deleteButton.type = "button"
        deleteButton.className = "curso_delete_button"
        deleteButton.textContent = "Eliminar"

        deleteButton.addEventListener("click", function () {
            eliminarCurso(c.id)
        })

        cursoCard.append(cursoInfo, deleteButton)
        cursosContainer.append(cursoCard)
    })
}

addCursoButton.addEventListener("click", function () {
    window.location.assign("../agregarCurso/cursoForm.html")
})

document.body.onload = function () {
    preChargeSixSeven()
    renderCursos()
}

function preChargeSixSeven(){

    var diseños = [
        {
    "diseño_element": "<div id=\"design_element\" style=\"width: 900px; display: flex; flex-direction: row; justify-content: space-between;\"><div id=\"0\" style=\"display: flex; flex-direction: column-reverse; width: 202.5px;\"><div id=\"0;0\" style=\"width: 100%; display: flex; flex-direction: column; margin-bottom: 18px;\"><div id=\"asientos_container\" style=\"display: flex; height: 40.5px; width: 100%; flex-direction: row;\"><div id=\"0;0-1\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div><div id=\"0;0-2\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div></div><img src=\"../images/banco.png\" style=\"background-color: brown; width: 100%; height: 50.625px;\"></div><div id=\"0;1\" style=\"width: 100%; display: flex; flex-direction: column; margin-bottom: 18px;\"><div id=\"asientos_container\" style=\"display: flex; height: 40.5px; width: 100%; flex-direction: row;\"><div id=\"0;1-1\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div><div id=\"0;1-2\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div></div><img src=\"../images/banco.png\" style=\"background-color: brown; width: 100%; height: 50.625px;\"></div><div id=\"0;2\" style=\"width: 100%; display: flex; flex-direction: column; margin-bottom: 18px;\"><div id=\"asientos_container\" style=\"display: flex; height: 40.5px; width: 100%; flex-direction: row;\"><div id=\"0;2-1\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div><div id=\"0;2-2\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div></div><img src=\"../images/banco.png\" style=\"background-color: brown; width: 100%; height: 50.625px;\"></div><div id=\"0;3\" style=\"width: 100%; display: flex; flex-direction: column; margin-bottom: 18px;\"><div id=\"asientos_container\" style=\"display: flex; height: 40.5px; width: 100%; flex-direction: row;\"><div id=\"0;3-1\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div><div id=\"0;3-2\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div></div><img src=\"../images/banco.png\" style=\"background-color: brown; width: 100%; height: 50.625px;\"></div><div id=\"0;4\" style=\"width: 100%; display: flex; flex-direction: column; margin-bottom: 18px;\"><div id=\"asientos_container\" style=\"display: flex; height: 40.5px; width: 100%; flex-direction: row;\"><div id=\"0;4-1\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div><div id=\"0;4-2\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div></div><img src=\"../images/banco.png\" style=\"background-color: brown; width: 100%; height: 50.625px;\"></div></div><div id=\"1\" style=\"display: flex; flex-direction: column-reverse; width: 202.5px;\"><div id=\"1;0\" style=\"width: 100%; display: flex; flex-direction: column; margin-bottom: 18px;\"><div id=\"asientos_container\" style=\"display: flex; height: 40.5px; width: 100%; flex-direction: row;\"><div id=\"1;0-1\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div><div id=\"1;0-2\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div></div><img src=\"../images/banco.png\" style=\"background-color: brown; width: 100%; height: 50.625px;\"></div><div id=\"1;1\" style=\"width: 100%; display: flex; flex-direction: column; margin-bottom: 18px;\"><div id=\"asientos_container\" style=\"display: flex; height: 40.5px; width: 100%; flex-direction: row;\"><div id=\"1;1-1\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div><div id=\"1;1-2\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div></div><img src=\"../images/banco.png\" style=\"background-color: brown; width: 100%; height: 50.625px;\"></div><div id=\"1;2\" style=\"width: 100%; display: flex; flex-direction: column; margin-bottom: 18px;\"><div id=\"asientos_container\" style=\"display: flex; height: 40.5px; width: 100%; flex-direction: row;\"><div id=\"1;2-1\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div><div id=\"1;2-2\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div></div><img src=\"../images/banco.png\" style=\"background-color: brown; width: 100%; height: 50.625px;\"></div><div id=\"1;3\" style=\"width: 100%; display: flex; flex-direction: column; margin-bottom: 18px;\"><div id=\"asientos_container\" style=\"display: flex; height: 40.5px; width: 100%; flex-direction: row;\"><div id=\"1;3-1\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div><div id=\"1;3-2\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div></div><img src=\"../images/banco.png\" style=\"background-color: brown; width: 100%; height: 50.625px;\"></div><div id=\"1;4\" style=\"width: 100%; display: flex; flex-direction: column; margin-bottom: 18px;\"><div id=\"asientos_container\" style=\"display: flex; height: 40.5px; width: 100%; flex-direction: row;\"><div id=\"1;4-1\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div><div id=\"1;4-2\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div></div><img src=\"../images/banco.png\" style=\"background-color: brown; width: 100%; height: 50.625px;\"></div></div><div id=\"2\" style=\"display: flex; flex-direction: column-reverse; width: 202.5px;\"><div id=\"2;0\" style=\"width: 100%; display: flex; flex-direction: column; margin-bottom: 18px;\"><div id=\"asientos_container\" style=\"display: flex; height: 40.5px; width: 100%; flex-direction: row;\"><div id=\"2;0-1\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div><div id=\"2;0-2\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div></div><img src=\"../images/banco.png\" style=\"background-color: brown; width: 100%; height: 50.625px;\"></div><div id=\"2;1\" style=\"width: 100%; display: flex; flex-direction: column; margin-bottom: 18px;\"><div id=\"asientos_container\" style=\"display: flex; height: 40.5px; width: 100%; flex-direction: row;\"><div id=\"2;1-1\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div><div id=\"2;1-2\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div></div><img src=\"../images/banco.png\" style=\"background-color: brown; width: 100%; height: 50.625px;\"></div><div id=\"2;2\" style=\"width: 100%; display: flex; flex-direction: column; margin-bottom: 18px;\"><div id=\"asientos_container\" style=\"display: flex; height: 40.5px; width: 100%; flex-direction: row;\"><div id=\"2;2-1\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div><div id=\"2;2-2\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div></div><img src=\"../images/banco.png\" style=\"background-color: brown; width: 100%; height: 50.625px;\"></div><div id=\"2;3\" style=\"width: 100%; display: flex; flex-direction: column; margin-bottom: 18px;\"><div id=\"asientos_container\" style=\"display: flex; height: 40.5px; width: 100%; flex-direction: row;\"><div id=\"2;3-1\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div><div id=\"2;3-2\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div></div><img src=\"../images/banco.png\" style=\"background-color: brown; width: 100%; height: 50.625px;\"></div><div id=\"2;4\" style=\"width: 100%; display: flex; flex-direction: column; margin-bottom: 18px;\"><div id=\"asientos_container\" style=\"display: flex; height: 40.5px; width: 100%; flex-direction: row;\"><div id=\"2;4-1\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div><div id=\"2;4-2\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div></div><img src=\"../images/banco.png\" style=\"background-color: brown; width: 100%; height: 50.625px;\"></div></div><div id=\"3\" style=\"display: flex; flex-direction: column-reverse; width: 202.5px;\"><div id=\"3;0\" style=\"width: 100%; display: flex; flex-direction: column; margin-bottom: 18px;\"><div id=\"asientos_container\" style=\"display: flex; height: 40.5px; width: 100%; flex-direction: row;\"><div id=\"3;0-1\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div><div id=\"3;0-2\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div></div><img src=\"../images/banco.png\" style=\"background-color: brown; width: 100%; height: 50.625px;\"></div><div id=\"3;1\" style=\"width: 100%; display: flex; flex-direction: column; margin-bottom: 18px;\"><div id=\"asientos_container\" style=\"display: flex; height: 40.5px; width: 100%; flex-direction: row;\"><div id=\"3;1-1\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div><div id=\"3;1-2\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div></div><img src=\"../images/banco.png\" style=\"background-color: brown; width: 100%; height: 50.625px;\"></div><div id=\"3;2\" style=\"width: 100%; display: flex; flex-direction: column; margin-bottom: 18px;\"><div id=\"asientos_container\" style=\"display: flex; height: 40.5px; width: 100%; flex-direction: row;\"><div id=\"3;2-1\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div><div id=\"3;2-2\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div></div><img src=\"../images/banco.png\" style=\"background-color: brown; width: 100%; height: 50.625px;\"></div><div id=\"3;3\" style=\"width: 100%; display: flex; flex-direction: column; margin-bottom: 18px;\"><div id=\"asientos_container\" style=\"display: flex; height: 40.5px; width: 100%; flex-direction: row;\"><div id=\"3;3-1\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div><div id=\"3;3-2\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div></div><img src=\"../images/banco.png\" style=\"background-color: brown; width: 100%; height: 50.625px;\"></div><div id=\"3;4\" style=\"width: 100%; display: flex; flex-direction: column; margin-bottom: 18px;\"><div id=\"asientos_container\" style=\"display: flex; height: 40.5px; width: 100%; flex-direction: row;\"><div id=\"3;4-1\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div><div id=\"3;4-2\" style=\"display: flex; align-items: center; color: black; justify-content: center; text-align: center; font-size: 9.96923px; width: 50%; height: 100%;\">-</div></div><img src=\"../images/banco.png\" style=\"background-color: brown; width: 100%; height: 50.625px;\"></div></div></div>",
    "curso_id": "6°7",
    "filas": "4",
    "columnas": "5",
    "asientos_count": 40,
    "diseño_id": "6°7-4x5"
}
    ];

    var alumnos = [{"alumno_id":1,"nombre":"Andres","apellido":"Garcia","genero":"Masculino","asiento_id":"3;1-2","curso_id":"6°7"},{"alumno_id":2,"nombre":"Dylan","apellido":"Sarzuri","genero":"Masculino","asiento_id":"1;3-2","curso_id":"6°7"},{"alumno_id":3,"nombre":"Luciano","apellido":"Poletti","genero":"Masculino","asiento_id":"4;3-1","curso_id":"6°7"},{"alumno_id":4,"nombre":"Salvador","apellido":"Garcia Delfabro","genero":"Masculino","asiento_id":"1;3-1","curso_id":"6°7"},{"alumno_id":5,"nombre":"Araceli","apellido":"Mendoza","genero":"Femenino","asiento_id":"2;3-1","curso_id":"6°7"},{"alumno_id":6,"nombre":"Esteban","apellido":"Vera","genero":"Masculino","asiento_id":"1;4-2","curso_id":"6°7"},{"alumno_id":7,"nombre":"Facundo","apellido":"Baroffio","genero":"Masculino","asiento_id":"2;1-2","curso_id":"6°7"},{"alumno_id":8,"nombre":"Fidel","apellido":"Gonzalez","genero":"Masculino","asiento_id":"2;2-2","curso_id":"6°7"},{"alumno_id":9,"nombre":"Maria Jose","apellido":"Herrera","genero":"Femenino","asiento_id":"1;4-1","curso_id":"6°7"},{"alumno_id":10,"nombre":"Melani","apellido":"Sanizo","genero":"Femenino","asiento_id":"2;3-2","curso_id":"6°7"},{"alumno_id":11,"nombre":"nathaniel","apellido":"Contreras","genero":"Masculino","asiento_id":"2;1-1","curso_id":"6°7"},{"alumno_id":12,"nombre":"Ramiro","apellido":"Minardi","genero":"Masculino","asiento_id":"2;2-1","curso_id":"6°7"},{"alumno_id":13,"nombre":"Santiago","apellido":"Alvarez","genero":"Masculino","asiento_id":"3;2-1","curso_id":"6°7"},{"alumno_id":14,"nombre":"Tiziano","apellido":"Silva","genero":"Masculino","asiento_id":"3;1-1","curso_id":"6°7"},{"alumno_id":15,"nombre":"Matías","apellido":"Pelucci","genero":"Masculino","asiento_id":"3;2-2","curso_id":"6°7"},{"alumno_id":16,"nombre":"Diana","apellido":"Vazquez","genero":"Femenino","asiento_id":"4;3-2","curso_id":"6°7"}]

    var cursos = [{"id":"6°7","año":"6","division":"7"}]

    var asientosData = [{"asiento_id":"0;0-1","banco_id":"0;0","numero":1,"diseño_id":"6°7-4x5"},{"asiento_id":"0;0-2","banco_id":"0;0","numero":2,"diseño_id":"6°7-4x5"},{"asiento_id":"0;1-1","banco_id":"0;1","numero":1,"diseño_id":"6°7-4x5"},{"asiento_id":"0;1-2","banco_id":"0;1","numero":2,"diseño_id":"6°7-4x5"},{"asiento_id":"0;2-1","banco_id":"0;2","numero":1,"diseño_id":"6°7-4x5"},{"asiento_id":"0;2-2","banco_id":"0;2","numero":2,"diseño_id":"6°7-4x5"},{"asiento_id":"0;3-1","banco_id":"0;3","numero":1,"diseño_id":"6°7-4x5"},{"asiento_id":"0;3-2","banco_id":"0;3","numero":2,"diseño_id":"6°7-4x5"},{"asiento_id":"0;4-1","banco_id":"0;4","numero":1,"diseño_id":"6°7-4x5"},{"asiento_id":"0;4-2","banco_id":"0;4","numero":2,"diseño_id":"6°7-4x5"},{"asiento_id":"1;0-1","banco_id":"1;0","numero":1,"diseño_id":"6°7-4x5"},{"asiento_id":"1;0-2","banco_id":"1;0","numero":2,"diseño_id":"6°7-4x5"},{"asiento_id":"1;1-1","banco_id":"1;1","numero":1,"diseño_id":"6°7-4x5"},{"asiento_id":"1;1-2","banco_id":"1;1","numero":2,"diseño_id":"6°7-4x5"},{"asiento_id":"1;2-1","banco_id":"1;2","numero":1,"diseño_id":"6°7-4x5"},{"asiento_id":"1;2-2","banco_id":"1;2","numero":2,"diseño_id":"6°7-4x5"},{"asiento_id":"1;3-1","banco_id":"1;3","numero":1,"diseño_id":"6°7-4x5"},{"asiento_id":"1;3-2","banco_id":"1;3","numero":2,"diseño_id":"6°7-4x5"},{"asiento_id":"1;4-1","banco_id":"1;4","numero":1,"diseño_id":"6°7-4x5"},{"asiento_id":"1;4-2","banco_id":"1;4","numero":2,"diseño_id":"6°7-4x5"},{"asiento_id":"2;0-1","banco_id":"2;0","numero":1,"diseño_id":"6°7-4x5"},{"asiento_id":"2;0-2","banco_id":"2;0","numero":2,"diseño_id":"6°7-4x5"},{"asiento_id":"2;1-1","banco_id":"2;1","numero":1,"diseño_id":"6°7-4x5"},{"asiento_id":"2;1-2","banco_id":"2;1","numero":2,"diseño_id":"6°7-4x5"},{"asiento_id":"2;2-1","banco_id":"2;2","numero":1,"diseño_id":"6°7-4x5"},{"asiento_id":"2;2-2","banco_id":"2;2","numero":2,"diseño_id":"6°7-4x5"},{"asiento_id":"2;3-1","banco_id":"2;3","numero":1,"diseño_id":"6°7-4x5"},{"asiento_id":"2;3-2","banco_id":"2;3","numero":2,"diseño_id":"6°7-4x5"},{"asiento_id":"2;4-1","banco_id":"2;4","numero":1,"diseño_id":"6°7-4x5"},{"asiento_id":"2;4-2","banco_id":"2;4","numero":2,"diseño_id":"6°7-4x5"},{"asiento_id":"3;0-1","banco_id":"3;0","numero":1,"diseño_id":"6°7-4x5"},{"asiento_id":"3;0-2","banco_id":"3;0","numero":2,"diseño_id":"6°7-4x5"},{"asiento_id":"3;1-1","banco_id":"3;1","numero":1,"diseño_id":"6°7-4x5"},{"asiento_id":"3;1-2","banco_id":"3;1","numero":2,"diseño_id":"6°7-4x5"},{"asiento_id":"3;2-1","banco_id":"3;2","numero":1,"diseño_id":"6°7-4x5"},{"asiento_id":"3;2-2","banco_id":"3;2","numero":2,"diseño_id":"6°7-4x5"},{"asiento_id":"3;3-1","banco_id":"3;3","numero":1,"diseño_id":"6°7-4x5"},{"asiento_id":"3;3-2","banco_id":"3;3","numero":2,"diseño_id":"6°7-4x5"},{"asiento_id":"3;4-1","banco_id":"3;4","numero":1,"diseño_id":"6°7-4x5"},{"asiento_id":"3;4-2","banco_id":"3;4","numero":2,"diseño_id":"6°7-4x5"},{"asiento_id":"0;0-1","banco_id":"0;0","numero":1,"diseño_id":"6°7-3x5"},{"asiento_id":"0;0-2","banco_id":"0;0","numero":2,"diseño_id":"6°7-3x5"},{"asiento_id":"0;1-1","banco_id":"0;1","numero":1,"diseño_id":"6°7-3x5"},{"asiento_id":"0;1-2","banco_id":"0;1","numero":2,"diseño_id":"6°7-3x5"},{"asiento_id":"0;2-1","banco_id":"0;2","numero":1,"diseño_id":"6°7-3x5"},{"asiento_id":"0;2-2","banco_id":"0;2","numero":2,"diseño_id":"6°7-3x5"},{"asiento_id":"0;3-1","banco_id":"0;3","numero":1,"diseño_id":"6°7-3x5"},{"asiento_id":"0;3-2","banco_id":"0;3","numero":2,"diseño_id":"6°7-3x5"},{"asiento_id":"0;4-1","banco_id":"0;4","numero":1,"diseño_id":"6°7-3x5"},{"asiento_id":"0;4-2","banco_id":"0;4","numero":2,"diseño_id":"6°7-3x5"},{"asiento_id":"1;0-1","banco_id":"1;0","numero":1,"diseño_id":"6°7-3x5"},{"asiento_id":"1;0-2","banco_id":"1;0","numero":2,"diseño_id":"6°7-3x5"},{"asiento_id":"1;1-1","banco_id":"1;1","numero":1,"diseño_id":"6°7-3x5"},{"asiento_id":"1;1-2","banco_id":"1;1","numero":2,"diseño_id":"6°7-3x5"},{"asiento_id":"1;2-1","banco_id":"1;2","numero":1,"diseño_id":"6°7-3x5"},{"asiento_id":"1;2-2","banco_id":"1;2","numero":2,"diseño_id":"6°7-3x5"}];

    var bancosData = [
        {"banco_id":"0;0","pos_x":0,"pos_y":0},{"banco_id":"0;1","pos_x":0,"pos_y":1},
        {"banco_id":"0;2","pos_x":0,"pos_y":2},{"banco_id":"0;3","pos_x":0,"pos_y":3},
        {"banco_id":"0;4","pos_x":0,"pos_y":4},{"banco_id":"1;0","pos_x":1,"pos_y":0},
        {"banco_id":"1;1","pos_x":1,"pos_y":1},{"banco_id":"1;2","pos_x":1,"pos_y":2},
        {"banco_id":"1;3","pos_x":1,"pos_y":3},{"banco_id":"1;4","pos_x":1,"pos_y":4},
        {"banco_id":"2;0","pos_x":2,"pos_y":0},{"banco_id":"2;1","pos_x":2,"pos_y":1},
        {"banco_id":"2;2","pos_x":2,"pos_y":2},{"banco_id":"2;3","pos_x":2,"pos_y":3},
        {"banco_id":"2;4","pos_x":2,"pos_y":4},{"banco_id":"3;0","pos_x":3,"pos_y":0},
        {"banco_id":"3;1","pos_x":3,"pos_y":1},{"banco_id":"3;2","pos_x":3,"pos_y":2},
        {"banco_id":"3;3","pos_x":3,"pos_y":3},{"banco_id":"3;4","pos_x":3,"pos_y":4}
    ];


    var cursosString = localStorage.getItem("cursos")
    var alumnosString = localStorage.getItem("alumnos")
    var diseñosString = localStorage.getItem("diseños")
    var asientosString = localStorage.getItem("asientos")
    var bancosString = localStorage.getItem("bancos")

    if (cursosString == null || cursosString == ""){
        localStorage.setItem("cursos", JSON.stringify(cursos))
    }
    if (alumnosString == null || alumnosString == ""){
        localStorage.setItem("alumnos", JSON.stringify(alumnos))    
    }
    if (diseñosString == null || diseñosString == ""){
        localStorage.setItem("diseños", JSON.stringify(diseños));
    }
    if (asientosString == null || asientosString == ""){
        localStorage.setItem("asientos", JSON.stringify(asientosData))

    }
    if (bancosString == null || bancosString == ""){
        localStorage.setItem("bancos", JSON.stringify(bancosData))
    }

    localStorage.setItem("cursoCurrent", "6°7")

    

    
}