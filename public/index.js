const socket = io.connect()

function agregarProducto(e){
    limpiarMensajeError()
    const nombre = document.getElementById('nombre').value
    const precio = document.getElementById('precio').value
    if(nombre !== '' && precio > 0){
        if(!isNaN(precio)){
            const producto = {
                nombre: nombre,
                precio: precio,
                foto: document.getElementById('foto').value
            }
            socket.emit('nuevo-producto', producto)
        }else{
            generarMensajeError('El precio debe ser un valor numérico')
        }
    }else{
        generarMensajeError('El nombre del producto y el precio deben ser ingresados.')
    }

    return false
}

function enviarMensaje(e){

    const id_val = document.getElementById('id').value
    const nombre_val = document.getElementById('nombre').value
    const apellido_val = document.getElementById('apellido').value
    const edad_val = document.getElementById('edad').value
    const alias_val = document.getElementById('alias').value
    const avatar_val = document.getElementById('avatar').value
    const texto_val = document.getElementById('mensaje').value

    limpiarMensajeError()

    if(validarCorreo(id_val)){
        
        if(texto_val !== ''){

            const message = {
                author: {
                    id: id_val,
                    nombre: nombre_val,
                    apellido: apellido_val,
                    edad: edad_val,
                    alias: alias_val,
                    avatar: avatar_val
                },
                texto: texto_val
            }

            fetch(`http://localhost:8080/mensajes`, {
                credentials: 'same-origin', 
                headers: {
                'Content-Type': 'application/json'
                },
                method: 'POST', body: JSON.stringify(message)
            })
            .then(result =>  result.json())
            .then(fetchData => {socket.emit('mensajes')})

        }else{
            generarMensajeError('El campo mensaje no puede ser vacio')
        }
    }
    return false
}

function validarCorreo(correo){

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(correo))){
        generarMensajeError('El correo no es válido')
        return false
    }
    limpiarMensajeError()
    return true
}

function generarMensajeError(mensaje){
    const element = document.getElementById('alert-message')
    element.className = element.className.replace('invisible', '')
    element.innerHTML = mensaje
}

function generarMensajeInformativo(mensaje){
    const element = document.getElementById('success-message')
    element.className = element.className.replace('invisible', '')
    element.innerHTML = mensaje
}

function limpiarMensajeError(){
    const element = document.getElementById('alert-message')
    element.className = element.className.replace('invisible', '')
    element.className = element.className + ' invisible'
    element.innerHTML = ''
}

function login(e){

    const nombre_val = document.getElementById('nombre').value
    const password_val = document.getElementById('password').value
    if(nombre_val !== '' && password_val !== ''){
        fetch(`http://localhost:8080/login?user=${nombre_val}&password=${password_val}`)
        .then(data =>{
            if(data.status === 200){
                window.location = `http://localhost:8080/`
            }
        })
    }else{
        generarMensajeError('Usuario y contraseña son mandatorios')
    }

    return false;
}

function logout(){
    window.location = `http://localhost:8080/logout`
}

function listarProductos(type){
    switch(type){
        case 1:
            socket.emit('productos')
            break;
        case 2: 
            socket.emit('productos-test')
            break;
    }
}

socket.on('lista-mensajes', data => {

    // en vez de hacer un fetch por la coleccion, hacer un fecth por la pagina procesada de productos mediante el render del lado servidor.
    fetch('http://localhost:8080/mensajes')
    .then(result => result.json())
    .then(fetchData => {

        const authorSchema = new normalizr.schema.Entity('autor')
        const messageSchema = new normalizr.schema.Entity('mensajes', {
            author: authorSchema
        }, {idAttribute: '_id'})

        const denormalized = normalizr.denormalize(fetchData.mensajes.data.result, [messageSchema], fetchData.mensajes.data.entities)
        const template = Handlebars.compile(fetchData.template)
        const html = template({mensajes: denormalized, porcentaje: fetchData.mensajes.compresion})
        document.getElementById('mensajes-placeholder').innerHTML = html
    })
    .catch(err => {
        console.log(`Error lista-mensajes: ${err}`)
    })

})

socket.on('lista-productos', data => {

    // en vez de hacer un fetch por la coleccion, hacer un fecth por la pagina procesada de productos mediante el render del lado servidor.
    fetch('http://localhost:8080/productos')
    .then(result =>  result.json())
    .then(fetchData => {
        const template = Handlebars.compile(fetchData.template)
        const html = template({productos: fetchData.productos})
        document.getElementById('productos-placeholder').innerHTML = html
        document.getElementById('productos-test-placeholder').innerHTML = ''
    })
    .catch(err => {
        console.log(`Error lista-productos: ${err}`)
    })


})

socket.on('lista-productos-test', data => {

    // en vez de hacer un fetch por la coleccion, hacer un fecth por la pagina procesada de productos mediante el render del lado servidor.
    fetch('http://localhost:8080/productos-test')
    .then(result =>  result.json())
    .then(fetchData => {
        const template = Handlebars.compile(fetchData.template)
        const html = template({productos: fetchData.productos})
        document.getElementById('productos-test-placeholder').innerHTML = html
        document.getElementById('productos-placeholder').innerHTML = ''
    })
    .catch(err => {
        console.log(`Error lista-productos-test: ${err}`)
    })


})