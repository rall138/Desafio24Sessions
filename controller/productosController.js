const express = require('express')
const faker = require('faker')
const fs = require('fs')
const productosDAO = require('../daos/ProductosDaos/ProductosDaoMongoDB')
const auth = require('./SessionHelper')

class productosController{

    constructor(tableName){

        this.tableName = tableName
        this.productosRouter = express.Router()
        this.productos = []
        this.productosDao = new productosDAO()
        faker.setLocale('es')
        
        this.productosRouter.get('/', auth, (req, res) =>{
            res.render('producto', {user:req.session.user})
        })

        this.productosRouter.get('/productos-test', (req, res) => {
            const products = []
            const templateFile = fs.readFileSync(__dirname+'/../public/productos.hbs', 'utf8')
            for(let i = 0; i < 5; i++){
                products.push({nombre: faker.commerce.product(), precio: faker.commerce.price(),
                    stock: faker.commerce.price(10, 100), foto: faker.image.image()})
            }
            res.send({template: templateFile, productos: products})
        })

        this.productosRouter.get('/productos', (req, res) =>{
            const templateFile = fs.readFileSync(__dirname+'/../public/productos.hbs', 'utf8')
            this.productosDao.getAll()
            .then(result => { res.send({template: templateFile, productos: result})})
            .catch(error => console.log(error))
        })

        this.productosRouter.post('/productos', (req, res) =>{
            this.productosDao.add(req.body)
            .then(result => { console.log(result)})
            .catch(msg => res.render('errorPage', {error: msg}))
        })
    }

    getRouter(){
        return this.productosRouter
    }


}

module.exports = productosController