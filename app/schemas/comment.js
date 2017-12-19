var mongoose = require("mongoose")
var Schema = mongoose.Schema
var {ObjectId} = Schema.Types


var CommentSchema = new mongoose.Schema({
    movie:{
        type:ObjectId,
        ref:'Movie'
    },
    from:{
        type: ObjectId,
        ref: 'User' 
    },
    reply:[
        {
            from: { type: ObjectId, ref: 'User' },  
            to: {type: ObjectId, ref: 'User'},  
            content:String
        }
    ],
    
    content:String,
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

CommentSchema.pre('save',function(next){
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

CommentSchema.statics = {
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

module.exports = CommentSchema
