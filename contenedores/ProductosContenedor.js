const model = require('../model/producto')
const mongoose = require('mongoose')

class ProductosContenedor {

    constructor(connectionURI){
        mongoose.set('strictQuery', false)
        mongoose.connect(connectionURI, {useNewUrlParser: true, useUnifiedTopology: true}, err => {
            if (err)
                throw new Error('Error en la conexión de la base de datos')
        })

    }

    async getAll(){
        let productos = await model.find({})
        return productos
    }

    async add(producto){
        const productoModel = new model(producto)
        let productoSave = await productoModel.save()
        console.log(productoSave)
    }

}

module.exports = ProductosContenedor