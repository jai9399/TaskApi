require('./db/mongoose')
const Task = require('./models/tasks')
const mongoose = require('mongoose')

const createTaskandDelete = async (id) =>{
    await Task.findByIdAndDelete(id);
    var count = await Task.countDocuments({completed:false});
    return count; 
} 
createTaskandDelete('5dff6d6c1130bb4558e1d8f0').then((rs)=>{
    console.log(rs);
}).catch((e)=>{
    console.log('Error')
})