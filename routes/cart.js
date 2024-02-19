//D ependencies and Modules
const express = require("express");
const userController = require("../controllers/user");
const passport = require('passport');
const cartController = require("../controllers/cart");

const {verify, verifyAdmin, isLoggedIn} = require("../auth");

// Routing Component
const router = express.Router();

// Add to cart
router.post("/add-to-cart", verify, cartController.addToCart);

// Get user's cart
router.get("/get-cart", verify, cartController.getCart);

// Change product quantity
router.patch("/update-cart-quantity", verify, cartController.updateCartQuantity);

// Remove item from cart
router.delete("/:productId/remove-from-cart", verify, cartController.removeItem);

// Clear cart items
router.delete("/clear-cart", verify, cartController.clearItems);

// Create Order
router.post("/checkout", verify, cartController.checkOut);



//[SECTION] Export Route System
// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router;