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
    flexWrap: "wrap",
    margin: "auto",
    justifyContent: "space-between"
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
 

    var marginSize = (tamañoDiv / rows) * 0.25
    
    var marginCount = rows-1

    var flexContainerSize = tamañoDiv - (marginCount * marginSize)

    var flexWidth = flexContainerSize / rows

    console.log("tamaño por banco: "+flexWidth)

    var flexItemContainerStyle = styles.flexItemContainer
    flexItemContainerStyle.width = `${flexWidth}px`
    flexItemContainerStyle.marginBottom = `${marginSize * 0.60}px`

    var bancoRepresentationStyle = styles.banco
    var bancoRepresentationStyleHeight = flexWidth * 0.30
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
    
    for (var i = 0; i<rows; i++){
        for(var j = 0; j<columns; j++){

            var pos_x = i
            var pos_y = j;
            
            var banco = new Banco(pos_x, pos_y)

            var asiento1 = new Asiento(1, banco.banco_id, 1)
            var asiento2 = new Asiento(2, banco.banco_id, 1)

            var flexItemContainer = document.createElement("div")
            var asientosContainer = document.createElement("div")
            var bancoRepresentation = document.createElement("img")
            var asientoItem1 = document.createElement("div")
            var asientoItem2 = document.createElement("div")

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

            design.append(flexItemContainer)

        }
    }

    var designObject = new Diseño("6*7", rows, columns, design.outerHTML)

    var designString = JSON.stringify(designObject)

    localStorage.setItem("designValue", designString)

    document.body.append(design)

}