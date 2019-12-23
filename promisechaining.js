require('./db/mongoose')
const Task = require('./models/tasks')
const mongoose = require('mongoose')

Task.findByIdAndDelete("5dff2a9468b7814bcc63f575").then(()=>{
    return Task.countDocuments({completed:false})
}).then((result)=>{
    console.log(result)
})

