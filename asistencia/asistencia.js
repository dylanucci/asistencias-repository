// Script de asistencia diaria.
// Qué hace: gestiona la sesión por fecha, actualiza contadores y sincroniza la lista con el diseño del aula.
// Qué se puede cambiar: textos del encabezado, nombres de estados y mensajes de guardado.
var courseId = localStorage.getItem("cursoCurrent")
var pageTitle = document.getElementById("page_title")
var pageSubtitle = document.getElementById("page_subtitle")
var dateInput = document.getElementById("attendance_date")
var backButton = document.getElementById("back_button")
var saveMessage = document.getElementById("save_message")
var attendanceList = document.getElementById("attendance_list")
var layoutContainer = document.getElementById("layout_container")
var markAllPresentButton = document.getElementById("mark_all_present")
var resetButton = document.getElementById("reset_button")

var countTotal = document.getElementById("count_total")
var countPresent = document.getElementById("count_present")
var countAbsent = document.getElementById("count_absent")

var currentSession = null

// Configuración visual del estado de asistencia.
// Si te piden cambiar nombres visibles o colores del semáforo, hacelo acá.
const STATUS_CONFIG = {
    libre: {
        label: "Libre",
        badgeClass: "sin-marcar",
        background: "#eef2f7",
        color: "#637083",
        border: "#cbd5e1"
    },
    presente: {
        label: "Presente",
        badgeClass: "presente",
        background: "#e8f7ee",
        color: "#1f9d55",
        border: "#7dd3a3"
    },
    ausente: {
        label: "Ausente",
        badgeClass: "ausente",
        background: "#fdeaea",
        color: "#cf3d3d",
        border: "#f0a1a1"
    }
}

