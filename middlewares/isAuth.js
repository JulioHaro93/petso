require('dotenv').config()
const jwt = require('jsonwebtoken')


const genJWT = (user)=>{
    return new Promise((resolve, reject) =>{
        const data = {
            name: user.nane,
            idUser: user._id,
            roles: user.rol
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

const validarJWT = (token, resolve)=>{
    if(token === undefined){
        return{
            success: false,
            message: "No Auth Token"
        }
    }
    

    try{
        const tokenTaste = jwt.verify(token, process.env.secretJKey)
        return{
            success: true,
            tokenTaste
        }

    }catch(error){
        console.log(error)
        return{
            success: false
        }
    }
}

module.exports = {genJWT, validarJWT}