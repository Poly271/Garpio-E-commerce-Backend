// With models proper naming convention is capitalized fist letter and in singular form (example: Enrollment.js)

const mongoose = require('mongoose');

// [SECTION] Schema/Blueprint
const orderSchema = new mongoose.Schema({
	userId:{
		type: String,
		required:[true, 'User ID is required']
	},
	productsOrdered:[
		{
		productId:{
			type: String,
			required:[true, 'Product ID is required']
		},
		quantity:{
			type: Number,
			required:[true, 'Quantity is required']
		},
		subtotal:{
			type: Number,
			default: 0
		}
		}
	],
	
	totalPrice: {
		type: Number,
		required: [true, 'totalPrice is required']
	},
	orderedOn: {
		type: Date,
		default: Date.now
	},
	status: {
		type: String,
		default: 'Pending'
	}
})

// [SECTION] Model
module.exports = mongoose.model('Order', orderSchema);