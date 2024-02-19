// With models proper naming convention is capitalized fist letter and in singular form (example: Enrollment.js)

const mongoose = require('mongoose');

// [SECTION] Schema/Blueprint
const cartSchema = new mongoose.Schema({
	userId:{
		type: String,
		required:[true, 'User ID is required']
	},
	cartItems:[{
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
			required:[true, 'Price is necessary']
		}

	}],
	
	totalPrice: {
		type: Number,
		default: 0
	},
	orderedOn: {
		type: Date,
		default: Date.now
	},
	status: {
		type: String,
		default: 'Available'
	}
})

// [SECTION] Model
module.exports = mongoose.model('Cart', cartSchema);