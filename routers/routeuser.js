const express = require('express')
const router = new express.Router();
const User = require('../models/user')
const auth = require('../middleware/auth')
const Tasks = require('../models/tasks')

//Get User Profile
router.get('/users/me',auth,function(req,res){
    res.send(req.user)
})

//delete user


router.delete('/users/me',auth,async function(req,res){
    try{
     const userd = await User.findByIdAndDelete(req.user._id);
     await Tasks.deleteMany({owner:req.user._id});
     if(!userd){
     return  res.status('404').send('Not Found');
     }
   res.send('Deleted');
 }
 catch(e){
     console.log(e)
 }
})
/*set up for both routes using query string and using parameters*/

// find user

//Paramaters Method
router.get('/users/:id',function(req,res){
    if(req.params.id){
        User.findById(req.params.id).then((users)=>{
            res.send(users);
        }).catch((e)=>{
            res.status('400').send(e);
        })
    }   
    }
)

//get all Users

//Query String
router.get('/users',auth,(req,res)=>{
    console.log(req.query.id)
    if(!req.query.id){
    User.find({}).then((users)=>{
        res.send(users);
    }).catch((e)=>{
        res.status('400').send(e);
    }) 
}
    else{
        User.findById(req.query.id).then((users)=>{
            res.send(users);
        }).catch((e)=>{
            res.status('400').send(e);
        })
    }
})


// Create user

router.post('/users',async (req,res)=>{
    const User1 = new User(req.body);
 //    User1.save().then(()=>{
 //        res.send(req.body)
 //     }
 //     ).catch((e)=>{
 //         res.status('400').send(e);
 // })
 try{
     const token  =await User1.generateToken(); 
    await User1.save();
    res.send({User1,token});
 }
 catch(e){
     console.log(e);
     res.status('400').send(e);
 }
})
//logout
router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens.pop();
        
        await req.user.save() 
        res.send();
    }
    catch(e){
      res.status(500).send('')
    }
})
//logout all
router.post('/users/logoutall',auth,async(req,res)=>{
    try{
    req.user.tokens = [];
    await req.user.save();
    res.send()}
    catch(e){
        console.log(e)
        res.status(500).send()
    }
})
//Log User in

router.post('/users/login',async (req,res)=>{
     
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateToken();
        console.log(user)
        res.send({"user":user.PublicData(),token})
    }
    catch(e){
        console.log(e)
        res.send(e)
    }

})

//Update user

//findById and Update bypasses middlewre and to use middleware we need to replace the code
router.patch('/users/me',auth,async function(req,res){
    const allowed = ['name','emailId','age','password']
    const sent = Object.keys(req.body);
    const isValid = sent.every((value)=>allowed.includes(value));
    if(isValid){
    try{
    //     const userup =await User.findByIdAndUpdate(req.params.id , req.body ,{
    //             new:true,
    //             runValidators:true
    // }) 
    const userup = await User.findById(req.user._id);
    sent.forEach((update)=>userup[update] = req.body[update])
    await userup.save()
        console.log(userup)
        if(!userup)
        return res.status('404').send('Not found');
        
        res.send(userup)

}
    catch(e){
        console.log(e);
        res.send('error')
    }}
    else{
        res.send('Invalid Update')
    }
}
)
module.exports=router;
