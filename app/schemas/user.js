var mongoose = require("mongoose")
var bcrypt = require("bcryptjs")
var SALT_WORK_FACTOR = 10

var UserSchema = new mongoose.Schema({
    name:{
        type:String,
        unipue:true
    },
    password: String,
    // 0 normal
    // 1 verified
    // 2 professonal user



    // >10 admin
    // >50 spuer admin

    // admin
    role:{
        default:0,
        type: Number
    },
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

UserSchema.pre('save', function (next) {
    var user = this
    if (this.isNew) {
        // console.log('4.isNew', this)
        this.meta.createAt = Date.now()
        this.meta.updateAt = Date.now()
    } else {
        // console.log('4.isNew not', this)
        this.meta.updateAt = Date.now()

    }
    bcrypt.genSalt(SALT_WORK_FACTOR,(err,salt)=>{
        if(err)return next(err)

        bcrypt.hash(user.password,salt,(err,hash)=>{
            user.password = hash
            next()
        })
    })
})

UserSchema.methods = {
    comparePassword(_password,cb){
        bcrypt.compare(_password, this.password,(err,isMatch)=>{
            if(err)return cb(err);
            cb(null, isMatch)
        })
    }
}



UserSchema.statics = {
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

module.exports = UserSchema
