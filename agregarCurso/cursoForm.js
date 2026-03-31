// Script para alta e importación de cursos.
// Qué hace: registra cursos manualmente, importa datos desde JSON y genera diseños/asientos automáticos.
// Qué se puede cambiar: textos de confirmación, mensajes de error y comportamiento visual del importador.
var cursoForm = document.getElementById("curso_form")
var backButton = document.getElementById("back_button")
var formMessage = document.getElementById("form_message")
var jsonFileInput = document.getElementById("json_file_input")
var importJsonButton = document.getElementById("import_json_button")

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
    formMessage.textContent = text
    formMessage.className = `form-message ${type}`
}

function normalizeText(text) {
    return String(text || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
}

function parseCourseId(cursoId) {
    var match = String(cursoId || "").trim().match(/^(\d+)\s*°\s*(.+)$/)

    if (match) {
        return {
            año: match[1],
            division: match[2].trim()
        }
    }

    return {
        año: String(cursoId || "").trim(),
        division: ""
    }
}

function buildUniqueStudentId(student, cursoId, alumnos, nombre, apellido) {
    var base = student.alumno_id != null
        ? `${cursoId}-${student.alumno_id}`
        : `${cursoId}-${normalizeText(nombre)}-${normalizeText(apellido)}`

    var candidate = base
    var counter = 1

    while (alumnos.some(function (alumno) { return String(alumno.alumno_id) === String(candidate) })) {
        candidate = `${base}-${counter}`
        counter += 1
    }

    return candidate
}

function buildCenterOutOrder(total) {
    var order = []
    var left = Math.floor((total - 1) / 2)
    var right = left + 1

    while (order.length < total) {
        if (left >= 0) {
            order.push(left)
            left -= 1
        }

        if (order.length < total && right < total) {
            order.push(right)
            right += 1
        }
    }

    return order
}

function buildPreferredBankOrder(rows, columns) {
    if (rows === 4 && columns === 5) {
        return [
            "0;3", "0;2", "1;2", "3;2",
            "1;1", "2;1", "1;0", "2;0",
            "0;1", "3;1", "1;3", "2;3",
            "0;0", "3;0", "1;4", "2;4",
            "0;4", "3;4"
        ]
    }

    var columnOrder = buildCenterOutOrder(rows)
    var rowOrder = []

    for (var row = Math.max(columns - 2, 0); row >= 0; row -= 1) {
        rowOrder.push(row)
    }

    if (columns > 0) {
        rowOrder.push(columns - 1)
    }

    var used = new Set()
    var order = []

    rowOrder.forEach(function (rowIndex) {
        if (used.has(rowIndex)) {
            return
        }

        used.add(rowIndex)

        columnOrder.forEach(function (columnIndex) {
            order.push(`${columnIndex};${rowIndex}`)
        })
    })

    return order
}

function getAutomaticLayout(studentCount) {
    var bancosNecesarios = Math.max(Math.ceil(studentCount / 2), 1)

    if (bancosNecesarios <= 20) {
        return { rows: 4, columns: 5 }
    }

    var columns = 5
    var rows = Math.max(4, Math.ceil(bancosNecesarios / columns))

    return { rows: rows, columns: columns }
}

function buildDesignData(cursoId, rows, columns) {
    // Estas medidas controlan el tamaño visual del aula generada automáticamente.
    // Si quieren un plano más grande/chico o textos más visibles, ajustá este bloque.
    var tamañoDiv = 900
    var design = document.createElement("div")
    design.id = "design_element"

    Object.assign(design.style, {
        width: `${tamañoDiv}px`,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    })

    var marginCount = Math.max(rows - 1, 1)
    var marginSize = (tamañoDiv / marginCount) * 0.10
    var flexContainerSize = tamañoDiv - ((rows - 1) * marginSize)
    var flexWidth = flexContainerSize / rows
    var bancoHeight = flexWidth * 0.25
    var asientosHeight = bancoHeight * 0.8
    var fontSize = (asientosHeight * 16) / 65
    var designId = `${cursoId}-${rows}x${columns}`

    var nuevosBancos = []
    var nuevosAsientos = []

    for (var i = 0; i < rows; i++) {
        var bancoAsientosContainer = document.createElement("div")
        bancoAsientosContainer.id = String(i)

        Object.assign(bancoAsientosContainer.style, {
            display: "flex",
            flexDirection: "column-reverse",
            width: `${flexWidth}px`
        })

        for (var j = 0; j < columns; j++) {
            var bancoId = `${i};${j}`
            var flexItemContainer = document.createElement("div")
            var asientosContainer = document.createElement("div")
            var bancoRepresentation = document.createElement("img")
            var asientoItem1 = document.createElement("div")
            var asientoItem2 = document.createElement("div")

            Object.assign(flexItemContainer.style, {
                width: "100%",
                display: "flex",
                flexDirection: "column",
                marginBottom: `${marginSize * 0.60}px`
            })

            Object.assign(asientosContainer.style, {
                display: "flex",
                height: `${asientosHeight}px`,
                width: "100%",
                flexDirection: "row"
            })

            // Apariencia del banco dentro del diseño generado: color base y tamaño.
            Object.assign(bancoRepresentation.style, {
                backgroundColor: "brown",
                width: "100%",
                height: `${bancoHeight}px`
            })
            bancoRepresentation.src = "../images/banco.png"

            // Apariencia del texto de cada asiento: color, centrado y tamaño de fuente.
            ;[asientoItem1, asientoItem2].forEach(function (item) {
                Object.assign(item.style, {
                    display: "flex",
                    alignItems: "center",
                    color: "black",
                    justifyContent: "center",
                    textAlign: "center",
                    fontSize: `${fontSize}px`,
                    width: "50%",
                    height: "100%"
                })
                item.textContent = "-"
            })

            asientoItem1.id = `${bancoId}-1`
            asientoItem2.id = `${bancoId}-2`
            asientosContainer.id = "asientos_container"
            flexItemContainer.id = bancoId

            asientosContainer.append(asientoItem1, asientoItem2)
            flexItemContainer.append(asientosContainer, bancoRepresentation)
            bancoAsientosContainer.append(flexItemContainer)

            nuevosBancos.push({
                banco_id: bancoId,
                pos_x: i,
                pos_y: j,
                diseño_id: designId
            })

            nuevosAsientos.push(
                { asiento_id: `${bancoId}-1`, banco_id: bancoId, numero: 1, diseño_id: designId },
                { asiento_id: `${bancoId}-2`, banco_id: bancoId, numero: 2, diseño_id: designId }
            )
        }

        design.append(bancoAsientosContainer)
    }

    return {
        diseño: {
            curso_id: cursoId,
            filas: String(rows),
            columnas: String(columns),
            asientos_count: (rows * 2) * columns,
            diseño_element: design.outerHTML,
            diseño_id: designId
        },
        bancos: nuevosBancos,
        asientos: nuevosAsientos
    }
}

function ensureAutomaticDesignForCourse(cursoId, studentCount) {
    var diseños = getStorageArray("diseños")
    var diseñoExistente = diseños.find(function (item) {
        return item.curso_id === cursoId
    })

    if (diseñoExistente) {
        return 0
    }

    var layout = getAutomaticLayout(studentCount)
    var designData = buildDesignData(cursoId, layout.rows, layout.columns)

    var diseñosActualizados = diseños.filter(function (diseño) {
        return diseño.curso_id !== cursoId
    })
    diseñosActualizados.push(designData.diseño)
    localStorage.setItem("diseños", JSON.stringify(diseñosActualizados))

    var asientosActualizados = getStorageArray("asientos").filter(function (asiento) {
        return !String(asiento.diseño_id || "").startsWith(`${cursoId}-`)
    })
    asientosActualizados.push.apply(asientosActualizados, designData.asientos)
    localStorage.setItem("asientos", JSON.stringify(asientosActualizados))

    var bancosActualizados = getStorageArray("bancos").filter(function (banco) {
        return !String(banco.diseño_id || "").startsWith(`${cursoId}-`)
    })
    bancosActualizados.push.apply(bancosActualizados, designData.bancos)
    localStorage.setItem("bancos", JSON.stringify(bancosActualizados))

    return 1
}

function autoAssignSeatsForCourse(cursoId, alumnos) {
    var diseños = getStorageArray("diseños")
    var diseño = diseños.find(function (item) {
        return item.curso_id === cursoId
    })

    if (!diseño) {
        return 0
    }

    var rows = Number(diseño.filas)
    var columns = Number(diseño.columnas)

    if (!rows || !columns) {
        return 0
    }

    var seatOrder = []
    buildPreferredBankOrder(rows, columns).forEach(function (bankId) {
        seatOrder.push(`${bankId}-1`)
        seatOrder.push(`${bankId}-2`)
    })

    var alumnosCurso = alumnos.filter(function (alumno) {
        return alumno.curso_id === cursoId
    })

    var occupiedSeats = new Set(
        alumnosCurso
            .map(function (alumno) { return alumno.asiento_id })
            .filter(Boolean)
    )

    var assignedCount = 0

    alumnosCurso.forEach(function (alumno) {
        if (alumno.asiento_id) {
            return
        }

        var nextSeat = seatOrder.find(function (seatId) {
            return !occupiedSeats.has(seatId)
        })

        if (!nextSeat) {
            return
        }

        alumno.asiento_id = nextSeat
        occupiedSeats.add(nextSeat)
        assignedCount += 1
    })

    return assignedCount
}

function importFromJsonData(data) {
    if (!Array.isArray(data) || data.length === 0) {
        setMessage("El archivo JSON no contiene alumnos para importar.", "error")
        return
    }

    var cursos = getStorageArray("cursos")
    var alumnos = getStorageArray("alumnos")
    var cursosAgregados = 0
    var alumnosAgregados = 0
    var diseñosGenerados = 0
    var asientosAsignados = 0
    var primerCursoImportado = null
    var cursosImportados = new Set()

    data.forEach(function (item) {
        var cursoId = String(item.curso_id || "").trim()
        var nombre = String(item.nombre || "").trim()
        var apellido = String(item.apellido || "").trim()

        if (!cursoId || !nombre || !apellido) {
            return
        }

        if (!primerCursoImportado) {
            primerCursoImportado = cursoId
        }

        cursosImportados.add(cursoId)

        var cursoExiste = cursos.some(function (curso) {
            return curso.id === cursoId
        })

        if (!cursoExiste) {
            var parsedCourse = parseCourseId(cursoId)
            cursos.push({
                id: cursoId,
                año: parsedCourse.año,
                division: parsedCourse.division
            })
            cursosAgregados += 1
        }

        var alumnoExiste = alumnos.some(function (alumno) {
            return alumno.curso_id === cursoId
                && String(alumno.nombre || "").trim().toLowerCase() === nombre.toLowerCase()
                && String(alumno.apellido || "").trim().toLowerCase() === apellido.toLowerCase()
        })

        if (!alumnoExiste) {
            alumnos.push({
                alumno_id: buildUniqueStudentId(item, cursoId, alumnos, nombre, apellido),
                nombre: nombre,
                apellido: apellido,
                genero: item.genero || null,
                asiento_id: item.asiento_id || null,
                curso_id: cursoId
            })
            alumnosAgregados += 1
        }
    })

    cursosImportados.forEach(function (cursoId) {
        var cantidadAlumnosCurso = alumnos.filter(function (alumno) {
            return alumno.curso_id === cursoId
        }).length

        diseñosGenerados += ensureAutomaticDesignForCourse(cursoId, cantidadAlumnosCurso)
        asientosAsignados += autoAssignSeatsForCourse(cursoId, alumnos)
    })

    if (cursosAgregados === 0 && alumnosAgregados === 0 && diseñosGenerados === 0 && asientosAsignados === 0) {
        setMessage("El JSON ya estaba cargado o no tenia datos nuevos.", "error")
        return
    }

    localStorage.setItem("cursos", JSON.stringify(cursos))
    localStorage.setItem("alumnos", JSON.stringify(alumnos))

    if (primerCursoImportado) {
        localStorage.setItem("cursoCurrent", primerCursoImportado)
    }

    setMessage(`Importacion lista: ${cursosAgregados} curso(s), ${alumnosAgregados} alumno(s), ${diseñosGenerados} diseño(s) y ${asientosAsignados} asiento(s) asignados.`, "success")

    setTimeout(function () {
        window.location.assign("../principal/principal.html")
    }, 700)
}

backButton.addEventListener("click", function () {
    window.location.assign("../principal/principal.html")
})

cursoForm.addEventListener("submit", function (ea) {
    ea.preventDefault()

    var año = ea.target.año.value.trim()
    var division = ea.target.division.value.trim()

    if (!año || !division) {
        setMessage("Completa el año y la division antes de continuar.", "error")
        return
    }

    var cursoId = `${año}°${division}`
    var cursos = getStorageArray("cursos")

    var yaExiste = cursos.some(function (curso) {
        return curso.id === cursoId
    })

    if (yaExiste) {
        setMessage("Ese curso ya existe en la lista.", "error")
        return
    }

    cursos.push({
        id: cursoId,
        año: año,
        division: division
    })

    localStorage.setItem("cursos", JSON.stringify(cursos))
    localStorage.setItem("cursoCurrent", cursoId)

    setMessage("Curso agregado correctamente. Redirigiendo...", "success")

    setTimeout(function () {
        window.location.assign("../principal/principal.html")
    }, 500)
})

importJsonButton.addEventListener("click", function () {
    var file = jsonFileInput.files[0]

    if (!file) {
        setMessage("Selecciona el archivo alumnos.json que queres importar.", "error")
        return
    }

    var reader = new FileReader()

    reader.onload = function (event) {
        try {
            var data = JSON.parse(String(event.target.result || "[]"))
            importFromJsonData(data)
        } catch {
            setMessage("No se pudo leer el archivo JSON seleccionado.", "error")
        }
    }

    reader.readAsText(file, "UTF-8")
})