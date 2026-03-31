var alumnosListTitle = document.getElementById("alumnos_list_title")
var alumnosContainer = document.getElementById("alumnos_container")
var alumnoForm = document.getElementById("add_alumno_form")
var alumnoFormMessage = document.getElementById("alumno_form_message")
var formCourseTitle = document.getElementById("form_course_title")

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

const optionsMenuStyle = {
    display: "none",
    backgroundColor: "rgba(8, 38, 84, 0.92)",
    width: "100%",
    padding: "10px",
    boxSizing: "border-box",
    borderRadius: "0 0 12px 12px",
    justifyContent: "center"
}

const btnEliminarStyle = {
    backgroundColor: "#d9534f",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "8px 14px",
    cursor: "pointer",
    fontWeight: "bold"
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

function setMessage(text, type) {
    alumnoFormMessage.textContent = text
    alumnoFormMessage.className = `form-message ${type}`
}

function getCursoActual() {
    return localStorage.getItem("cursoCurrent")
}

document.body.onload = function () {
    var cursoActual = getCursoActual()
    formCourseTitle.textContent = cursoActual ? `Agregar alumno a ${cursoActual}` : "Agregar alumno nuevo"
    loadAlumnosList()
}

function loadAlumnosList() {
    alumnosContainer.innerHTML = ""

    var cursoCurrent = getCursoActual()
    var alumnos = getStorageArray("alumnos")

    if (!cursoCurrent) {
        alumnosListTitle.textContent = "Lista de alumnos"
        alumnosContainer.innerHTML = `<div class="empty-state">Primero seleccioná un curso desde el panel principal.</div>`
        return
    }

    var alumnosCurso = alumnos.filter(function (alumno) {
        return alumno.curso_id == cursoCurrent
    })

    alumnosListTitle.textContent = alumnosCurso.length === 1
        ? "1 alumno cargado"
        : `${alumnosCurso.length} alumnos cargados`

    if (alumnosCurso.length === 0) {
        alumnosContainer.innerHTML = `<div class="empty-state">Todavía no hay alumnos cargados para este curso.</div>`
        return
    }

    alumnosCurso.forEach(function (a) {
        var alumnoItem = document.createElement("div")
        var alumnoMain = document.createElement("div")
        var optionsMenu = document.createElement("div")
        var deleteBtn = document.createElement("button")

        deleteBtn.id = a.alumno_id

        Object.assign(alumnoItem.style, { width: "100%" })
        Object.assign(alumnoMain.style, alumnosContainerItemStyle)
        Object.assign(optionsMenu.style, optionsMenuStyle)
        Object.assign(deleteBtn.style, btnEliminarStyle)

        alumnoMain.innerHTML = `<p><strong>${a.apellido || "Sin apellido"}, ${a.nombre}</strong></p>`
        deleteBtn.textContent = "Eliminar"

        alumnoMain.addEventListener("click", function () {
            var isVisible = optionsMenu.style.display === "flex"
            optionsMenu.style.display = isVisible ? "none" : "flex"
        })

        alumnoMain.addEventListener("mouseenter", function (e) {
            e.currentTarget.style.backgroundColor = "#dfeeff"
        })

        alumnoMain.addEventListener("mouseleave", function (e) {
            e.currentTarget.style.backgroundColor = "#eef4ff"
        })

        deleteBtn.addEventListener("click", function (ea) {
            var alumnoId = ea.target.id
            var alumnos = getStorageArray("alumnos")
            var alumnosActualizados = alumnos.filter(function (alumno) {
                return alumno.alumno_id !== alumnoId
            })

            localStorage.setItem("alumnos", JSON.stringify(alumnosActualizados))
            setMessage("Alumno eliminado correctamente.", "success")
            loadAlumnosList()
        })

        optionsMenu.append(deleteBtn)
        alumnoItem.append(alumnoMain)
        alumnoItem.append(optionsMenu)
        alumnosContainer.append(alumnoItem)
    })
}

alumnoForm.addEventListener("submit", function (ea) {
    ea.preventDefault()

    var cursoCurrent = getCursoActual()
    if (!cursoCurrent) {
        setMessage("Seleccioná un curso antes de cargar alumnos.", "error")
        return
    }

    var alumnos = getStorageArray("alumnos")
    var nameValue = ea.target.name_value.value.trim()
    var surnameValue = ea.target.surname_value.value.trim()

    if (!nameValue || !surnameValue) {
        setMessage("Completá nombre y apellido.", "error")
        return
    }

    var repetido = alumnos.some(function (alumno) {
        return alumno.curso_id === cursoCurrent
            && alumno.nombre.toLowerCase() === nameValue.toLowerCase()
            && alumno.apellido.toLowerCase() === surnameValue.toLowerCase()
    })

    if (repetido) {
        setMessage("Ese alumno ya fue cargado en este curso.", "error")
        return
    }

    var alumno = {
        nombre: nameValue,
        apellido: surnameValue,
        genero: null,
        alumno_id: `${cursoCurrent}-${Date.now()}`,
        curso_id: cursoCurrent,
        asiento_id: null
    }

    alumnos.push(alumno)
    localStorage.setItem("alumnos", JSON.stringify(alumnos))

    ea.target.reset()
    setMessage("Alumno agregado correctamente.", "success")
    loadAlumnosList()
})