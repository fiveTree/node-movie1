var mongoose = require("mongoose")
var Schema = mongoose.Schema
var { ObjectId } = Schema.Types


var CategorySchema = new Schema({
    name:String,
    movies:[{
        type: ObjectId,
        ref: 'Movie'
    }],
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

CategorySchema.pre('save', function (next) {
    if (this.isNew) {
        console.log('4.isNew', this)
        this.meta.createAt = Date.now()
        this.meta.updateAt = Date.now()
    } else {
        console.log('4.isNew not', this)
        this.meta.updateAt = Date.now()

    }

    next()
})

CategorySchema.statics = {
    fetch(cb) {
        return this.find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById(id, cb) {
        return this
            .findOne({ _id: id })
            .exec(cb)
    }
}

module.exports = CategorySchema
