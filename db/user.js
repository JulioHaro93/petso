const db = require('./db')
const image = require('./images')
const Schema = db.mongoose.Schema


const UsersSchema = new Schema({
  name: { type: String, required: true }, //Se queda
  lastName: { type: String, required: true }, //Se queda
  birthday: { type: Date}, //Se queda
  email: { type: String, required: true, unique: true }, //Se queda
  phoneNumber: { type: String, required: true}, // Se queda
  registerDate: { type: Date, default: new Date()},
  hashed_password: { type: String }, //Se queda
  isActive: { type: Boolean, default: false }, // Se queda
  school:{type: String, required: false}, //Se queda
  isSpecialist: {type: Boolean, default: false},
  specialities: [{type: String}],
  location: {type: String, required: false},
  imgFile:[{
    type: Schema.Types.ObjectId,
    ref: 'Images'
  }],
  imgProfile: {
    type: Schema.Types.ObjectId,
    ref: 'Images'
  },
  rol: {type: String},
  pets: [{type: String}],
  emailConfirmed: {type: Boolean, default: false},
  stringConfirm: {type: String}
}, { versionKey: false })


UsersSchema.methods.toSimple = function () {
  return {
    _id: this._id,
    name: this.name,
    lastName: this.lastName,
    email: this.email,
    imgFile: this.imgFile
  }
}

/*
StudentSchema.pre('save', async function (next) {
  let data = this
 
  if (data.imgFile) {
    
    let imagenes = data.imgFile

    idImage = data.imgFile._id
    const ccImage = await Images.findOne({_id: idImage})
    
      if (ccImage && data.imgFile.isTempImage) {

        const url = await S3.moveImageTemporal(ccImage.key, 6)
        
        if(url != ""){
          ccImage.url = url
          ccImage.isTempImage = false
          ccImage.type = 6
          ccImage.save()
      }else if(ccImage === null){
        const imageNew = await Images.create(imagenes).then(image =>{
          return {
            success: true,
            image: imageNew
          }
        }
        ).catch(error =>{
          return {
            success: false,
            error: error
          }
        })
      }else{
        
        return err
      }
    }
  }
  
  next()
});
*/

const Users = db.mongoose.model('Users', UsersSchema, 'Users')

module.exports = Users