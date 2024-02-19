const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	// User_Id:{
	// 	type: String,
	// 	required:[true, 'User id is required']
	// },
	firstName:{
		type: String,
		required:[true, 'Please input your first name']
	},
	lastName:{
		type: String,
		required:[true, 'I mean you can share a bit more']
	},
	email:{
		type: String,
		required:[true, 'Please input for faster communication']
	},
	password:{
		type: String,
		required:[true, 'This is for your security mate']
	},
	isAdmin:{
		type: Boolean,
		default: false
	},
	mobileNo:{
		type: String,
		required:[true, 'Input those digits mate']
	}
})

module.exports = mongoose.model('User', userSchema);