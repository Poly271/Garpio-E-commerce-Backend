// Dependencies and Modules
const express = require("express");
const userController = require("../controllers/user");
const passport = require('passport');

const {verify, verifyAdmin, isLoggedIn} = require("../auth");

// Routing Component 
const router = express.Router();

// Route for User Registration (S50)
router.post("/", userController.registerUser);

// Route for User Authentication (S50) 
router.post("/login", userController.loginUser);

// Retrieve User Details (S50)
router.get("/details", verify, userController.getProfile);

// Set User as Admin (Admin Only) (S50) 
router.patch("/:userId/set-as-admin", verify, verifyAdmin, userController.setAsAdmin);

// Update Password (S50)
router.put("/update-password", verify, userController.updatePassword);

// Enroll user to a Order
router.post("/add-to-cart", verify, userController.addToCart);

// Get users cart
router.get("/get-cart", verify, userController.getCart);

// Get user Order
router.get("/get-order", verify, userController.getOrder);

//Google Login
router.get("/google", passport.authenticate('google', {
	// scopes that are allowed when retrieving data
	scope: ['email', 'profile'],
	prompt: "select_account"
}))

// callback URL for Oauth authentication
router.get('/google/callback', passport.authenticate('google', {
	failureRedirect: '/users/failed'
}),
function(req,res){
	res.redirect('/users/success')
}
)

// failed authentication
router.get("/failed", (req, res) => {
	console.log("User is not authenticated");
	res.send("Failed");
})

// success authentication
router.get("/success", isLoggedIn, (req, res) => {
	console.log("You are logged in");
	console.log(req.user);
	res.send(`Welcome ${req.user.displayName}`);
})

// Google logout
router.get("/logout", (req, res) => {
	req.session.destroy(err => {
		if(err){
			console.log("Error while destroying session");
		}else{
			req.logout(() => {
				console.log("You are logged out.")
				res.redirect('/')
			})
		}
	})
})


// Update user profile
router.patch("/update-cart-quantity", verify, userController.updateCartQuantity);



//[SECTION] Export Route System
// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router; 