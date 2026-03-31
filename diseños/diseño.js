var designPanel = document.getElementById("design_panel")
var designTitle = document.getElementById("design_title")
var designStatus = document.getElementById("design_status")
var layoutDateInput = document.getElementById("layout_date")
var layoutMessage = document.getElementById("layout_message")
var markAllPresentButton = document.getElementById("mark_all_present_button")
var alumnosContainer = document.getElementById("alumnos_container")
var cursoActual = localStorage.getItem("cursoCurrent")
var asistenciaActual = null

const miniFormStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "5px",
    color: "white"
}

const alumnosContainerItemStyle = {
    textAlign: "start",
    backgroundColor: "#eef4ff",
    width: "100%",
    border: "1px solid #d5e3fb",
    color: "#243142",
    cursor: "pointer",
    position: "relative",
    borderRadius: "12px",
    padding: "0.2rem 0.6rem"
}

const seatStyleMap = {
    libre: { background: "#eef2f7", color: "#637083", border: "#cbd5e1" },
    presente: { background: "#e8f7ee", color: "#1f9d55", border: "#7dd3a3" },
    ausente: { background: "#fdeaea", color: "#cf3d3d", border: "#f0a1a1" }
}

document.body.onload = function () {
    if (layoutDateInput && !layoutDateInput.value) {
        layoutDateInput.value = getTodayString()
    }

    if (layoutDateInput) {
        layoutDateInput.addEventListener("change", function () {
            loadAsistenciaActual()
            refreshView()
            setLayoutMessage("Se cargo la fecha seleccionada.", "success")
        })
    }

    if (markAllPresentButton) {
        markAllPresentButton.addEventListener("click", function () {
            getAlumnosCurso().forEach(function (alumno) {
                asistenciaActual.estados[alumno.alumno_id] = "presente"
            })

            saveAsistenciaActual("Todos los alumnos quedaron como presentes.")
            refreshView()
        })
    }

    designTitle.textContent = cursoActual ? `Diseño de ${cursoActual}` : "Diseño del curso"
    loadAsistenciaActual()
    refreshView()
}

function refreshView() {
    cargarDiseño()
    cargarAlumnos()
}

function getTodayString() {
    var now = new Date()
    var offset = now.getTimezoneOffset() * 60000
    return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

function formatDateLabel(value) {
    if (!value || !value.includes("-")) {
        return "la fecha seleccionada"
    }

    var parts = value.split("-")
    return `${parts[2]}/${parts[1]}/${parts[0]}`
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

function setLayoutMessage(text, type) {
    layoutMessage.textContent = text
    layoutMessage.className = `panel-message ${type}`
}

function loadAsistenciaActual() {
    if (!cursoActual) {
        asistenciaActual = null
        return
    }

    var fecha = layoutDateInput ? layoutDateInput.value || getTodayString() : getTodayString()
    var sesiones = getStorageArray("asistencias")

    asistenciaActual = sesiones.find(function (sesion) {
        return sesion.curso_id === cursoActual && sesion.fecha === fecha
    })

    if (!asistenciaActual) {
        asistenciaActual = {
            curso_id: cursoActual,
            fecha: fecha,
            estados: {},
            updatedAt: null
        }
    }

    if (!asistenciaActual.estados || typeof asistenciaActual.estados !== "object" || Array.isArray(asistenciaActual.estados)) {
        asistenciaActual.estados = {}
    }

    var huboCambios = false
    getAlumnosCurso().forEach(function (alumno) {
        var estado = asistenciaActual.estados[alumno.alumno_id]
        if (estado !== "presente" && estado !== "ausente") {
            asistenciaActual.estados[alumno.alumno_id] = "presente"
            huboCambios = true
        }
    })

    if (huboCambios) {
        saveAsistenciaActual()
    }
}

function saveAsistenciaActual(message) {
    if (!asistenciaActual) {
        return
    }

    asistenciaActual.updatedAt = new Date().toISOString()

    var sesiones = getStorageArray("asistencias").filter(function (sesion) {
        return !(sesion.curso_id === asistenciaActual.curso_id && sesion.fecha === asistenciaActual.fecha)
    })

    sesiones.push(asistenciaActual)
    localStorage.setItem("asistencias", JSON.stringify(sesiones))

    if (message) {
        setLayoutMessage(message, "success")
    }
}

function getEstadoAsistencia(alumnoId) {
    if (!asistenciaActual || !asistenciaActual.estados) {
        return "presente"
    }

    return asistenciaActual.estados[alumnoId] === "ausente" ? "ausente" : "presente"
}

function setEstadoAsistencia(alumnoId, estado) {
    if (!asistenciaActual) {
        return
    }

    asistenciaActual.estados[alumnoId] = estado
    saveAsistenciaActual("Estado actualizado.")
    refreshView()
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

    designStatus.textContent = `Hace clic en un alumno o en su asiento para marcar presente o ausente el ${formatDateLabel(layoutDateInput.value)}.`

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

        var estado = getEstadoAsistencia(alumno.alumno_id)
        var nombreCorto = alumno.nombre ? alumno.nombre.split(" ")[0] : "Alumno"

        asiento.textContent = nombreCorto
        asiento.title = `${alumno.nombre} ${alumno.apellido || ""} - ${estado}`
        asiento.style.cursor = "pointer"
        applySeatStyle(asiento, estado)

        asiento.addEventListener("click", function (event) {
            event.stopPropagation()
            var nuevoEstado = estado === "presente" ? "ausente" : "presente"
            setEstadoAsistencia(alumno.alumno_id, nuevoEstado)
        })
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
        var estadoActual = getEstadoAsistencia(a.alumno_id)
        var alumnoItem = document.createElement("div")
        var alumnoMain = document.createElement("div")
        var desplegable = document.createElement("div")

        Object.assign(alumnoMain.style, alumnosContainerItemStyle)
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
                <span class="state-badge ${estadoActual}">${estadoActual === "ausente" ? "Ausente" : "Presente"}</span>
            </div>
        `

        if (a.asiento_id == null) {
            var formContainer = document.createElement("form")
            Object.assign(formContainer.style, miniFormStyle)

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
                var fila = Number(e.target.fila_input.value) - 1
                var columna = Number(e.target.columna_input.value) - 1
                var asiento = Number(e.target.asiento_input.value)
                var asiento_id = `${fila};${columna}-${asiento}`

                if (Number.isNaN(fila) || Number.isNaN(columna) || Number.isNaN(asiento)) {
                    setLayoutMessage("Completa fila, columna y asiento correctamente.", "error")
                    return
                }

                if (isBusy(asiento_id) == false) {
                    setAsiento(e.target.asignar_button.id, asiento_id)
                    setLayoutMessage("Asiento asignado correctamente.", "success")
                    refreshView()
                } else {
                    setLayoutMessage("Ese asiento ya esta ocupado.", "error")
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
                setLayoutMessage("Alumno quitado del diagrama.", "success")
                refreshView()
            })

            desplegable.append(btnEliminar)
        }

        var statusRow = document.createElement("div")
        statusRow.className = "status-toggle-row"

        ;["presente", "ausente"].forEach(function (estado) {
            var statusButton = document.createElement("button")
            statusButton.type = "button"
            statusButton.className = `status-toggle-btn ${estado}`
            statusButton.textContent = estado === "ausente" ? "Ausente" : "Presente"

            if (estadoActual === estado) {
                statusButton.classList.add("active")
            }

            statusButton.addEventListener("click", function (event) {
                event.stopPropagation()
                setEstadoAsistencia(a.alumno_id, estado)
            })

            statusRow.append(statusButton)
        })

        desplegable.append(statusRow)

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