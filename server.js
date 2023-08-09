const cors  = require('cors')
const express = require('express')
const router = express.Router()
const {dbConnection} =  require('./db/db')
const rutas = require('./routes/index')
const cookieParser = require('cookie-parser')
const { request } = require('http')
const body_parser = require('body-parser');

class Server {
    constructor(){
        this.app = express()
        this.authPath = '/api/auth'
        //this.router = router
        this.port = process.env.PORT
        //Middlewares
        this.middlewares()
        //rutas de la aplicación
        this.routes()
        this.conectarDB()
        
        
       
    }

    routes(){

        const users = rutas.users
        this.app.get('/', (req, res) =>{
            res.json({msg: "hola mundo"})
        })
        this.app.use(this.authPath, require('./routes/routes/auth.js').router)
        this.app.use(users.path, require('./routes/routes/user.js').router)
        

        
    }
    async conectarDB(){
        await dbConnection()
    }

    middlewares(){
        //Directorio público
        this.app.use(express.static('public'))
        this.app.use(cookieParser())
        this.app.use(body_parser.urlencoded({extended:true}))
        this.app.use(body_parser.json())

    }

    listen(){
        

    this.app.listen(process.env.PORT, () =>{
        console.log("servidor corriendo en el puerto ", this.port)
    })
    }

}

module.exports = Server