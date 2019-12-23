const express = require('express')
const router = new express.Router();
const Tasks = require('../models/tasks')
const auth = require('../middleware/auth')
//delete task

router.delete('/tasks/:id',async function(req,res){
    try{
   const taskd = await Tasks.findByIdAndDelete(req.params.id);
   if(!taskd){
     return  res.status('404').send('Not Found');
   }
   res.send('Deleted');
 }
 catch(e){
     console.log(e)
 }
})

// find task

router.get('/tasks/:id',auth,function(req,res){
    const _id = req.params.id;
    if(req.params.id){
        Tasks.findOne({"_id":id,owner:req.user.id}).then((tasks)=>{
            res.send(tasks);
        }).catch((e)=>{
            res.status('400').send(e);
        })
    }   
    }
)

//get all tasks

router.get('/tasks',auth, (req,res)=>{
    if(!req.query.id){
    Tasks.find({}).then((tasks)=>{
        res.send(tasks);
    }).catch((e)=>{
        res.status('400').send(e);
    }) 
}
    else{
        req.user.populate({
            path:'taskers',
            match:{
                completed:true
            },options:{
                limit:10,
                skip:20,
                sort:{
                    createdAt : -1
                }
            }
         }).execPopulate().then((tasks)=>{
            if(!tasks){
                return res.status('404').send('Not found')
            }
            res.send(tasks);
        }).catch((e)=>{
            res.status('400').send(e);
        })
    }
})

// Create task

router.post('/tasks',auth,(req,res)=>{
    //const Task1 = new Tasks(req.body);
    const Task1 = new Tasks({
        ...req.body,
        owner:req.user._id
    })
    Task1.save().then(()=>{
        res.send(Task1)
     }
     ).catch((e)=>{
         res.status('400').send(e);
 })
})

//Update task

router.patch('/tasks/:id',auth,async function(req,res){
    const allowedT = ['completed','task']
    const arrayT = Object.keys(req.body);
    const isTrue = arrayT.every((value)=>allowedT.includes(value))
    if(!isTrue)
    return res.send('Invalid Updates')

    try{
        console.log(req.user)
         const taskup = await Tasks.findOne({_id:req.params.id,owner:req.user._id});
         console.log(taskup)
         if(!taskup){
            return res.status('404').send('Oops!')
         }
         arrayT.forEach((update)=>{ taskup[update] = req.body[update]})
         await taskup.save()
         res.send(taskup)
    }
    catch(e){
        console.log(e)
    }
})
module.exports=router;
