import { Banco, Asiento, Diseño } from "../persistencia/models.js";

var button = document.getElementById("generate_button")

button.onclick = generarDiseño



const styles = {
  flexItemContainer: {
    width: "null",
    display: "flex",
    flexDirection: "column",
    marginBottom: "null"
  },
  asientosContainer: {
    display: "flex",
    height: "null",
    width: "100%",
    flexDirection: "row",
    marginBottom: "null"
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
  bancoAsientosContainer:{
    display: "flex",
    flexDirection: "column-reverse",
    width: "null"
  }
};


function generarDiseño(){

    var tamañoDiv = 900;
    var rows = document.getElementById("rows").value
    var columns = document.getElementById("columns").value
    
    var design = document.createElement("div")

    design.id = "design_element"

    var designStyle = styles.designContainer

    designStyle.width = `${tamañoDiv}px`

    Object.assign(design.style, styles.designContainer);
 
    var marginCount = rows-1

    var marginSize = (tamañoDiv / marginCount) * 0.10

    var flexContainerSize = tamañoDiv - (marginCount * marginSize)

    var flexWidth = flexContainerSize / rows

    var bancoAsientosWidth = flexWidth

    var bancoAsientosStyle = styles.bancoAsientosContainer    
    bancoAsientosStyle.width = `${bancoAsientosWidth}px`

    var flexItemContainerStyle = styles.flexItemContainer
    flexItemContainerStyle.width = "100%"
    flexItemContainerStyle.marginBottom = `${marginSize * 0.60}px`

    var bancoRepresentationStyle = styles.banco
    var bancoRepresentationStyleHeight = flexWidth * 0.25
    bancoRepresentationStyle.height = `${bancoRepresentationStyleHeight}px`

    var asientosContainerStyle = styles.asientosContainer
    var asientosContainerStyleHeigth = bancoRepresentationStyleHeight * 0.8    
    asientosContainerStyle.height = `${asientosContainerStyleHeigth}px`

    var nameFontSize = asientosContainerStyleHeigth * 16 / 65

    var asientoItemStyle = styles.asientoItem
    asientoItemStyle.fontSize = `${nameFontSize}px`

    

    if (rows <= 0 || columns <= 0){
        return;
    }

    var bancoAsientosContainer = document.createElement("div")
    
    var cursoId = localStorage.getItem("cursoCurrent")

    var designObject = new Diseño(cursoId, rows, columns, null)

    var bancosArray = []
    var asientosArray = []

    for (var i = 0; i<rows; i++){
        for(var j = 0; j<columns; j++)
        {

            bancoAsientosContainer.id = i

            var pos_x = i
            var pos_y = j;
            
            var banco = new Banco(pos_x, pos_y, designObject.diseño_id)

            var asiento1 = new Asiento(1, banco.banco_id, designObject.diseño_id)
            var asiento2 = new Asiento(2, banco.banco_id, designObject.diseño_id)

            addBanco(banco)
            addAsientos(asiento1, asiento2)

            var flexItemContainer = document.createElement("div")
            var asientosContainer = document.createElement("div")
            var bancoRepresentation = document.createElement("img")
            var asientoItem1 = document.createElement("div")
            var asientoItem2 = document.createElement("div")
            


            Object.assign(bancoAsientosContainer.style, bancoAsientosStyle)

            Object.assign(flexItemContainer.style, flexItemContainerStyle);

            Object.assign(asientosContainer.style, asientosContainerStyle);

            Object.assign(bancoRepresentation.style, bancoRepresentationStyle);

            Object.assign(asientoItem1.style, asientoItemStyle);

            Object.assign(asientoItem2.style, asientoItemStyle);



            flexItemContainer.id = banco.banco_id
        
            bancoRepresentation.src = "../images/banco.png"

            asientosContainer.id = "asientos_container"
           
            asientoItem1.id = asiento1.asiento_id
            asientoItem1.innerText = "-"


            asientoItem2.id = asiento2.asiento_id
            asientoItem2.innerText = "-"
            
            asientoItem1.addEventListener("mouseenter", (e) => {
            e.target.style.backgroundColor = "blue";
            
            });
            asientoItem2.addEventListener("mouseenter", (e) => {
                e.target.style.backgroundColor = "blue";
            });
            asientoItem1.addEventListener("mouseleave", (e) => {
                e.target.style.backgroundColor = "";
            });

            asientoItem2.addEventListener("mouseleave", (e) => {
                e.target.style.backgroundColor = "";
            });

          
              asientosContainer.append(asientoItem1)
              asientosContainer.append(asientoItem2)

              flexItemContainer.append(asientosContainer)
              flexItemContainer.append(bancoRepresentation)

              bancoAsientosContainer.append(flexItemContainer)
        }
        design.append(bancoAsientosContainer)
        bancoAsientosContainer = document.createElement("div")
    }

    designObject.diseño_element = design.outerHTML

    var diseñosString = localStorage.getItem("diseños")

    var diseñosObject = JSON.parse(diseñosString)

    diseñosObject.push(designObject)
    
    var diseñosUpdated = JSON.stringify(diseñosObject)

    localStorage.setItem("diseños", diseñosUpdated)

    window.location.assign("../curso/curso.html")
}

function addAsientos(asiento1, asiento2){
  var asientosObject = JSON.parse(localStorage.getItem("asientos"))

  asientosObject.push(asiento1)
  asientosObject.push(asiento2)

  var asientosUpdated = JSON.stringify(asientosObject)

  localStorage.setItem("asientos", asientosUpdated)
}

function addBanco(banco){
  var bancosObject = JSON.parse(localStorage.getItem("bancos"))

  bancosObject.push(banco)

  var bancosUpdated = JSON.stringify(bancosObject)

  localStorage.setItem("bancos", bancosUpdated)
}