const UserModel = require('../db/user')
const bcrypts = require('bcryptjs')
const {genJWT} = require('../middlewares/isAuth')

const login = async (body) =>{
    try{
        //verificar si el emil existe

        const user = await UserModel.findOne({email:body.email})
        if(user === null){
            return{
                success: false,
                status: 400,
                message: "El usuario o la contraseña no son correctas, verifique los datos"
            }
        }
        // Verificaar la contraseña
        const validPass = bcrypts.compareSync(body.password, user.hashed_password)
        if(!validPass){
            return{
                success: false,
                status: 400,
                message: 'Contraseña Incorrecta'
            }
        }

        // Generar el JWT
        const token = await genJWT(user)

        return{
            success: true,
            user: user.name + user.lastName,
            token
        }
    }catch(error){
        return{
            success: false,
            message: "algo salió mal"
        }
    }
}

module.exports = login