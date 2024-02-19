// Dependencies and Modules
const User = require("../models/User");
const bcrypt = require('bcrypt');
const auth = require("../auth");
const Order = require("../models/Order");


/* User Registration (S50) */
module.exports.registerUser = (req, res) => {
    if (!req.body.email.includes("@")){
        return res.status(400).send({error: "Email Invalid"});
    }
    else if (req.body.mobileNo.length !== 11){
        return res.status(400).send({error: "Mobile Number should contain 11 digits."});
    }
    else if (req.body.password.length < 8) {
        return res.status(400).send({error: "Please input atleast 8 characters."});
    } else {
        let newUser = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            mobileNo : req.body.mobileNo,
            password : bcrypt.hashSync(req.body.password, 10)
        })

        return newUser.save()
        .then((result) => res.status(201).send({message: "Registered succesfully", data: result}))
        .catch(err => res.status(500).send({error: "There is an error, please try again."}))
    }
}


 /* User authentication (S50) */
module.exports.loginUser = (req, res) => {

	if(req.body.email.includes('@')){
		return User.findOne({ email : req.body.email})
		.then(result => {
			if(result == null){
				return res.status(404).send({error: "You no exist"});
			} else {
				const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password)
				if(isPasswordCorrect){
					return res.status(200).send({access: auth.createAccessToken(result)})
				} else{
					return res.status(401).send({error:"Email and password do not match"});
				}
			}
		})
		.catch(err => res.status(500).send({error: "There is an error while logging in, please try again."}));
	}else{
		return res.status(400).send({error: "No email Found."});
	}
}


/* User Authentication (S50) */
module.exports.getProfile = (req, res) => {
	return User.findById(req.user.id)
	.then(result => {
		if(result == null){
			return res.send({error: "There ain't no human that is here in thy name as of now"})
		} else {

			result.password = "";
			return res.status(200).send(result);
		}

	})
	.catch(err => res.status(500).send({error: "Error fetching your data."}));
}


/* Retrieve User Details (S50) */
module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id)
    .then(result =>{
        if(!result){
            res.send({error:"User Not Found"})
        }
            result.password = "******";
            return res.status(200).send(result);
    })
    .catch(err => res.status(500).send({error:"There is an error fecthing your profile"}))
}



/* Set User as Admin (Admin Only) (S50) */
module.exports.setAsAdmin = (req, res) => {

	return User.findById(req.params.userId).then(user =>{
		if(user.isAdmin == true){
			res.status(200).send({message: `${user.firstName} is already an Admin!` });
		} else {
			let updatedAdminField ={
				isAdmin: true
			}
			return User.findByIdAndUpdate(req.params.userId,updatedAdminField)
			.then(users =>{
				if(users.isAdmin == false){
					res.status(200).send({message: `${users.firstName} is now an Admin!` });
				}else{
					res.status(400).send({error:"There is a problem changing to admin"});
				}
				
			})
			.catch(err => res.status(500).send({error:"Fetching Failed"}));
		}
	})
    
}


/* Update Password (S50) */
module.exports.updatePassword = async (req, res) => {
	try{
		const {newPassword} = req.body;
		const {id} = req.user;
		const hashedPassword = await bcrypt.hash(newPassword, 10);

		await User.findByIdAndUpdate(id, {password: hashedPassword});

		res.status(200).json({message: "Password updated succesfully!"});
	}catch(error){
		console.log(error);
		res.status(500).json({message: "Internal Server Error!"});
	}
}


/* Get enrollment */
module.exports.getCart =(req, res) => {
    return Order.find({userId : req.user.id})
        .then(orders => {
            if (orders.length > 0) {
                return res.status(200).send(orders);
            }
            return res.status(404).send({error: "No enrollments found"});
        })
        .catch(err => res.status(500).send({error: "Failed to fetch enrollments"}));
};


// Update user profile
module.exports.updateCartQuantity = (req, res) => {

	let updateQuantity = {

		productsOrdered:req.body.productsOrdered
	
	}

	return Order.findByIdAndUpdate(req.body.id, updateQuantity)
	.then(order => {
		if(order){
			res.status(200).send({message: "Order successfully updated", data: order});
		}else{
			res.status(500).send({message: "Order cannot be updated"});
		}
	})
	.catch(err => res.send({error: "Order Id Incomplete"}));
	
}


 // Make admin
// module.exports.makeAdmin = async (req, res) => {
// 	try{
// 		const {id} = req.user;
// 		return User.findById(req.user.id)
// 		.then(result => {
// 			if (!req.user.isAdmin){
// 				return res.status(403).send({error: "Not admin"});
// 			}else{
// 				result.isAdmin = true;
// 				return res.status(200).send({id, message: "User had been made admin"});
// 			}
// 		})
// 	}catch(error){
// 		res.status(500).send({message: "Failed to make admin."})
// 	}
// }


// Add to cart
module.exports.addToCart = (req, res) => {

	if(req.user.isAdmin){
		return res.status(403).send("You are admin, you can not add to cart")
	}

	let newOrder = new Order({
		userId: req.user.id,
		productsOrdered: req.body.productsOrdered,
		totalPrice: req.body.totalPrice
	})

	return newOrder.save()
	.then(cart => {
		if(!cart){
			return res.send({error: "There is an error while adding to cart."})
		}
		return res.status(201).send({message: "Added to cart", data: cart});
	})
	.catch(err => res.status(500).send({error: "Error fetching your data."}));
}

/* Get enrollment */
module.exports.getOrder =(req, res) => {
    return Order.find({userId : req.user.id})
        .then(orders => {
            if (orders.length > 0) {
                return res.status(200).send(orders);
            }
            return res.status(404).send({error: "No enrollments found"});
        })
        .catch(err => res.status(500).send({error: "Failed to fetch enrollments"}));
};
