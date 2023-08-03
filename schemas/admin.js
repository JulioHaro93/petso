const {check} = require('express-validator')

const adminValidation = check.object().keys({
    name: check.string().not().empty(),
    email: check.isEmail(),
    telephone: check.string(),
    hashed_password: check.string().not().empty(),
    address: check.string(),
    isSpecialist: check.boolean(),
    hasTempPass: check.boolean()
})

module.exports ={
    adminValidation
}