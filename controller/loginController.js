const express = require('express')

class loginController{

    constructor(){
        
        this.loginRouter = express.Router()

        this.loginRouter.get('/login', (req, res) =>{
            const {user, password} = req.query
            req.session.user = user
            req.session.password = password
            res.send('OK')
        })

        this.loginRouter.get('/logout', (req, res)=>{
            let userName = req.session.user
            req.session.destroy(err => {
                if(!err) res.render('logout', {user: userName})
                else res.send(`Error al intentar desloguearse: ${err}`)
            })
        })
        
    }

    getRouter(){
        return this.loginRouter
    }

}

module.exports = loginController