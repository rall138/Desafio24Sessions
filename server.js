const express = require('express')
const socketIo = require('socket.io')
const http = require('http')
const handlebars = require('express-handlebars')
const session = require('express-session')
const mongoStore = require('connect-mongo')

const productosController = require('./controller/productosController.js')
const mensajesController = require('./controller/mensajesController.js')
const loginController = require('./controller/loginController.js')

const app = express()
const PORT = 8080
const httpServer = http.createServer(app)
const io = socketIo(httpServer)

//Configuración de handlebars
app.engine('hbs', 
    handlebars.engine({
        extname: '.hbs', // extensión de los archivos template.
        defaultLayout: 'index.hbs', // plantilla principal.
        layoutsDir: __dirname + '/views/layouts', // ruta a la plantilla principal.
        partialsDir: __dirname + '/views/partials' // ruta a las plantillas parciales.
    })
)

app.use(express.static('./public'))
app.set('views', './views') // Le dice donde estarán alojadas las plantillas.
app.set('view engine', 'hbs') // Le dice cual es el motor de procesamiento de esas plantillas.

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}
app.use(session({
    
    store: mongoStore.create({
        mongoUrl:'mongodb+srv://root:root@cluster0.bs5di56.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: advancedOptions, 
        ttl: 300
    }),

    secret: 'palabraOculta',
    saveUninitialized: true,
    resave:true 
}))

const prdController = new productosController('productos')
const msjController = new mensajesController('mensajes')
const lgController = new loginController()

app.use(msjController.getRouter())
app.use(lgController.getRouter())
app.use('/', prdController.getRouter())

httpServer.listen(PORT, ()=>{
    console.log(`Servidor escuchando en el puerto ${PORT}`)
}).on('error', (error) => console.log(error))

io.on('connection', socket => {
    console.log('Nuevo cliente conectado')
    
    //socket.emit('lista-productos', prdController.productos)
    socket.emit('lista-mensajes', msjController.mensajes)

    socket.on('nuevo-producto', data => {
        try{
            prdController.addProduct(data)
            socket.emit('lista-productos', prdController.productos)
        }catch(error){
            console.log(error)
        }
    })

    socket.on('nuevo-mensaje', data => {
        try{
            msjController.addmensaje(data)
            socket.emit('lista-mensajes')
        }catch(error){
            console.log(error)
        }
    })

    socket.on('mensajes', data => {
        socket.emit('lista-mensajes')
    })

    socket.on('productos-test', data => {
        socket.emit('lista-productos-test')
    })

    socket.on('productos', data => {
        socket.emit('lista-productos')
    })

})