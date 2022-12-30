const MensajesContenedor = require('../../contenedores/MensajesContenedor')

class MensajesDaoMongoDB extends MensajesContenedor {

    constructor(){
        super("mongodb+srv://root:root@cluster0.bs5di56.mongodb.net/test")
    }

}

module.exports = MensajesDaoMongoDB
