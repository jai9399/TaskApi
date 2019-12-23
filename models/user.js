require('../db/mongoose')
const task = require('./tasks')
const validator = require('validator')
const mongoose= require('mongoose')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0 || value >150){
                throw new Error('Incorrect Age')
        }
    }},
    password:{
        required:true,
        minlength:8,
        type:String
    },
    emailId:{
        type:String,
        unique:true,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Incorrect Email!');
            }
        }
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]

},{timestamps:true})
const jwt = require('jsonwebtoken')

userSchema.virtual('taskers',{
        ref:'Tasks',
        localField:'_id',
        foreignField:'owner'
})
userSchema.methods.generateToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},"thisissecret")
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.methods.PublicData = function(){
    const user = this
    const sent = {"email":user.emailId,"age":user.age,"tokens":user.tokens};
    return sent
}
userSchema.statics.findByCredentials = async (email,password)=>{
        const user = await User.findOne({emailId:email});
        if(!user){
           throw new Error('Unable to Fetch User')
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
           throw new Error('Invalid Credentials')}
        else{
        console.log('Logged in')
        return user
        }
}
const bcrypt = require('bcryptjs')
userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }
    console.log('Next')
    next();
})
/*userSchema.pre('remove',async function(next){
          const user = this
          await task.deleteMany({owner:req.user._id});
          next();
}) */
const User = mongoose.model('Users',userSchema);

module.exports=User;