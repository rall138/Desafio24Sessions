const mongoose = require('mongoose')

const productosCollection = 'productos'

const productoSchema = new mongoose.Schema({
    nombre: {type: String, require: true, max: 255},
    precio: {type: Number, require: true},
    stock: {type: Number, require: true},
    foto: {type: String, require: false, max: 255}
})

module.exports = mongoose.model(productosCollection, productoSchema)