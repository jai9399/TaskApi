const express = require('express');

const app = express();
// app.use((req,res,next)=>{
//      res.send('In Maintainence');
// })
// app.use((req,res,next)=>{
//     if(req.method =="GET"){
//        console.log("Get")
//     }
//     next();
// })
app.use(express.json());
const Tasks = require('./models/tasks')
const User = require('./models/user')
const route1 = require('./routers/routetask')
app.use(route1)

const route2 = require('./routers/routeuser')
app.use(route2)

app.use(express.urlencoded({ extended: true }));

require('./db/mongoose')
const bcrypt = require('bcryptjs')
myfunction = async ()=>{
    const password ="12345678"
    const hashed = await bcrypt.hash(password,8);
    console.log(password)
    console.log(hashed)
    const isMatch = await bcrypt.compare(password,hashed);
    console.log(isMatch)
    return isMatch
}
myfunction()
const port = process.env.port || 3000;
app.listen(port,()=>{
    console.log('Hi');
    
})

const jwt = require("jsonwebtoken")
const myfunc = async ()=>{
    const wt = jwt.sign({_id:"123456"},"thisissecret",{expiresIn:"10 days"});
    console.log(wt)

    const dt = jwt.verify(wt,'thisissecret')
    console.log(dt)
}
myfunc();

const main = async ()=>{
    // try{
    // const task = await Tasks.findById('5e00b62b748c4006189ac3b2')
    // await task.populate('owner').execPopulate();
    // console.log(task.owner);}
    // catch(e){
    //     console.log(e);
    // }
    const user = await User.findById('5e00b5619dabe04fb016abcb')
    await user.populate('taskers').execPopulate();
    console.log(user.taskers)
}
main();