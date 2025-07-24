const mongoose=require('mongoose')
const Schema=mongoose.Schema
const user=new Schema({
    name:{type:String},
    account:{type:String,required: true, unique: true },
    password:{type:String,required: true},
    gender:{type:String,required: true},
    dob:{type:String,required: true},
    avatar:{type:String}
}, { collection: "customer"})
module.exports=mongoose.model('User',user)