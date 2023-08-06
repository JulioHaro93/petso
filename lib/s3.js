/**
 * lib/s3.js
 *
 * @description :: Loads config values
 * @docs        :: TODO
 */
const AWS = require('aws-sdk')
const {
  keyBy
} = require('lodash')
const uniqid = require('uniqid')
const ImageModel = require('../db/images')
const mongoose = require('mongoose')
const db = require('../db/images')
const Schema = db.Schema
const FileType = require('file-type');
/*
const {
  awsAccessKeyId,
  awsSecretAccessKey,
  awsBucketName,
  awsBucketImagesName,
  awsBucketProcessedName,
  awsBucketRegion,
  awsCloudfromEndpointImage
} = require('../config');
const {
  is
} = require('bluebird');
AWS.config.setPromisesDependency(require('bluebird'))

AWS.config.update({
  region: awsBucketRegion,
  accessKeyId: awsAccessKeyId,
  secretAccessKey: awsSecretAccessKey
})

const S3 = {
  uploadVideo: async (data, stream, ext = null) => {
    let key = data.title + '-' + uniqid()
    if (ext) {
      key += '.' + ext
    }

    const params = {
      Bucket: awsBucketName,
      Key: key,
      Body: stream
    }
    const s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params
    })

    const uploadPromise = s3.upload().promise()
    const result = await uploadPromise
      .then(result => {
        return {
          success: true,
          response: result
        }
      })
      .catch(err => {
        console.error('- Error trying to upload a video. (s3)', JSON.stringify(err, null, 2))
        return {
          success: false,
          code: 500,
          error: JSON.stringify(err, null, 2)
        }
      })

    return result
  },
  deleteVideo: async (key) => {
    const params = {
      Bucket: awsBucketName,
      Key: key,
    }
    const s3 = new AWS.S3()
    const deletePromise = await s3.deleteObject(params, function (err, data) {
      if (err) {
        console.error('- Error trying to delete a video. (s3)', JSON.stringify(err, null, 2))
        return {
          success: false,
          code: 500,
          error: JSON.stringify(err, null, 2)
        }
      } else {
   
        return {
          success: true,
          response: data
        }
      }
    });
    return deletePromise
  },

  deleteVideoProcessed: async (id) => {
    const params = {
      Bucket: awsBucketProcessedName,
      Key: id,
    }
    const s3 = new AWS.S3()
    const findPromise = await s3.getObjectAttributes(id)
    //console.log("Te encontre: \n"+findPromise)
    const deletePromise = await s3.deleteObject(id, function (err, data) {
      if (err) {
        console.error('- Error trying to delete a video. (s3)', JSON.stringify(err, null, 2))
        return {
          success: false,
          code: 500,
          error: JSON.stringify(err, null, 2)
        }
      } else {
        //console.log(data)
        return {
          success: true,
          response: data
        }
      }
    });
    return deletePromise
  },

  genereteS3SignedUrl: async (fileName, type) => {
    let fileExtention = fileName.split('.').pop();
    let key = uniqid() + "." + fileExtention
    const params = {
      Key: key,
      Expires: 3600,
      ACL: 'bucket-owner-full-control'
    };
    if (type == 1) {
      params.Bucket = awsBucketName
    } else {
      params.Bucket = `${awsBucketImagesName}/tmp`
    }
    const s3 = new AWS.S3({
      signatureVersion: 'v4',
    })
    let url = s3.getSignedUrl('putObject', params)
    if (!url) {
      return {
        success: false,
        message: "ocurrio un error al generar una url pre firmada para s3"
      }
    }
    return {
      success: true,
      url: url,
      keyFile: key
    }
  },


  //TYPE 1 QUIZ QUESTION
  //TYPE 2 QUIZ ANSWER 
  //TYPE 3 CLINICAL CASE
  //TYPE 4 COURSE IMAGE

  moveImageTemporal: async (key, type) => {

    const s3 = new AWS.S3()
    var paramsN = {
      Bucket: `${awsBucketImagesName}/tmp`,
      Key: key
    };
    const data = await s3.getObject(paramsN).promise();
    let nameExt = await FileType.fromBuffer(data.Body)
    
    let extension = key.substring(key.length - 3, key.length)

    url = ""
    if (nameExt.ext == extension) {

      let origin = `${awsBucketImagesName}/tmp/${key}`
      let destination


      if (type == 1) {
        destination = `quizQuestion/${key}`
      } else if (type == 2) {
        destination = `quizAnswer/${key}`
      } else if (type == 3) {
        destination = `clinicalCase/${key}`
      } else if (type == 4) {
        destination = `specialities/${key}`
      }else if(type == 6){
        destination =`photos/students/${key}`
      }else if(type== 7){
        destination = `photos/employees/${key}`
      }
      const params = {
        Bucket: awsBucketImagesName,
        CopySource: origin,
        Key: destination
      };


      await s3.copyObject(params, function (copyErr, copyData) {
        if (copyErr) {
          console.log("E R R O R . . . . ")
        } else {
          console.log('Copied: ', copyData);
        }
      }).promise();


      const params2 = {
        Bucket: `${awsBucketImagesName}`,
        Key: `tmp/${key}`,
      }

      await s3.deleteObject(params2, function (err, data) {
        if (err) {
          console.error('- Error trying to delete a Image. (s3)', JSON.stringify(err, null, 2))
        } else {
          console.log("Erased", data)
        }
      }).promise();

      url = awsCloudfromEndpointImage + destination
    }

    return url
  },

  deleteImage: async (key, type) => {
    const s3 = new AWS.S3()
    let directory
    if (type == 1) {
      directory = `quizQuestion`
    } else if (type == 2) {
      directory = `quizAnswer`
    } else if (type == 3) {
      directory = `clinicalCase`
    } else if (type == 4) {
      directory = `specialities`
    } else if(type ==5){
      directory = `tmp`
    }else if(type == 6){
      directory = `students`
    }else if(type ==7){
      directory = `employees`
    }
    const params2 = {
      Bucket: `${awsBucketImagesName}`,
      Key: `${directory}/${key}`,
    }
    const result = await s3.deleteObject(params2, function (err, data)
    {
      if (err) {
        console.error('- Error trying to delete a Image. (s3)', JSON.stringify(err, null, 2))
        return{
          data:data,
          success: false,
          message: result,
          
        }
      } else {
        return{
          data: data,
          sucess: true,
          status: 200,
          message: "the image with id: " + key +" was deleted",
          
        }
      }
    }).promise();

      if(result.err){
        return{
          error: err,
          message: "error en la base de datos",
          status: 500,
          success: false,
          resultado: result
        }
      } else{
        return{
          status: 200,
          sucess: true,
          message: 'Imagen Eliminada'
        }
      }
  },

  uploadImage: async (data, stream, ext = null) => {
    let key = data + '-' + uniqid()
    if (ext) {
      key += '.' + ext
    }

    const params = {
      Bucket: `${awsBucketImagesName}/clinicalCase`,
      Key: key,
      Body: stream
    }
    const s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params
    })

    const uploadPromise = s3.upload().promise()
    const result = await uploadPromise
      .then(result => {
        return {
          success: true,
          response: result
        }
      })
      .catch(err => {
        console.error('- Error trying to upload a image. (s3)', JSON.stringify(err, null, 2))
        return {
          success: false,
          code: 500,
          error: JSON.stringify(err, null, 2)
        }
      })

    return result
  },

  uploadImageTemp: async (data, stream, ext = null) => {
    let key = data + '-' + uniqid()
    if (ext) {
      key += '.' + ext
    }

    const params = {
      Bucket: `${awsBucketImagesName}/tmp`,
      Key: key,
      Body: stream
    }
    const s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params
    })


    const uploadPromise = s3.upload().promise()

    const result = await uploadPromise
      .then(result => {
        return {
          success: true,
          response: result
        }
      })
      .catch(err => {
        console.error('- Error trying to upload a image. (s3)', JSON.stringify(err, null, 2))
        return {
          success: false,
          code: 500,
          error: JSON.stringify(err, null, 2)
        }
      })

    return result
  }, deleteAlTempImages: async(data, type) =>{
    const key = data
    directory = `temp`
    const params = {
      Bucket: `${awsBucketImagesName}/tmp`,
      key: `${key}`
    }
    const s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params
    })
  },

  getAllTempImages: async()=>{
    
    const s3 = new AWS.S3()
    let array = new Array()
    var params = {
      Bucket: `${awsBucketImagesName}`
     };
      const images = await s3.listObjectsV2(params, function(err, data) {
       if(err){ console.log(err, err.stack);
      }else{
        console.log(data)
        for(i=0;i<data.Contents.length;i++){

          if(data.Contents[i].Key.substring(0,3)=== 'tmp'){
            array[i]=data.Contents[i]
            //console.log(array[i])
            //console.log(array.length)
          }else{
            array[i]= false
          }
            const params2 ={
              Bucket: `${awsBucketImagesName}`,
              Key: data.Contents[i].Key
            }
            if(array[i]!== false){
            /*const result = s3.deleteObject(params2, function(err, data){
              if (err) {
                console.error('- Error trying to delete a Image. (s3)', JSON.stringify(err, null, 2))
                return{
                  data:data,
                  success: false,
                  message: result,
                  
                }
              } else {
                return{
                  data: data,
                  sucess: true,
                  status: 200,
                  message: "the image with id: " + params2.Key +" was deleted",
                  
                }
              }
            })*/

            /*
            }
          
        }
      }
       
    })
    
    //console.log(images)

  },
  
  deleteImageFromBD: async (data)=>{
    const imuages = await ImageModel.findOneAndDelete({"key":data})
    //console.log(imuages)
  },
  getAllImagesAndDeleteByDate: async ()=>{
    const s3 = new AWS.S3()
    const casos = new Array()
    const preguntas = new Array()
    const respuestas = new Array()
    const especialidades = new Array()
    const fechaEnero = new Date('01-01-2023')
    //console.log(fechaEnero)

    var params = {
      Bucket: `${awsBucketImagesName}`
     };
      const images = await s3.listObjectsV2(params, function(err, data) {
       if (err) {
        console.log(err, err.stack);
      }
       else{
        //console.log(data)
        for(i=0; i< data.Contents.length; i++){
          if(data.Contents[i].LastModified>= fechaEnero){
            if(data.Contents[i].Key.substring(0,12)=== 'clinicalCase'){
            const ki = data.Contents[i].Key.slice(13)
            console.log(ki)
            casos[i] = data.Contents[i]
            const params2 ={
              Bucket: `${awsBucketImagesName}`,
              Key: data.Contents[i].Key
            }
            const result = s3.deleteObject(params2, function(err, data){
              if (err) {
                console.error('- Error trying to delete a Image. (s3)', JSON.stringify(err, null, 2))
                return{
                  data:data,
                  success: false,
                  message: result,
                  
                }
              } else {
                return{
                  data: data,
                  sucess: true,
                  status: 200,
                  message: "the image with id: " + params2.Key +" was deleted",
                  
                }
              }
            })
            //console.log("logrado 1" + "\n"+ data.Contents[i].LastModified)
            }else if(data.Contents[i].Key.substring(0,12)=== 'quizQuestion'){
              const ki = data.Contents[i].Key.slice(13)
              //console.log(ki)
              const kia = data.Contents[i].Key.slice(12)
              //console.log(kia)
                           
              preguntas[i] = data.Contents[i]
              //console.log("logrado 2"+ "\n"+ data.Contents[i].LastModified)
              const params2 ={
                Bucket: `${awsBucketImagesName}`,
                Key: data.Contents[i].Key
              }
              const result = s3.deleteObject(params2, function(err, data){
                if (err) {
                  console.error('- Error trying to delete a Image. (s3)', JSON.stringify(err, null, 2))
                  return{
                    data:data,
                    success: false,
                    message: result,
                    
                  }
                } else {
                  return{
                    data: data,
                    sucess: true,
                    status: 200,
                    message: "the image with id: " + params2.Key +" was deleted",
                    
                  }
                }
              })
            }else if(data.Contents[i].Key.substring(0,10)=== 'quizAnswer'){
              const ki = data.Contents[i].Key.slice(11)
              const kia = data.Contents[i].Key.slice(10)
              respuestas[i] = data.Contents[i]
              const params3 ={
                Bucket: `${awsBucketImagesName}`,
                Key: data.Contents[i].Key
              }
              const result = s3.deleteObject(params3, function(err, data){
                if (err) {
                  console.error('- Error trying to delete a Image. (s3)', JSON.stringify(err, null, 2))
                  return{
                    data:data,
                    success: false,
                    message: result,
                    
                  }
                } else {
                  return{
                    data: data,
                    sucess: true,
                    status: 200,
                    message: "the image with id: " + params3.Key +" was deleted",
                    
                  }
                }
              })
            }else if(data.Contents[i].Key.substring(0,12)=== 'specialities'){
              const ki = data.Contents[i].Key.slice(13)
              const kia = data.Contents[i].Key.slice(12)
              especialidades[i] = data.Contents[i]
              const params4 ={
                Bucket: `${awsBucketImagesName}`,
                Key: data.Contents[i].Key
              }
              const result = s3.deleteObject(params4, function(err, data){
                if (err) {
                  console.error('- Error trying to delete a Image. (s3)', JSON.stringify(err, null, 2))
                  return{
                    data:data,
                    success: false,
                    message: result,
                    
                  }
                } else {
                  return{
                    data: data,
                    sucess: true,
                    status: 200,
                    message: "the image with id: " + params4.Key +" was deleted",
                    
                  }
                }
              })
            }
          }
        }
       }
    })
    return{
      clinicalCases: casos,
      questions: preguntas,
      answers: respuestas,
      specialities: especialidades
    }

  }
}
module.exports = S3*/