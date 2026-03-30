export class Alumno{
    constructor(nombre, genero, curso_id, asiento_id, apellido){
        this.nombre = nombre
        this.apellido = apellido
        this.genero = genero
        this.alumno_id = `${this.nombre}-${this.curso_id}`
        this.curso_id = curso_id
        this.asiento_id = asiento_id
    }

}

export class Curso{
    constructor(año, division){
        this.id = `${año}°${division}`
        this.año = año
        this.division = division
    }
}
export class Diseño{
    diseño_element;
    constructor(curso_id, filas, columnas, diseño_element){
        this.curso_id = curso_id
        this.filas = filas
        this.columnas = columnas
        this.asientos_count = (filas * 2) * columnas
        this.diseño_element = diseño_element
    }
}

export class Asiento{ 
    asiento_id;
    banco_id;
    constructor(numero, banco_id, diseño_id){
        this.banco_id = banco_id
        this.numero = numero
        this.asiento_id = `${this.banco_id}-${this.numero}`
        this.diseño_id = diseño_id
    }s
}

export class Banco{
    banco_id;
    constructor(pos_x, pos_y){
        this.pos_x = pos_x
        this.pos_y = pos_y
        this.banco_id = `${pos_x};${pos_y}`
    }
}