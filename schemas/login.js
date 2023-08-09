const {check} = require('express-validator')

const schemaValidation =  (body)=>{
    check(body.email, "El correo no es válido").isEmail().not().isEmpty(),
    check(body.password, "El valor mínimo de la contraseña debe ser de 6 caracteres y es un campo que no puede ir vacío").isLength({min:6})
}

module.exports = schemaValidation