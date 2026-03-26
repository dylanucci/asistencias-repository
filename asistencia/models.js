class Alumno{

    constructor(nombre, genero, curso_id, asiento_id){
        this.alumno_id = `"${nombre}-${curso_id}"`
        this.nombre = nombre
        this.genero = genero
        this.curso_id = curso_id
        this.asiento_id = asiento_id
    }
}

class Curso{
    constructor(año, division){
        this.id = `"${año}°${division}"`
        this.año = año
        this.division = division
    }
}
class Diseño{
    diseño_element;
    constructor(curso_id, filas, columnas){
        this.curso_id = curso_id
        this.filas = filas
        this.columnas = columnas
        this.asientos_count = (filas * 2) * columnas
    }
}

class Asiento{ 
    constructor(posx, posy, numero, banco_id, diseño_id){
        this.banco_id = banco_id
        this.asiento_id = `"${this.banco_id}-${this.numero}"`
        this.numero = numero
        this.diseño_id = diseño_id
    }
}

class Banco{
    constructor(pos_x, pos_y){
        this.pos_x = pos_x
        this.pos_y = pos_y
        this.banco_id = `${pos_x};${pos_y}`
    }
}