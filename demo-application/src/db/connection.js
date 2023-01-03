const mongoose = require('mongoose');

module.exports=async()=>{
    mongoose.set('strictQuery', true)

    await mongoose.connect('mongodb://localhost:27017/test');
}

