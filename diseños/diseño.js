// Script de visualización del diseño del aula.
// Qué hace: muestra el plano guardado, permite asignar asientos y alternar presente/ausente desde esta vista.
// Qué se puede cambiar: mensajes visibles, etiquetas de estado y colores usados en los asientos.
var designPanel = document.getElementById("design_panel")
var designTitle = document.getElementById("design_title")
var designStatus = document.getElementById("design_status")
var alumnosContainer = document.getElementById("alumnos_container")
var cursoActual = localStorage.getItem("cursoCurrent")

const seatStyleMap = {
    libre: { background: "#eef2f7", color: "#637083", border: "#cbd5e1" },
    presente: { background: "#e8f7ee", color: "#1f9d55", border: "#7dd3a3" },
    ausente: { background: "#fdeaea", color: "#cf3d3d", border: "#f0a1a1" }
}

document.body.onload = function () {
    designTitle.textContent = cursoActual ? `Diseño de ${cursoActual}` : "Diseño del curso"
    refreshView()
}

function refreshView() {
    cargarDiseño()
    cargarAlumnos()
}

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

function getAlumnosCurso() {
    return getStorageArray("alumnos").filter(function (alumno) {
        return alumno.curso_id == cursoActual
    })
}

function cargarDiseño() {
    var diseñoExistente = designPanel.querySelector("#design_element")
    if (diseñoExistente) {
        diseñoExistente.remove()
    }

    var mensajeVacio = designPanel.querySelector(".design-empty-state")
    if (mensajeVacio) {
        mensajeVacio.remove()
    }

    var diseños = getStorageArray("diseños")

    if (!cursoActual) {
        designStatus.textContent = "Primero selecciona un curso desde el panel principal."
        return
    }

    var diseño = diseños.find(function (item) {
        return item.curso_id == cursoActual
    })

    if (!diseño) {
        designStatus.textContent = "Todavia no generaste un diseño para este curso."
        designPanel.insertAdjacentHTML("beforeend", '<div class="empty-state design-empty-state">Usa la opcion <strong>Generar diseño</strong> desde la pantalla del curso.</div>')
        return
    }

    designStatus.textContent = "Vista previa del diseño del aula."

    var tempElement = document.createElement("div")
    tempElement.innerHTML = diseño.diseño_element
    var diseñoNew = tempElement.firstElementChild
    designPanel.append(diseñoNew)

    Array.from(diseñoNew.querySelectorAll("div[id]")).forEach(function (node) {
        if (node.id.includes(";") && node.id.includes("-")) {
            node.textContent = "-"
            applySeatStyle(node, "libre")
        }
    })

    getAlumnosCurso().forEach(function (alumno) {
        if (!alumno.asiento_id) {
            return
        }

        var asiento = document.getElementById(alumno.asiento_id)
        if (!asiento) {
            return
        }

        var nombreCorto = `${alumno.nombre} ${alumno.apellido}`

        asiento.textContent = nombreCorto
        asiento.title = `${alumno.nombre} ${alumno.apellido || ""}`
        asiento.style.cursor = "default"
        applySeatStyle(asiento, "libre")
    })
}

