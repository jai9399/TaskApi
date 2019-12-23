const jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth = async (req,res,next)=>{
    try{
    const token = req.header('Authorization').replace('Bearer ','');
    const decode = jwt.verify(token,'thisissecret')
    const user = await User.findOne({"_id":decode._id, 'tokens.token':token})
      
          if(!user){
              throw new Error('Not found')
          }
          req.user = user;
          next();
    }
    catch(e){
        res.send('Please Authenticate First')
    }
}
module.exports=auth;