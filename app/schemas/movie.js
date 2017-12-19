var mongoose = require("mongoose")

var MovieSchema = new mongoose.Schema({
    doctor: String,
    title: String,
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: String,
    year: Number,
    meta:  {
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

MovieSchema.pre('save',function(next){
    if(this.isNew){
        console.log('4.isNew', this)
        this.meta.createAt=Date.now()
        this.meta.updateAt = Date.now()
    }else{
        console.log('4.isNew not', this)
        this.meta.updateAt = Date.now()
        
    }
    
    next()
})

MovieSchema.statics = {
    fetch(cb){
        return this.find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById(id,cb) {
        return this
            .findOne({_id:id})
            .exec(cb)
    }
}

module.exports = MovieSchema
