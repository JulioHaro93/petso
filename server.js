const cors = require('cors')
const express = require('express')
const {dbConnection} = require('./db/db')
const indexRoutes = require('./routes/routes')

class Server {
    constructor(){
        this.app = express()
        this.port = process.env.PORT
        //rutas de la aplicación
        this.routes()

        //Middlewares
        this.middlewares()

        this.conectarDB()
        
    }

    routes(){
        indexRoutes
        
    }
    async conectarDB(){
        await dbConnection()
    }

    middlewares(){
        //Directorio público
        this.app.use(express.static('public'))

    }

    listen(){
        

    this.app.listen(process.env.PORT, () =>{
        console.log("servidor corriendo en el puerto ", this.port)
    })
    }

}

module.exports ={
    Server
}