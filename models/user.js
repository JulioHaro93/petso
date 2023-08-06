const UserModel = require('../db/user')
const bcrypt = require('bcryptjs')
const ErrMsg = require('../lib/ErrMsg')
const aleatory = require('../middlewares/aleatoryString')
const errMsg = new ErrMsg()
const sendgrid = require('@sendgrid/mail')
const moment = require('moment')

const User = {

    get: async ()=>{
        const users = await UserModel.find()

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

        if(specialist){
            return {
                success: true,
                users: specialist
            }
        }else if(names){
            return{
                success: true,
                users: names
            }
        }
    
    },
    create: async (body) =>{

        const user = await  UserModel.find({email:email}).populate('imgProfile')
        if(user !== null){
            const errorMessage = errMsg.getByCode('1003', {entity: 'Users'})
            return{
                success: false,
                error:  errorMessage
            }
        }else{

            const cryptPass = bcrypt.genSalt(20)
            
            body.hashed_password = bcrypt.hashSync(body.password, cryptPass)
            delete body.password
            body.registerDate = moment()
            const aleatoryStr = aleatory.aleatoryString()

            sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

            const msg = {
            to: body.email, // Change to your recipient
            from: 'juliodevelop@petxzoo.mx', // Change to your verified sender
            subject: 'Correo de verificación, por favor no responder este correo, pleace don not response this email',
            text: 'Por favor, por parte de nuestro portal, le pedimos que verifique su correo electrónico',
            html: '<pre><code><span>body</span><span>{</span><span>background-color</span><span>:</span><span>#0f1473</span><span>;</span><span>}</span></code></pre><p>Por favor, verifique su correo electr&oacute;nico, introduzca el siguiente texto en nuestro portal.</p>'+ aleatoryStr,
            }
            body.stringConfirm = aleatoryStr

            const newUser = await UserModel.save(body)
            try{
                sendgrid.send(msg)
            }catch(error){
                const errorMessage = ErrMsg.getByCode('0001', {entity:'Users'})

                console.log(errorMessage)
            }

            return{
                success: true,
                message: "bienvenido al portal",
                user : user.toSimple()
            }
        }
    },
    delete: async (id) =>{
        const userDeleted = await UserModel.findOneAndDelete(id)

        if(userDeleted){
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
    
    }
}

module.exports = User