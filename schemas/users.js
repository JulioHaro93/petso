const {check} = require('express-validator')

const schemaValidation =  (body)=>{
    check(body.email, "El correo no es válido").isEmail().not().isEmpty(),
    check(body.name, "El nombre no es válido").isString().not().isEmpty(),
    check(body.lastName, "Este campo es obligatorio").not().isEmpty()
    check(body.password, "El valor mínimo de la contraseña debe ser de 6 caracteres").isLength({min:6}),
    check(body.phoneNumber, "Este campo es requerido").not().isEmpty()
}

module.exports = {
    schemaValidation
}