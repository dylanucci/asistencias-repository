// Script del generador de diseño del aula.
// Qué hace: crea la estructura de bancos/asientos según filas y columnas y la guarda en localStorage.
// Qué se puede cambiar: medidas visuales, mensajes al usuario y aspecto base del plano generado.
var button = document.getElementById("generate_button")
var backButton = document.getElementById("back_button")
var formMessage = document.getElementById("form_message")

button.addEventListener("click", generarDiseño)
backButton.addEventListener("click", function () {
    window.location.assign("../curso/curso.html")
})

const styles = {
    flexItemContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        marginBottom: "null"
    },
    asientosContainer: {
        display: "flex",
        height: "null",
        width: "100%",
        flexDirection: "row"
    },
    asientoItem: {
        display: "flex",
        alignItems: "center",
        color: "black",
        justifyContent: "center",
        textAlign: "center",
        fontSize: "null",
        width: "50%",
        height: "100%"
    },
    banco: {
        backgroundColor: "brown",
        width: "100%",
        height: "40.48px"
    },
    designContainer: {
        width: "null",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    bancoAsientosContainer: {
        display: "flex",
        flexDirection: "column-reverse",
        width: "null"
    }
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
    formMessage.textContent = text
    formMessage.className = `form-message ${type}`
}

function generarDiseño() {
    var tamañoDiv = 900
    var rows = Number(document.getElementById("rows").value)
    var columns = Number(document.getElementById("columns").value)
    var cursoId = localStorage.getItem("cursoCurrent")

    if (!cursoId) {
        setMessage("Primero seleccioná un curso desde el panel principal.", "error")
        return
    }

    if (!Number.isInteger(rows) || !Number.isInteger(columns) || rows <= 0 || columns <= 0) {
        setMessage("Ingresá una cantidad válida de filas y columnas.", "error")
        return
    }

    var design = document.createElement("div")
    design.id = "design_element"

    styles.designContainer.width = `${tamañoDiv}px`
    Object.assign(design.style, styles.designContainer)

    var marginCount = Math.max(rows - 1, 1)
    var marginSize = (tamañoDiv / marginCount) * 0.10
    var flexContainerSize = tamañoDiv - ((rows - 1) * marginSize)
    var flexWidth = flexContainerSize / rows

    styles.bancoAsientosContainer.width = `${flexWidth}px`
    styles.flexItemContainer.marginBottom = `${marginSize * 0.60}px`
    styles.banco.height = `${flexWidth * 0.25}px`
    styles.asientosContainer.height = `${flexWidth * 0.25 * 0.8}px`
    styles.asientoItem.fontSize = `${(flexWidth * 0.25 * 0.8) * 16 / 65}px`

    var designObject = {
        curso_id: cursoId,
        filas: String(rows),
        columnas: String(columns),
        asientos_count: (rows * 2) * columns,
        diseño_element: null,
        diseño_id: `${cursoId}-${rows}x${columns}`
    }

    var nuevosBancos = []
    var nuevosAsientos = []

    for (var i = 0; i < rows; i++) {
        var bancoAsientosContainer = document.createElement("div")
        bancoAsientosContainer.id = i
        Object.assign(bancoAsientosContainer.style, styles.bancoAsientosContainer)

        for (var j = 0; j < columns; j++) {
            var banco = {
                banco_id: `${i};${j}`,
                pos_x: i,
                pos_y: j,
                diseño_id: designObject.diseño_id
            }

            var asiento1 = { asiento_id: `${banco.banco_id}-1`, banco_id: banco.banco_id, numero: 1, diseño_id: designObject.diseño_id }
            var asiento2 = { asiento_id: `${banco.banco_id}-2`, banco_id: banco.banco_id, numero: 2, diseño_id: designObject.diseño_id }

            nuevosBancos.push(banco)
            nuevosAsientos.push(asiento1, asiento2)

            var flexItemContainer = document.createElement("div")
            var asientosContainer = document.createElement("div")
            var bancoRepresentation = document.createElement("img")
            var asientoItem1 = document.createElement("div")
            var asientoItem2 = document.createElement("div")

            Object.assign(flexItemContainer.style, styles.flexItemContainer)
            Object.assign(asientosContainer.style, styles.asientosContainer)
            Object.assign(bancoRepresentation.style, styles.banco)
            Object.assign(asientoItem1.style, styles.asientoItem)
            Object.assign(asientoItem2.style, styles.asientoItem)

            flexItemContainer.id = banco.banco_id
            bancoRepresentation.src = "../images/banco.png"
            asientosContainer.id = "asientos_container"

            asientoItem1.id = asiento1.asiento_id
            asientoItem1.innerText = "-"
            asientoItem2.id = asiento2.asiento_id
            asientoItem2.innerText = "-"

            asientosContainer.append(asientoItem1, asientoItem2)
            flexItemContainer.append(asientosContainer, bancoRepresentation)
            bancoAsientosContainer.append(flexItemContainer)
        }

        design.append(bancoAsientosContainer)
    }

    designObject.diseño_element = design.outerHTML

    var diseñosObject = getStorageArray("diseños").filter(function (diseño) {
        return diseño.curso_id !== cursoId
    })
    diseñosObject.push(designObject)
    localStorage.setItem("diseños", JSON.stringify(diseñosObject))

    var asientosObject = getStorageArray("asientos").filter(function (asiento) {
        return !String(asiento.diseño_id || "").startsWith(`${cursoId}-`)
    })
    asientosObject.push.apply(asientosObject, nuevosAsientos)
    localStorage.setItem("asientos", JSON.stringify(asientosObject))

    var bancosObject = getStorageArray("bancos").filter(function (banco) {
        return !String(banco.diseño_id || "").startsWith(`${cursoId}-`)
    })
    bancosObject.push.apply(bancosObject, nuevosBancos)
    localStorage.setItem("bancos", JSON.stringify(bancosObject))

    setMessage("Diseño generado correctamente. Redirigiendo…", "success")

    setTimeout(function () {
        window.location.assign("../curso/curso.html")
    }, 500)
}