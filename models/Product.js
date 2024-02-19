const mongoose = require("mongoose");

// [Section] Schema/Blueprint
const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is required']
    },
    description: {
        type: String,
        required: [true, 'You might get what you think you will get']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
})

//[Section] Model
module.exports = mongoose.model('Product', productSchema) 