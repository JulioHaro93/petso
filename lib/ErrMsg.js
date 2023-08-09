/**
 * lib/errMsg.js
 *
 * @description :: Sends errMsg
 * @docs        :: TODO
 */
const _ = require('underscore')
const errMsgJson = require('./errors.json')


class ErrMsg {
  constructor () {
    this.errJson = errMsgJson
  }


  generalGet (modelName) {
    const err = this.errJson['getError']
    const errMsg = _.template(err.error)
    const errMsgEs = _.template(err.message.es)
    const errMsgEn = _.template(err.message.en)

    return {
      code: err.code,
      model: err.model,
      httpCode: err.httpCode,
      error: errMsg({ model: modelName }),
      message: {
          en: errMsgEn({ model: modelName }),
          es: errMsgEs({ model: modelName }),
  }

    }
  }



  /**
   * getErrors
   * @returns {array} List of errors used.
   */
  getErrors () {
    const errors = []
    Object.keys(this.errJson).forEach(key => {
      errors.push(this.errJson[key])
    })
    return errors
  }

  /**
   * getByCode
   * @description Return the error by code
   * @param {integer} code Error code
   * @returns {object|boolean} Returns false if not found
   */
  getByCode(code, data) {
    let err = {
      sucess: false,
      message: "None error code on catalogue"
    }
    for (const [key, value] of Object.entries(this.errJson)) {
      const element = this.errJson[key]
 
      if (String(element.code) === String(code)) {

        const err = element
        const errModel = _.template(err.model)
        const errMsgEs = _.template(err.message.es)
        const errMsgEn = _.template(err.message.en)

        //console.log(err)
        err.model = errModel({
          model: data.model
        })
      
        if (data.entity) {
          err.message.es = errMsgEs({
            entity: data.entity,
            id: data.id
          })
          err.message.en = errMsgEn({
            entity: data.entity,
            id: data.id
          })
        } 
  
        //console.log(err)
        return err
        
      }


    }

return err
  }






  /**
   * getNotEntityFound
   * @param {string} entityName Model / Entity name
   * @param {string} id Id not found
   */
  getNotEntityFound (entityName, id) {
    const err = this.errJson['notEntityFound']
    const errMsg = _.template(err.error)
    const errMsgEs = _.template(err.message.es)
    const errMsgEn = _.template(err.message.en)

    return {
      code: err.code,
      error: errMsg({ entity: entityName, id }),
      errorEs: errMsgEs({ entity: entityName, id }),
      errorEn: errMsgEn({ entity: entityName, id }),
      err
    }
  }

  /**
   * getStudentWithoutAttendance
   * @param {string} studentId Student object id
   * @returns {object} - error description
   */
  getStudentWithoutAttendance (studentId) {
    const err = this.errJson['studentWithOutAttendance']
    const errMsg = _.template(err.error)
    const errMsgEs = _.template(err.message.es)
    const errMsgEn = _.template(err.message.en)

    return {
      code: err.code,
      error: errMsg({ studentId }),
      errorEs: errMsgEs({ studentId }),
      errorEn: errMsgEn({ studentId }),
      err
    }
  }

  /**
   * getStudentAlreadyEnrolled
   * @param {string} id Group id
   * @returns {object} - error description
   */
  getStudentAlreadyEnrolled (entity, id) {
    const err = this.errJson['studentAlreadyEnrolled']

    const errMsg = _.template(err.error)
    const errMsgEs = _.template(err.message.es)
    const errMsgEn = _.template(err.message.en)

    return {
      code: err.code,
      error: errMsg({ entity, id }),
      errorEs: errMsgEs({ entity, id }),
      errorEn: errMsgEn({ entity, id }),
      err
    }
  }

  getTemplateMissingParams () {
    return this.errJson['templateMissingParams']
  }

  getQuotaExceded () {
    return this.errJson['quotaExceded']
  }

  getStWrongStudent () {
    return this.errJson['notStSessionError']
  }

  getNoDaysInRange () {
    return this.errJson['noDaysInRange']
  }

  getByIndex (index) {
    return this.errJson[index]
  }

  toJson () {
    return this.errJson
  }
}

module.exports = ErrMsg
