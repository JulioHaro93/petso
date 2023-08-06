const db = require('./db')
const Schema = db.Schema

const petsSchema = new Schema({
    name: {type: String},
    typeOfAnimaal: {type: String, required: true},
    cientificName:{type: String, required: false},
    isMedicalImportant: {type: Boolean, required: true},
    imgFile:[{
        type: Schema.Types.ObjectId,
        ref: 'Images'
      }]
})


const pets = db.mongoose.model('Pets', petsSchema, 'Pets')

module.exports = pets