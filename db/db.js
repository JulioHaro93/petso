const mongoose = require('mongoose')
require('dotenv').config()
const colors = require('colors')

const dbConnection = async () =>{

    try{
        await mongoose.createConnection(process.env.MONGO_CNN,{
            useNewUrlParser: true,
            useUnifiedTopology:true,

        })
        console.log('Conectado a la base de datos'.brightBlue)

    }catch (error){
        console.log(error)
        throw new Error('No fue posible conectarse a la base de datos')
    }
}

module.exports ={
    dbConnection
}