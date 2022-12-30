const model = require('../model/mensaje')
const mongoose = require('mongoose')
const normalizr = require('normalizr')
const schema = normalizr.schema

class MensajesContenedor {

    constructor(connectionURI){
        mongoose.set('strictQuery', false)
        mongoose.connect(connectionURI, {useNewUrlParser: true, useUnifiedTopology: true}, err => {
            if (err)
                throw new Error('Error en la conexión de la base de datos')
        })
    }

    async getAll(){
        let mensajes = await model.find({})

        const authorSchema = new schema.Entity('autor')
        const messageSchema = new schema.Entity('mensajes', {
            author: authorSchema
        }, {idAttribute: '_id'})

        mensajes = JSON.parse(JSON.stringify(mensajes))
        const normalizedData = normalizr.normalize(mensajes, [messageSchema])
        const porcentajeCompresion = ((JSON.stringify(normalizedData).length * 100) / JSON.stringify(mensajes).length)
        return {data: normalizedData, compresion: porcentajeCompresion < 100 ? porcentajeCompresion : -(porcentajeCompresion - 100) }
    }

    async add(mensaje){
        const mensajesModel = new model(mensaje)
        let mensajeSave = await mensajesModel.save()
        console.log(mensajeSave)
    }

}

module.exports = MensajesContenedor