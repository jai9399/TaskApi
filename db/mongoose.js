const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/tasksApp',
        {useNewUrlParser:true,
         useUnifiedTopology:true,
         useFindAndModify:false,
         useCreateIndex:true
        },function(err,client){
            if(!err)
            console.log('connected');
         })
