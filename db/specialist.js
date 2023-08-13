const db = require('./db')
const Schema = db.mongoose.Schema

const SpecialistSchema = new Schema({

    spName: {type: String},
    description:{type: String},
    tickets: [{type: String}]

},{ versionKey: false })

const Specialist = db.mongoose.model('Specialist', SpecialistSchema, 'Specialist')

module.exports = Specialist