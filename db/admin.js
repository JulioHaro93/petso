/**
 * db/employee.js
 *
 * @description ::
 * @docs        :: None
 */
const db = require('./db')
const Schema = db.Schema

const { adminSchema } = require('../schemas/admin');

const adminSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  email: {
    type: String, unique: true, required: true
  },
  telephone: {
    type: String
  },
  hashed_password: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  isSpecialist: {
    type: Boolean
  },
  hasTempPass: {
    type: Boolean
  },
  /*roleId:{
    type: Schema.Types.ObjectId, 
    ref: 'rolesCASL'},
  rolePermission: {
    type: Array
  },*/
  /*
  imgFile:{
    type: Schema.Types.ObjectId,
    ref: 'Images'
  }*/
}, {
  versionKey: false
})



EmployeeSchema.methods.toSimple = function () {
  return {
    _id: this._id,
    name: this.name,
    lastName: this.lastName,
    email: this.email,
    telephone: this.telephone,
    address: this.address,
    isDoctor: this.isDoctor,
    regId: this.regId,
    idSpeciality: this.idSpeciality,
    hasTempPass: this.hasTempPass,
    imgFile: this.imgFile
  }
}


EmployeeSchema.pre('save', async function (next) {
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
          ccImage.type = 7
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


const Employee = db.model('Employee', EmployeeSchema, 'Employee')
module.exports = Employee