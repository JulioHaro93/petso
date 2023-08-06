/**
 * db/images.js
 *
 * @description ::
 * @docs        :: None
 */
const db = require('./db')

const S3 = require('../lib/s3')
const Schema = db.mongoose.Schema

const ImageSchema = new Schema({
    url: { type: String },
    key: { type: String },
    isTempImage: { type: Boolean },
    bucket: { type: String }, // s3 data
    type: { type: Number }
}, { versionKey: false })

ImageSchema.pre('deleteOne', async function (next) {
    const image = await Images.findOne(this.getQuery())
    if (image && image.key)
        await S3.deleteImage(image.key, image.type)
    next()
});

const Images = db.mongoose.model('Images', ImageSchema, 'Images')

module.exports = Images
