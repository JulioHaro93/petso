const {check} = require('express-validator')

const schemaValidation =  (body)=>{
    check(body.email, "El correo no es válido").isEmail().not().isEmpty(),
    check(body.name, "El nombre no es válido").isString().not().isEmpty(),
    check(body.lastName, "Este campo es obligatorio").not().isEmpty()
    check(body.password, "El valor mínimo de la contraseña debe ser de 6 caracteres").isLength({min:6}).not()-isEmpty(),
    check(body.phoneNumber, "Este campo es requerido").not().isEmpty()
}

const UpdateValidation = (id, body)=>{
    check(id, "El id no es correcto").isMongoId()
    if(body.name){
        check(body.name, "El nombre no es válido").isString().not().isEmpty()
    }
    if(body.lastName){
        check(body.lastNane, "El nombre no es válido").isString().not().isEmpty()
    }
    if(body.phoneNumber){
        check(body.phoneNumber, "Este campo es requerido").not().isEmpty()
    }if(body.presentation){
        check(body.presentation, "La presentación debe ser una secuencia de caracteres, máximos 400 caracteres").isString().not().isEmpty().isLength({max: 400})
    }
}

const DeleteUser =(id) =>{
    check(id, 'no es un id válido').isMongoId()
}
module.exports = {
    schemaValidation,
    UpdateValidation,
    DeleteUser
}