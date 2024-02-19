//Dependencies and Modules
const User = require("../models/User");
const bcrypt = require('bcrypt');
const auth = require("../auth");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add to cart
module.exports.addToCart = (req, res) => {
    if(req.user.isAdmin == true){
        return res.send({message: "Admins are not allowed to add to cart"})
    }

    return Product.findById(req.body.productId)
    .then(product =>{
            // const grandPrice = subtotal + Cart.totalPrice;
            // const subtotal = product.price * req.body.quantity;
            let newCart = new Cart({
                userId: req.user.id,
                cartItems: req.body.cartItems,
                totalPrice: req.body.totalPrice
            })

            return newCart.save()
            .then(cart => { 
                if(!cart){
                    return res.send({error: "There is an error while adding to cart."})
                }
                return res.status(201).send({message: "You have succesfully Added to your cart", data: cart});
            })
            .catch(err => res.status(500).send({error: "Error fetching your data."}));
    })
}


//Get user's cart
module.exports.getCart = (req, res) => {
    return Cart.find({userId : req.user.id})
        .then(orders => {
            if (orders.length > 0) {
                return res.status(200).send(orders);
            }
            return res.status(404).send({error: "No orders found"});
        })
        .catch(err => res.status(500).send({error: "Failed to fetch orders"}));
};

// Change product quantities

module.exports.updateCartQuantity = (req, res) => {
    const userId = req.user.id;
    const { productId, quantity, subtotal } = req.body;

    // Find the cart by userId and productId
    Cart.findOne({ userId, 'cartItems.productId': productId })
        .then(cart => {
            if (!cart) {
                return res.status(404).json({ message: "Cart not found or Product not in cart" });
            }

            // Update the quantity and subtotal of the specific cart item
            const cartItem = cart.cartItems.find(item => item.productId === productId);
            if (!cartItem) {
                return res.status(404).json({ message: "Product not found in cart" });
            }

            cartItem.quantity = quantity;
            cartItem.subtotal = subtotal;

            // Calculate totalPrice by summing up all subtotal values
            cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.subtotal, 0);

            // Save the updated cart
            return cart.save();
        })
        .then(updatedCart => {
            res.status(200).json({ message: "Quantity and totalPrice successfully updated", data: updatedCart });
        })
        .catch(err => {
            console.error('Error updating cart quantity:', err);
            res.status(500).json({ error: "Internal Server Error" });
        });
}

// module.exports.updateCartQuantity = async (req, res) => {

//     try{

//         const userId = req.user.id;
//         if (!userId){
//             res.status(401).send({message: "Please enter your correct authentication token"});
//         }

//         const user = await User.findById(userId);
//         if(!user){
//             res.status(401).send({message: "User not Found"});
//         }

//         const cartId = req.body.cartId;
//         if(!cartId){
//             res.status(401).send({message: "please input the cart ID"});
//         }

//         const cart = await Cart.findById(cartId);
//         if(!cart){
//             res.status(401).send({message: "Cart not found"});
//         }

        


        
//         // const newQuantity = req.body.quantity;
//         // if(!newQuantity){
//         //     res.status(401).send({message: "please input desired quantity"});
//         // }

        

//         // const updatedCartQuantity = Cart.cartItems.map( updatedQuantity =>({

//         // }))
//         // return Cart.findByIdAndUpdate(cartId, newQuantity)
//         // .then( updated =>{
//         //     if(updated){
//         //         res.status(200).send({message: "Quantity successfully updated", data: updated});
//         //     }else{
//         //         res.status(500).send({message: "Quantity did not update"});
//         //     }
//         // })
//         } catch (error){
//             console.error(error);
//             res.status(500).json({message: "Internal Server Error. unable to update the quantity of the cart. please try again later"})
//         }
// }

// Remove item from cart
module.exports.removeItem = async (req, res) =>{
	try{
		const productId = req.params.productId;

		const deletedItem = await Cart.findByIdAndDelete(productId);

		if (!deletedItem) {
			return res.status(404).send({ error: "Item not found"});
		}
		return res.status(200).send({ message: "Item removed from Orders"})
	} catch (error) {
		res.status(500).send({message: "Internal Server Error"});
	}
}


// Clear items from cart
module.exports.clearItems = async (req, res) => {
	try{
	const userId = req.user.id;

	await Cart.deleteMany(
			{userId},
			{ $set: { cartItems: []}},
			{ new: true}
		);
	res.status(200).send({ message: "All cart items are removed."})
	}catch(error){
	res.status(500).send({ error: "Internal Server Error"});
	}
}

// check out
module.exports.checkOut = (req, res) => {
    
        if(req.user.isAdmin){
            return res.status(403).send({error:"Access Forbidden"});
        }
    
        let newOrder = new Order({
            userId: req.user.id,
            productsOrdered: req.body.cartItems,
            totalPrice: req.body.totalPrice
        })
    
        return newOrder.save()
        .then(checkout => {
            if(!checkout){
                return res.send({error: "There is an error while cheking out"})
            }
            return res.status(201).send({message: "check out successful",data: checkout});
        })
        .catch(err =>res.status(500).send(err))
    } 



// module.exports.addToCart = async (req,res) => {
//     if(req.user.isAdmin == true){
//         return res.send({message: "Admins are not allowed to add to cart"})
//     }

//     try{
//         let cart = await Cart.findOne({usedId: req.user.id});

//         if(!cart) {
//             cart = new Cart({
//                 userId: req.user.id,
//                 cartItems: [],
//                 totalPrice: 0
//         });
//     }

//     for(const item of req.body.cartItems){
//         const product = await Product.findById(item.productId);
//         const subtotal = item.quantity * product.price;
//         const existingItem = cart.cartItems.find(cartItem = cartItems.productId === item.productId)
//     }
//     if (existingItem){
//         existingItem.quantity += item.quantity;
//         existingItem.subtotal +=subtotal;
//     }else{
//         cart.cartItems.push({
//             productId: item.productId,
//             quantity: item.quantity,
//             subtotal: subtotal
//         })
//     }
// }

// cart.totalPrice = cart.cartItems.reduce((total,item)=> total + item.subtotal, 0);
// cart =await cart.save();

// if(!cart){
//     return res.send({error: "Error"})
// }
// return res.send({message:"added total cart!", data: cart})
// }


