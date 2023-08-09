require('dotenv').config()
const jwt = require('jsonwebtoken')


const genJWT = (user)=>{
    return new Promise((resolve, reject) =>{
        const data = {
            name: user.nane,
            idUser: user._id
        }

        const payload = data

        jwt.sign(payload, process.env.secretJKey, {expiresIn:'6h'})
    }), (err, token)=>{
        if(err){
            console.log(err)
            reject('No se pudo generar el token')
        }else{
            resolve(token)
        }
    }


}

module.exports = genJWT