 // Dependecies and Modules
const express = require("express");
const productController = require("../controllers/product");

const {verify, verifyAdmin} = require("../auth");

//Routing Component  
const router = express.Router(); 


// Create a Product (Admin only) (S51) 
router.post("/", verify, verifyAdmin, productController.addProduct);

// Retrieve all Products (S51)
router.get("/all", productController.getAllProducts);

// Retrieve all Active Product (S51)
router.get("/", productController.getAllAvailable);

// Get Single Product (S51)
router.post("/:productId", productController.getProduct);

// Update Product Information (Admin Only) (S51)
router.patch("/update/:productId", verify, verifyAdmin, productController.updateProduct);

// Archive a Product (Admin Only) (S51)
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

// Activate a Product (Admin Only) (S51)
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);



// Search Product by name
router.post("/searchByName", productController.searchProductByName);

// Search Product by price
router.post("/searchByPrice", productController.searchByPrice);


// [Section]Export Route System
// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router; 