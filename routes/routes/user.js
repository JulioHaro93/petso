const usersModels = require('../../models/user')
const express = require('express')
const { Router } = require('express');
const router = Router()
const {schemaValidation, UpdateValidation} = require('../../schemas/users')
const body_parser = require('body-parser')
const path = '/api/Users'
const bodyP = body_parser.urlencoded({extended:true})

router.use(bodyP)

router.get('/',async (req, res) =>{
    //console.log(req)
    const result = await usersModels.get()
    console.log(result)
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

router.get(`${path}/findUsers/:parameters`, async (req, res)=>{
    const parameters = req.params.parameters
    
    const result = await usersModels.getUsers()
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

router.post(`/sigInUser`, async(req, res)=>{

    const body = req.body

    const validation = schemaValidation(body)

    if(!validation){
        const result = await usersModels.create(body)
        console.log(result)
        if(result.success===true){
            res.json(
                result
                )
        }else{
            res.json(
                result
            )
        }
    }else{
        res.json = {
            success: false,
            error: "Error en los datos ingresados"
        }
    }
    
})

router.put(`${path}/modifyUser/:id`, async (req, send)=>{
    const body = req.body
    const id = req.params.id

    
    const validation = UpdateValidation(id, body)

    if(!validation){
        const result = await usersModels.update(id, body)

        if(result.success){
            res.json  ={
                result
            }
        }else{
            res.json ={
                success: false,
                error: result.error
            }
        }
    }
})


module.exports = {
    router,
    path}