function cargarAlumnos() {
    alumnosContainer.innerHTML = ""

    if (!cursoActual) {
        alumnosContainer.innerHTML = '<div class="empty-state">Selecciona un curso antes de asignar asientos.</div>'
        return
    }

    var alumnosCurso = getAlumnosCurso()

    if (alumnosCurso.length === 0) {
        alumnosContainer.innerHTML = '<div class="empty-state">No hay alumnos cargados para este curso.</div>'
        return
    }

    alumnosCurso.forEach(function (a) {
        var alumnoItem = document.createElement("div")
        var alumnoMain = document.createElement("div")
        var desplegable = document.createElement("div")

        Object.assign(alumnoMain.style, {
            textAlign: "start",
            backgroundColor: "#eef4ff",
            width: "100%",
            border: "1px solid #d5e3fb",
            color: "#243142",
            cursor: "pointer",
            position: "relative",
            borderRadius: "12px",
            padding: "0.2rem 0.6rem"
        })
        Object.assign(alumnoItem.style, { width: "100%" })

        desplegable.style.display = "none"
        desplegable.style.backgroundColor = "rgba(8, 38, 84, 0.92)"
        desplegable.style.padding = "10px"
        desplegable.style.borderRadius = "0 0 12px 12px"

        alumnoMain.innerHTML = `
            <div class="student-row">
                <div>
                    <p><strong>${a.apellido || "Sin apellido"}, ${a.nombre}</strong></p>
                    <p class="student-meta">${a.asiento_id ? `Asiento: ${a.asiento_id}` : "Sin asiento asignado"}</p>
                </div>
            </div>
        `

        if (a.asiento_id == null) {
            var formContainer = document.createElement("form")
            Object.assign(formContainer.style, {
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginTop: "5px",
                color: "white"
            })

            var labelF = document.createElement("label")
            labelF.innerText = "Fila: "
            var inputF = document.createElement("input")
            inputF.type = "number"
            inputF.name = "fila_input"
            labelF.append(inputF)

            var labelC = document.createElement("label")
            labelC.innerText = "Columna: "
            var inputC = document.createElement("input")
            inputC.type = "number"
            inputC.name = "columna_input"
            labelC.append(inputC)

            var labelN = document.createElement("label")
            labelN.innerText = "Asiento: "
            var inputN = document.createElement("input")
            inputN.type = "number"
            inputN.name = "asiento_input"
            labelN.append(inputN)

            var btnAsignar = document.createElement("button")
            btnAsignar.id = a.alumno_id
            btnAsignar.name = "asignar_button"
            btnAsignar.type = "submit"
            btnAsignar.innerText = "Asignar asiento"

            formContainer.addEventListener("submit", function (e) {
                e.preventDefault()
                var fila = Number(e.target.fila_input.value) 
                var columna = Number(e.target.columna_input.value) 
                var asiento = Number(e.target.asiento_input.value)
                var asiento_id = `${fila};${columna}-${asiento}`

                if (Number.isNaN(fila) || Number.isNaN(columna) || Number.isNaN(asiento)) {
                    return
                }

                if (isBusy(asiento_id) == false) {
                    setAsiento(e.target.asignar_button.id, asiento_id)
                    refreshView()
                }
            })

            formContainer.append(labelF, labelC, labelN, btnAsignar)
            desplegable.append(formContainer)
        } else {
            var btnEliminar = document.createElement("button")
            btnEliminar.innerText = "Eliminar del diagrama"
            btnEliminar.style.backgroundColor = "#d9534f"
            btnEliminar.style.color = "white"
            btnEliminar.style.cursor = "pointer"
            btnEliminar.style.border = "none"
            btnEliminar.style.borderRadius = "8px"
            btnEliminar.style.padding = "8px 12px"
            btnEliminar.id = a.alumno_id

            btnEliminar.addEventListener("click", function (e) {
                e.stopPropagation()
                setAsiento(e.target.id, null)
                refreshView()
            })

            desplegable.append(btnEliminar)
        }

        alumnoMain.addEventListener("click", function () {
            desplegable.style.display = desplegable.style.display === "none" ? "block" : "none"
        })

        alumnoMain.addEventListener("mouseenter", function (e) {
            e.currentTarget.style.backgroundColor = "#dfeeff"
        })
        alumnoMain.addEventListener("mouseleave", function (e) {
            e.currentTarget.style.backgroundColor = "#eef4ff"
        })

        alumnoItem.append(alumnoMain)
        alumnoItem.append(desplegable)
        alumnosContainer.append(alumnoItem)
    })
}

function isBusy(asiento_id) {
    var alumnosObject = getStorageArray("alumnos")
    var alumno = alumnosObject.find(function (item) {
        return item.asiento_id == asiento_id && item.curso_id == cursoActual
    })

    return alumno || false
}

function setAsiento(alumno_id, asiento_id) {
    var alumnosObject = getStorageArray("alumnos")
    var index = alumnosObject.findIndex(function (alumno) {
        return alumno.alumno_id == alumno_id
    })

    if (index === -1) {
        return
    }

    alumnosObject[index].asiento_id = asiento_id
    localStorage.setItem("alumnos", JSON.stringify(alumnosObject))
}

function applySeatStyle(asiento, estado) {
    var style = seatStyleMap[estado] || seatStyleMap.libre
    asiento.style.backgroundColor = style.background
    asiento.style.color = style.color
    asiento.style.border = `1px solid ${style.border}`
    asiento.style.borderRadius = "8px"
    asiento.style.fontWeight = "700"
    asiento.style.padding = "0 2px"
}