const UserModel = require('../db/user')
const bcrypt = require('bcryptjs')
const ErrMsg = require('../lib/ErrMsg')
const aleatory = require('../middlewares/aleatoryString')
const errMsg = new ErrMsg()
const sendgrid = require('@sendgrid/mail')
const moment = require('moment')
const { error } = require('console')

const User = {

    get: async ()=>{
        const users = await UserModel.find().select('-stringConfirm -hashed_password -emailConfirmed -isActive -rol')

        if(users.length>0){
            return {
                success: true,
                users: users
            }
        }else{
            const error = errMsg.getByCode('1001', {entity: 'user'})
            return {
                success: false,
                error: error
            }
        }
        
    },
    getUsers: async (parameters)=>{
        const specialist = await UserModel.find({specialist: parameters})
        const names = await UserModel.find({name: parameters.name} || {lastname: parameters})

        if(specialist!==undefined){
            return {
                success: true,
                users: specialist
            }
        }else if(names !==undefined){
            return{
                success: true,
                users: names
            }
        }
    
    },
    create: async (body) =>{
        console.log(body)
        const user = await  UserModel.findOne({email:body.email})

        if(user !== null){
            const errorMessage = errMsg.getByCode('1005', {model:'users'})
            return{
                success: false,
                error:  errorMessage,
                email: body.email
            }
        }else{
            const cryptPass = bcrypt.genSaltSync()

            body.hashed_password = bcrypt.hashSync(body.password, cryptPass)
            body.password = ""

            body.registerDate = moment()

            const aleatoryStr = aleatory
            
            sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

            const msg = {
            to: body.email, // Change to your recipient
            from: 'juliodevelop@petxzoo.mx', // Change to your verified sender
            subject: 'Correo de verificación, por favor no responder este correo, pleace don not response this email',
            text: 'Por favor, por parte de nuestro portal, le pedimos que verifique su correo electrónico',
            html: '<pre><code><span>body</span><span>{</span><span>background-color</span><span>:</span><span>#0f1473</span><span>;</span><span>}</span></code></pre><p>Por favor, verifique su correo electr&oacute;nico, introduzca el siguiente texto en nuestro portal.</p>'+ aleatoryStr,
            }
            body.stringConfirm = "TEST1"

            const newUser = await UserModel.create(body).then(user=>{
                console.log("usuario creado")
                console.log(newUser)
            }).select('-stringConfirm -hashed_password -emailConfirmed -isActive -rol').catch(error =>{
                console.log(error)
            })
            try{
                sendgrid.send(msg)
            }catch(error){
                const errorMessage = ErrMsg.getByCode('0001', {entity:'Users'})

                console.log(errorMessage)
            }

            return{
                success: true,
                message: "bienvenido al portal",
                user : newUser
            }
        }
    },
    delete: async (id) =>{
        const userDeleted = await UserModel.findOneAndDelete(id).select('-stringConfirm -hashed_password -emailConfirmed -isActive -rol')

        if(userDeleted !== null && userDeleted !== undefined){
            return{
                success: true,
                message: "User Deleted",
                user: userDeleted
            }
        }else{
            const errorMessage = errMsg.getByCode('1001', {entity: 'Users'})
            return{
                success: true,
                message: "We couldn't delete the user because we couldn't find it",
                error: errorMessage
            }
        }
    
    },
    update: async (id, body)=>{
        
        const user = await UserModel.findByIdAndUpdate({_id:id}, body).select('-stringConfirm -hashed_password -emailConfirmed -isActive -rol')
        if(user){
            return{
                success: true,
                user: user
            }
        }else{
            const errorMessage = errMsg.getByCode('1004', {entity: 'Users'})
            return{
                success: false,
                error: errorMessage
            }
        }
    }
}

module.exports = User