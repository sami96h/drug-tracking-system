const mongoose = require('mongoose')

module.exports=async()=>{
	mongoose.set('strictQuery', true)
	try{
		await mongoose.connect('mongodb://127.0.0.1:27017/test')
		
	}catch(err){
		console.log('Error in db connection : ',err)
	}
	
}

