const express = require('express')
const MensajesDAO = require('../daos/ProductosDaos/MensajesDaoMongoDB')
const fs = require('fs')
class mensajesController{

    constructor(tableName){

        this.tableName = tableName
        this.mensajesRouter = express.Router()
        this.mensajesDao = new MensajesDAO()

        this.mensajesRouter.get('/mensajes', (req, res) =>{
            const templateFile = fs.readFileSync(__dirname+'/../public/centroMensajes.hbs', 'utf8')
            this.mensajesDao.getAll()
            .then(result => { res.send({template: templateFile, mensajes: result})})
            .catch(msg => res.json({error: msg}))
        })

        this.mensajesRouter.post('/mensajes', (req, res) =>{
            this.mensajesDao.add(req.body)
            .then(() => res.json({mensaje: 'insercion generada'}))
            .catch(msg => res.json({error: msg}))
        })
    }

    getRouter(){
        return this.mensajesRouter
    }

}

module.exports = mensajesController