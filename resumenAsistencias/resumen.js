var courseId = localStorage.getItem("cursoCurrent")
var pageTitle = document.getElementById("page_title")
var pageSubtitle = document.getElementById("page_subtitle")
var dateDisplay = document.getElementById("date_display")
var backButton = document.getElementById("back_button")
var backToAttendanceButton = document.getElementById("back_to_attendance")
var finishButton = document.getElementById("finish_button")

var countTotal = document.getElementById("count_total")
var countPresent = document.getElementById("count_present")
var countAbsent = document.getElementById("count_absent")

var presentList = document.getElementById("present_list")
var absentList = document.getElementById("absent_list")

var currentAttendance = null

const STATUS_CONFIG = {
    presente: {
        label: "Presente",
        badgeClass: "presente",
        background: "#e8f7ee",
        color: "#1f9d55"
    },
    ausente: {
        label: "Ausente",
        badgeClass: "ausente",
        background: "#fdeaea",
        color: "#cf3d3d"
    }
}

document.body.onload = function () {
    backButton.addEventListener("click", function () {
        window.location.assign("../asistencia/asistencia.html")
    })

    backToAttendanceButton.addEventListener("click", function () {
        window.location.assign("../asistencia/asistencia.html")
    })

    finishButton.addEventListener("click", function () {
        window.location.assign("../curso/curso.html")
    })

    if (!courseId) {
        pageTitle.textContent = "Ningun curso seleccionado"
        pageSubtitle.textContent = "Volve a la pantalla del curso."
        presentList.innerHTML = '<div class="empty-state">No se encontro un curso activo.</div>'
        absentList.innerHTML = ''
        return
    }

    loadCurrentAttendance()
    renderResume()
}

function getTodayString() {
    var now = new Date()
    var offset = now.getTimezoneOffset() * 60000
    return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

function formatDateLabel(value) {
    if (!value || !value.includes("-")) {
        return "sin fecha"
    }

    var parts = value.split("-")
    var meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    var monthIndex = parseInt(parts[1]) - 1
    return `${parts[2]} de ${meses[monthIndex]} de ${parts[0]}`
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

function loadCurrentAttendance() {
    var fecha = localStorage.getItem("attendanceDate") || getTodayString()
    var sesiones = getStorageArray("asistencias")

    currentAttendance = sesiones.find(function (sesion) {
        return sesion.curso_id === courseId && sesion.fecha === fecha
    })

    if (!currentAttendance) {
        currentAttendance = {
            curso_id: courseId,
            fecha: fecha,
            estados: {},
            updatedAt: null
        }
    }

    if (!currentAttendance.estados || typeof currentAttendance.estados !== "object" || Array.isArray(currentAttendance.estados)) {
        currentAttendance.estados = {}
    }
}

function getStatusForAlumno(alumnoId) {
    if (!currentAttendance || !currentAttendance.estados) {
        return "presente"
    }

    return currentAttendance.estados[alumnoId] === "ausente" ? "ausente" : "presente"
}

function renderResume() {
    var alumnos = getStudentsForCourse()
    var presentes = []
    var ausentes = []

    alumnos.forEach(function (alumno) {
        var estado = getStatusForAlumno(alumno.alumno_id)
        if (estado === "ausente") {
            ausentes.push(alumno)
        } else {
            presentes.push(alumno)
        }
    })

    pageTitle.textContent = `Resumen - ${courseId}`
    pageSubtitle.textContent = `Asistencia de ${courseId}`
    dateDisplay.textContent = `Fecha: ${formatDateLabel(currentAttendance.fecha)}`

    updateSummary(presentes, ausentes)
    renderPresentList(presentes)
    renderAbsentList(ausentes)
}

function updateSummary(presentes, ausentes) {
    var total = presentes.length + ausentes.length

    countTotal.textContent = total
    countPresent.textContent = presentes.length
    countAbsent.textContent = ausentes.length
}

function renderPresentList(alumnos) {
    presentList.innerHTML = ""

    if (alumnos.length === 0) {
        presentList.innerHTML = '<div class="empty-state">No hay alumnos presentes.</div>'
        return
    }

    alumnos.forEach(function (alumno) {
        var item = document.createElement("div")
        item.className = "resume-item present-item"

        var content = document.createElement("div")
        content.className = "resume-item-content"

        var name = document.createElement("p")
        name.className = "resume-name"
        name.textContent = `${alumno.apellido || "Sin apellido"}, ${alumno.nombre}`

        var meta = document.createElement("p")
        meta.className = "resume-meta"
        meta.textContent = alumno.asiento_id ? `Asiento: ${alumno.asiento_id}` : "Sin asiento asignado"

        var badge = document.createElement("span")
        badge.className = "resume-badge present"
        badge.textContent = "✓ Presente"

        content.append(name, meta)
        item.append(content, badge)
        presentList.append(item)
    })
}

function renderAbsentList(alumnos) {
    absentList.innerHTML = ""

    if (alumnos.length === 0) {
        absentList.innerHTML = '<div class="empty-state">No hay alumnos ausentes.</div>'
        return
    }

    alumnos.forEach(function (alumno) {
        var item = document.createElement("div")
        item.className = "resume-item absent-item"

        var content = document.createElement("div")
        content.className = "resume-item-content"

        var name = document.createElement("p")
        name.className = "resume-name"
        name.textContent = `${alumno.apellido || "Sin apellido"}, ${alumno.nombre}`

        var meta = document.createElement("p")
        meta.className = "resume-meta"
        meta.textContent = alumno.asiento_id ? `Asiento: ${alumno.asiento_id}` : "Sin asiento asignado"

        var badge = document.createElement("span")
        badge.className = "resume-badge absent"
        badge.textContent = "✗ Ausente"

        content.append(name, meta)
        item.append(content, badge)
        absentList.append(item)
    })
}