document.body.onload = function () {
    if (!dateInput.value) {
        dateInput.value = getTodayString()
    }

    backButton.addEventListener("click", function () {
        window.location.assign("../curso/curso.html")
    })

    dateInput.addEventListener("change", function () {
        loadSessionForCurrentDate()
        renderAll()
        setMessage("Se cargo la fecha seleccionada.", "success")
    })

    markAllPresentButton.addEventListener("click", function () {
        var alumnos = getStudentsForCourse()

        if (alumnos.length === 0) {
            setMessage("No hay alumnos para marcar en este curso.", "error")
            return
        }

        alumnos.forEach(function (alumno) {
            currentSession.estados[alumno.alumno_id] = "presente"
        })

        persistCurrentSession("Todos los alumnos quedaron como presentes.")
        renderAll()
    })

    resetButton.addEventListener("click", function () {
        if (!currentSession) {
            return
        }

        var confirmacion = window.confirm("Queres restablecer la asistencia del dia y marcar a todos como presentes?")
        if (!confirmacion) {
            return
        }

        currentSession.estados = {}
        getStudentsForCourse().forEach(function (alumno) {
            currentSession.estados[alumno.alumno_id] = "presente"
        })

        persistCurrentSession("La asistencia del dia fue restablecida.")
        renderAll()
    })

    if (!courseId) {
        pageTitle.textContent = "Ningun curso seleccionado"
        pageSubtitle.textContent = "Volve a la pantalla del curso y entra otra vez a asistencia."
        layoutContainer.innerHTML = '<div class="empty-state">No se encontro un curso activo.</div>'
        attendanceList.innerHTML = '<div class="empty-state">Selecciona un curso para comenzar.</div>'
        updateSummary([])
        return
    }

    loadSessionForCurrentDate()
    renderAll()
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

function getStudentsForCourse() {
    return getStorageArray("alumnos").filter(function (alumno) {
        return alumno.curso_id == courseId
    })
}

function ensureDefaultStates(session, alumnos) {
    var huboCambios = false

    alumnos.forEach(function (alumno) {
        var estado = session.estados[alumno.alumno_id]
        if (estado !== "presente" && estado !== "ausente") {
            session.estados[alumno.alumno_id] = "presente"
            huboCambios = true
        }
    })

    return huboCambios
}

function loadSessionForCurrentDate() {
    var fecha = dateInput.value || getTodayString()
    var sesiones = getStorageArray("asistencias")

    currentSession = sesiones.find(function (sesion) {
        return sesion.curso_id === courseId && sesion.fecha === fecha
    })

    if (!currentSession) {
        currentSession = {
            curso_id: courseId,
            fecha: fecha,
            estados: {},
            updatedAt: null
        }
    }

    if (!currentSession.estados || typeof currentSession.estados !== "object" || Array.isArray(currentSession.estados)) {
        currentSession.estados = {}
    }

    if (ensureDefaultStates(currentSession, getStudentsForCourse())) {
        persistCurrentSession()
    }
}

function persistCurrentSession(message) {
    if (!currentSession) {
        return
    }

    currentSession.updatedAt = new Date().toISOString()

    var sesiones = getStorageArray("asistencias").filter(function (sesion) {
        return !(sesion.curso_id === currentSession.curso_id && sesion.fecha === currentSession.fecha)
    })

    sesiones.push(currentSession)
    localStorage.setItem("asistencias", JSON.stringify(sesiones))

    if (message) {
        setMessage(message, "success")
    }
}

function setMessage(text, type) {
    saveMessage.textContent = text
    saveMessage.className = `save-message ${type}`
}

function getStatusForAlumno(alumnoId) {
    if (!currentSession || !currentSession.estados) {
        return "presente"
    }

    return currentSession.estados[alumnoId] === "ausente" ? "ausente" : "presente"
}

function updateStatus(alumnoId, status) {
    currentSession.estados[alumnoId] = status
    persistCurrentSession("Asistencia guardada automaticamente.")
    renderAll()
}

function updateSummary(alumnos) {
    var resumen = {
        total: alumnos.length,
        presente: 0,
        ausente: 0
    }

    alumnos.forEach(function (alumno) {
        if (getStatusForAlumno(alumno.alumno_id) === "ausente") {
            resumen.ausente += 1
        } else {
            resumen.presente += 1
        }
    })

    countTotal.textContent = resumen.total
    countPresent.textContent = resumen.presente
    countAbsent.textContent = resumen.ausente
}

function renderAll() {
    var alumnos = getStudentsForCourse()

    // Textos visibles del encabezado: podés reescribirlos sin afectar la lógica de guardado.
    pageTitle.textContent = `Asistencia - ${courseId}`
    pageSubtitle.textContent = `Marcando asistencia de ${courseId} para ${formatDateLabel(dateInput.value)}.`

    updateSummary(alumnos)
    renderAttendanceList(alumnos)
    renderLayout(alumnos)
}

function renderAttendanceList(alumnos) {
    attendanceList.innerHTML = ""

    if (alumnos.length === 0) {
        attendanceList.innerHTML = '<div class="empty-state">Todavia no hay alumnos cargados para este curso.</div>'
        return
    }

    alumnos.forEach(function (alumno) {
        var estadoActual = getStatusForAlumno(alumno.alumno_id)
        var studentItem = document.createElement("article")
        studentItem.className = "student-item"

        var studentTop = document.createElement("div")
        studentTop.className = "student-top"

        var info = document.createElement("div")
        var studentName = document.createElement("p")
        studentName.className = "student-name"
        studentName.textContent = `${alumno.apellido || "Sin apellido"}, ${alumno.nombre}`

        var studentMeta = document.createElement("p")
        studentMeta.className = "student-meta"
        studentMeta.textContent = alumno.asiento_id
            ? `Asiento asignado: ${alumno.asiento_id}`
            : "Sin asiento asignado"

        info.append(studentName, studentMeta)

        var badge = document.createElement("span")
        badge.className = `status-badge ${STATUS_CONFIG[estadoActual].badgeClass}`
        badge.textContent = STATUS_CONFIG[estadoActual].label

        studentTop.append(info, badge)

        var actions = document.createElement("div")
        actions.className = "status-actions"

        ["presente", "ausente"].forEach(function (status) {
            var button = document.createElement("button")
            button.type = "button"
            button.className = `status-btn ${status}`
            button.textContent = STATUS_CONFIG[status].label

            if (estadoActual === status) {
                button.classList.add("active")
            }

            button.addEventListener("click", function () {
                updateStatus(alumno.alumno_id, status)
            })

            actions.append(button)
        })

        studentItem.append(studentTop, actions)
        attendanceList.append(studentItem)
    })
}

function renderLayout(alumnos) {
    layoutContainer.innerHTML = ""

    var designs = getStorageArray("dise\u00F1os")
    var designData = designs.find(function (item) {
        return item.curso_id == courseId
    })

    if (!designData || !designData["dise\u00F1o_element"]) {
        layoutContainer.innerHTML = '<div class="empty-state">Este curso todavia no tiene un diseño de aula generado. Igual podes registrar la asistencia desde la lista.</div>'
        return
    }

    var wrapper = document.createElement("div")
    wrapper.innerHTML = designData["dise\u00F1o_element"]
    var designElement = wrapper.firstElementChild

    if (!designElement) {
        layoutContainer.innerHTML = '<div class="empty-state">No se pudo mostrar el diseño guardado.</div>'
        return
    }

    layoutContainer.append(designElement)

    Array.from(designElement.querySelectorAll("div[id]")).forEach(function (node) {
        if (node.id.includes(";") && node.id.includes("-")) {
            node.textContent = "-"
            applySeatStyle(node, "libre")
        }
    })

    alumnos.forEach(function (alumno) {
        if (!alumno.asiento_id) {
            return
        }

        var asiento = document.getElementById(alumno.asiento_id)
        if (!asiento) {
            return
        }

        var nombreCorto = alumno.nombre ? alumno.nombre.split(" ")[0] : "Alumno"
        var estado = getStatusForAlumno(alumno.alumno_id)

        asiento.textContent = nombreCorto
        asiento.title = `${alumno.nombre} ${alumno.apellido || ""} - ${STATUS_CONFIG[estado].label}`
        asiento.style.cursor = "pointer"
        applySeatStyle(asiento, estado)

        asiento.addEventListener("click", function () {
            var nuevoEstado = estado === "presente" ? "ausente" : "presente"
            updateStatus(alumno.alumno_id, nuevoEstado)
        })
    })
}

function applySeatStyle(asiento, status) {
    // Estilo visual de cada asiento en el plano del aula.
    // Cambiá colores, borde o tipografía acá si te piden otro look.
    var style = STATUS_CONFIG[status] || STATUS_CONFIG.libre
    asiento.style.backgroundColor = style.background
    asiento.style.color = style.color
    asiento.style.border = `1px solid ${style.border}`
    asiento.style.borderRadius = "8px"
    asiento.style.fontWeight = "700"
    asiento.style.padding = "0 2px"
}
