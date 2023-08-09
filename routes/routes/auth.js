const { Router } = require('express');
const router = Router()
const {schemaValidation} = require('../../schemas/login.js')
const body_parser = require('body-parser')
const bodyP = body_parser.urlencoded({extended:true})
const loginModel = require('../../models/login.js')
const {check} = require('express-validator')
router.use(bodyP)
router.post('/login', async (req, res)=>{
    const body = req.body
    check('email', 'El correo es obligatorio o está mal escrito').isEmail()
    check('password', 'La contraseña es obligatoria y deben ser al menos 6 caracteres').not().isEmpty()
    const validation = schemaValidation(body)
    if(!validation){
        res.json({
            message: 'Login ok'
        })
    }
    
})

module.exports = {
    router
}