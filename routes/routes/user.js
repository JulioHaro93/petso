const usersModels = require('../../models/user')
const express = require('express')
const router = express.Router()
const {schemaValidation} = require('../../schemas/users')

const path = 'api/Users'

router.get(`${path}/`, (req, res) =>{

    const result = usersModels.get()
    
    if(result.success === true){
        res.json={
            success: true,
            users: result.users
        }
        
    }else{
        res.json={
            success:false,
            error: result.error
        }
    }
})
router.get(`${path}/findUsers/:parameters`, (req, res)=>{
    const parameters = req.params.parameters
    
    const result = usersModels.getUsers()
    if(result.success){
        res.json={
            success: true,
            users: users
        }
        req.body ={
            success: true,
            users: users
        }
    }else{
        res.json = result  
    }
})

router.post(`${path}/sigInUser`, (req, res)=>{
    const body = req.body
    const validation = schemaValidation(body)

    if(!validation){
        const result = usersModels.create(body)

        if(result.success){
            res.json= result
        }else{
            res.json = result
        }
    }
    
})
module.exports = router