const mongoose = require('mongoose')

const mensajesCollection = 'mensajes'

const mensajeSchema = new mongoose.Schema({
    author:{
        id: {type: String, require: true, max: 255},
        nombre: {type: String, require: true, max: 255},
        apellido: {type: String, require: true, max: 255},
        edad: {type: String, require: false},
        alias: {type: String, require: true, max: 255},
        avatar: {type: String, require: false, max: 255},
    }, 
    texto: {type: String, require: true, max: 255}
})

module.exports = mongoose.model(mensajesCollection, mensajeSchema)